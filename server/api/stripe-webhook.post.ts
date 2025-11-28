import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripeSecret = config.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
  const webhookSecret = config.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseServiceKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY;

  if (!stripeSecret || !webhookSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe webhook configuration missing' });
  }
  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase service credentials are missing' });
  }

  const rawBody = await readRawBody(event);
  const signature = getRequestHeader(event, 'stripe-signature');
  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody ?? '', signature ?? '', webhookSecret);
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: `Webhook error: ${err.message}` });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const persistOrderStatus = async (orderId: string, session: Stripe.Checkout.Session) => {
    const { data: existing, error: fetchError } = await supabase
      .from('orders')
      .select('metadata, payment_ref')
      .eq('id', orderId)
      .maybeSingle();
    if (fetchError) {
      throw createError({ statusCode: 500, statusMessage: fetchError.message });
    }

    const updates: Record<string, any> = { status: 'ชำระเงินแล้ว' };
    if (session.amount_total != null) {
      updates.total_amount = session.amount_total / 100;
    }
    if (!existing?.payment_ref || !String(existing.payment_ref).startsWith('price_')) {
      updates.payment_ref = session.id;
    }

    const baseMetadata =
      existing?.metadata && typeof existing.metadata === 'object' ? existing.metadata : {};
    const mergedMetadata = { ...baseMetadata };
    mergedMetadata.stripe_session_id = session.id;
    mergedMetadata.stripe_payment_intent = session.payment_intent;
    mergedMetadata.stripe_session_status = session.status;
    mergedMetadata.stripe_customer = session.customer ?? session.customer_email ?? null;

    updates.metadata = mergedMetadata;

    await supabase.from('orders').update(updates).eq('id', orderId);
  };

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await persistOrderStatus(orderId, session);
    }
  }

  return { received: true };
});

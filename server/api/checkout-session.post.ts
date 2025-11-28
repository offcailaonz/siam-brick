import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { H3Event } from 'h3';
import { getRequestURL } from 'h3';

const getSiteUrl = (event: H3Event) => {
  const config = useRuntimeConfig();
  const fallback = (() => {
    const url = getRequestURL(event);
    return `${url.protocol}//${url.host}`;
  })();
  return (
    config.public.siteUrl ||
    process.env.SITE_URL ||
    fallback
  );
};

const coerceAmount = (value: any) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
};

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ orderId?: string | number }>(event);
  const orderId = body?.orderId ?? body?.['order_id'];
  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: 'orderId is required' });
  }

  const config = useRuntimeConfig();
  const stripeSecret = config.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseServiceKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY;

  if (!stripeSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe secret key is missing' });
  }
  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase service credentials are missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });
  const priceId = typeof order.payment_ref === 'string' && order.payment_ref.startsWith('price_') ? order.payment_ref : null;
  const amountCandidates = [
    order.total_amount,
    order.metadata?.format_price?.amount,
    order.metadata?.price,
    order.metadata?.priceKit
  ];
  const resolvedAmount = amountCandidates.map(coerceAmount).find((num) => num != null);

  if (!priceId && !resolvedAmount) {
    throw createError({ statusCode: 400, statusMessage: 'Order has no payable amount' });
  }

  const siteUrl = getSiteUrl(event).replace(/\/$/, '');
  const displayName =
    order.metadata?.product_name ||
    order.metadata?.title ||
    order.metadata?.tagline ||
    `Order #${order.id}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${siteUrl}/checkout?success=1&id=${order.id}`,
    cancel_url: `${siteUrl}/checkout?cancelled=1&id=${order.id}`,
    customer_email: order.email ?? order.metadata?.email ?? undefined,
    metadata: {
      order_id: String(order.id),
      user_id: order.user_id ? String(order.user_id) : ''
    },
    line_items: priceId
      ? [{ price: priceId, quantity: 1 }]
      : [
          {
            quantity: 1,
            price_data: {
              currency: 'thb',
              unit_amount: Math.max(1, Math.round(Number(resolvedAmount) * 100)),
              product_data: {
                name: displayName,
                metadata: {
                  order_id: String(order.id)
                }
              }
            }
          }
        ]
  });

  // Save session id/url to order metadata for traceability
  const baseMetadata = order.metadata && typeof order.metadata === 'object' ? order.metadata : {};
  const mergedMetadata = { ...baseMetadata };
  mergedMetadata.stripe_session_id = session.id;
  mergedMetadata.stripe_session_url = session.url;

  await supabase
    .from('orders')
    .update({
      metadata: mergedMetadata
    })
    .eq('id', order.id);

  return {
    url: session.url,
    sessionId: session.id
  };
});

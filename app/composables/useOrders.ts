import { useSupabaseClient } from '#imports';

type OrderPayload = {
  userId: string;
  previewUrl?: string | null;
  source?: string;
  totalAmount?: number | null;
  paymentReference?: string | null;
};

export const useOrders = () => {
  const supabase = useSupabaseClient();

  const recordPendingPaymentOrder = async (payload: OrderPayload) => {
    const insertPayload: Record<string, any> = {
      user_id: payload.userId,
      status: 'รอชำระเงิน',
      preview_url: payload.previewUrl ?? null,
      source: payload.source ?? 'checkout'
    };

    if (payload.totalAmount !== undefined) {
      insertPayload.total_amount = payload.totalAmount;
    }
    if (payload.paymentReference !== undefined) {
      insertPayload.payment_ref = payload.paymentReference;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const fetchMyOrders = async (userId: string, limit = 10) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  };

  return {
    recordPendingPaymentOrder,
    fetchMyOrders
  };
};

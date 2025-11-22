import { useSupabaseClient } from '#imports';

type OrderPayload = {
  userId: string;
  previewUrl?: string | null;
  source?: string;
  totalAmount?: number | null;
  paymentReference?: string | null;
  cropInteraction?: Record<string, any> | null;
  originalImage?: string | null;
  shipping?: Record<string, any> | null;
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

    if (payload.cropInteraction !== undefined) {
      insertPayload.crop_interaction = payload.cropInteraction;
    }
    if (payload.originalImage !== undefined) {
      insertPayload.original_image = payload.originalImage;
    }
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

    if (payload.shipping) {
      await supabase
        .from('order_shipping')
        .upsert({ order_id: data.id, ...payload.shipping }, { onConflict: 'order_id' });
    }

    return data;
  };

  const updateOrderAssets = async (
    orderId: string | number,
    payload: Pick<OrderPayload, 'previewUrl' | 'source' | 'cropInteraction' | 'originalImage'>,
    userId?: string
  ) => {
    const updatePayload: Record<string, any> = {};
    if (payload.previewUrl !== undefined) updatePayload.preview_url = payload.previewUrl;
    if (payload.source !== undefined) updatePayload.source = payload.source;
    if (payload.cropInteraction !== undefined) updatePayload.crop_interaction = payload.cropInteraction;
    if (payload.originalImage !== undefined) updatePayload.original_image = payload.originalImage;

    let query = supabase.from('orders').update(updatePayload).eq('id', orderId);
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  };

  const fetchMyOrders = async (userId: string, options?: { page?: number; pageSize?: number }) => {
    const page = Math.max(1, options?.page ?? 1);
    const pageSize = Math.max(1, options?.pageSize ?? 5);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      items: data ?? [],
      total: count ?? data?.length ?? 0,
      page,
      pageSize
    };
  };

  const fetchOrderById = async (orderId: string | number, userId?: string) => {
    let query = supabase.from('orders').select('*, order_shipping(*)').eq('id', orderId).limit(1);
    // เพิ่มกรอง user_id หากส่งมา ให้ตรงกับ RLS ที่จำกัดของผู้ใช้
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data;
  };

  const updateOrderStatus = async (orderId: string | number, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  const fetchOrderShipping = async (orderId: string | number) => {
    const { data, error } = await supabase.from('order_shipping').select('*').eq('order_id', orderId).maybeSingle();
    if (error) throw error;
    return data;
  };

  const upsertOrderShipping = async (orderId: string | number, shipping: Record<string, any>) => {
    const payload = { order_id: orderId, ...shipping };
    const { data, error } = await supabase
      .from('order_shipping')
      .upsert(payload, { onConflict: 'order_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  return {
    recordPendingPaymentOrder,
    updateOrderAssets,
    fetchMyOrders,
    fetchOrderById,
    updateOrderStatus,
    fetchOrderShipping,
    upsertOrderShipping
  };
};

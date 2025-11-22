import { useSupabaseClient } from '#imports';

export type UserAddress = {
  id?: number;
  user_id: string;
  label?: string | null;
  recipient_name?: string | null;
  phone?: string | null;
  address_line?: string | null;
  province?: string | null;
  district?: string | null;
  subdistrict?: string | null;
  postcode?: string | null;
  is_default?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export const useAddresses = () => {
  const supabase = useSupabaseClient();

  const fetchAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  };

  const createAddress = async (userId: string, payload: Partial<UserAddress>) => {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: userId,
        ...payload
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const updateAddress = async (addressId: number, payload: Partial<UserAddress>, userId?: string) => {
    let query = supabase.from('user_addresses').update(payload).eq('id', addressId);
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  };

  const deleteAddress = async (addressId: number, userId?: string) => {
    let query = supabase.from('user_addresses').delete().eq('id', addressId);
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { error } = await query;
    if (error) throw error;
    return true;
  };

  const setDefaultAddress = async (addressId: number, userId: string) => {
    // ปิดค่า default ทั้งหมดก่อน แล้วตั้ง address ที่เลือก
    const { error: clearError } = await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', userId);
    if (clearError) throw clearError;
    const { data, error } = await supabase
      .from('user_addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  return {
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  };
};

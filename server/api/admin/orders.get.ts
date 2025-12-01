import { createClient } from '@supabase/supabase-js';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

const ALLOWED_SORT_FIELDS = new Set(['created_at', 'updated_at', 'total_amount', 'id', 'status', 'customer_email']);

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const supabaseUrl = runtimeConfig.public.supabaseUrl;
  const serviceKey = runtimeConfig.supabaseServiceKey;
  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Missing Supabase config' });
  }

  const user = await serverSupabaseUser(event);
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Verify admin role using the authenticated context
  const authScoped = await serverSupabaseClient(event);
  const { data: roleRow, error: roleError } = await authScoped
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (roleError || roleRow?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  const query = getQuery(event);
  const take = Math.max(1, Math.min(100, Number(query.take ?? query.pageSize ?? 20)));
  const pageFromQuery = Number(query.page ?? 1);
  const skipQuery = Number(query.skip);
  const skip = Number.isFinite(skipQuery) ? Math.max(0, skipQuery) : Math.max(0, (Math.max(1, pageFromQuery) - 1) * take);
  const from = skip;
  const to = skip + take - 1;

  const rawSort = typeof query.sort === 'string' ? query.sort : '';
  const [rawField, rawDir] = rawSort.split(/[: ]/).filter(Boolean);
  const sortField = ALLOWED_SORT_FIELDS.has(rawField) ? rawField : 'created_at';
  const sortDirection = rawDir?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const statusFilter = typeof query.status === 'string' && query.status.trim() ? query.status.trim() : null;

  // Use service role to bypass RLS for admin view
  const serviceClient = createClient(supabaseUrl, serviceKey);
  let builder = serviceClient
    .from('orders_with_email')
    .select('*', { count: 'exact' })
    .order(sortField, { ascending: sortDirection === 'asc' })
    .range(from, to);

  if (statusFilter) {
    builder = builder.eq('status', statusFilter);
  }

  const { data, error, count } = await builder;

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  const total = typeof count === 'number' ? count : data?.length ?? 0;
  return {
    items: data ?? [],
    total,
    skip,
    take,
    sort: { field: sortField, direction: sortDirection }
  };
});

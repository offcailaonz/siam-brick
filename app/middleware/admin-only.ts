export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return;

  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();
  const user = supabaseUser.value;

  if (!user?.id) {
    return navigateTo('/profile');
  }

  const cachedRole = useState<{ userId: string | null; role: string | null }>('current-user-role', () => ({
    userId: null,
    role: null
  }));
  if (cachedRole.value.userId === user.id && cachedRole.value.role === 'admin') return;

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data?.role) {
    return navigateTo('/profile');
  }

  cachedRole.value = { userId: user.id, role: data.role };
  if (data.role !== 'admin') {
    return navigateTo('/profile');
  }
});

export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return;

  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();

  // cache checks to avoid hitting auth endpoint on every minor navigation
  const lastCheck = useState<number | null>('auth-last-check', () => null);
  const now = Date.now();
  if (lastCheck.value && now - lastCheck.value < 60_000) return;

  const { error } = await supabase.auth.getUser();
  lastCheck.value = Date.now();

  if (error) {
    // token ไม่ใช้การได้แล้ว → เคลียร์ session ทิ้ง
    await supabase.auth.signOut();
    supabaseUser.value = null;
  }
});

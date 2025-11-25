import { computed, watch } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

export const useAuthFlow = () => {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();
  const user = computed(() => supabaseUser.value);
  const authModalOpen = useState('auth-modal-open', () => false);
  const pendingAction = useState<(() => void) | null>('pending-auth-action', () => null);

  watch(
    user,
    (val) => {
      if (val) {
        authModalOpen.value = false;
      }
    },
    { immediate: true }
  );

  const openAuthModal = () => {
    authModalOpen.value = true;
  };

  const closeAuthModal = () => {
    authModalOpen.value = false;
    pendingAction.value = null;
  };

  const requireAuth = (next?: () => void) => {
    if (user.value) {
      next?.();
      return true;
    }
    pendingAction.value = next ?? null;
    authModalOpen.value = true;
    return false;
  };

  const handleAuthenticated = () => {
    authModalOpen.value = false;
    const action = pendingAction.value;
    pendingAction.value = null;
    action?.();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    const cachedRole = useState<{ userId: string | null; role: string | null }>('current-user-role', () => ({
      userId: null,
      role: null
    }));
    cachedRole.value = { userId: null, role: null };
    if (process.client) {
      navigateTo('/');
    }
  };

  return {
    user,
    authModalOpen,
    pendingAction,
    openAuthModal,
    closeAuthModal,
    requireAuth,
    handleAuthenticated,
    signOut
  };
};

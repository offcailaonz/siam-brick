import { useSupabaseUser } from '#imports';

export const useAuthFlow = () => {
  const user = useSupabaseUser();
  const authModalOpen = useState('auth-modal-open', () => false);
  const pendingAction = useState<(() => void) | null>('pending-auth-action', () => null);

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

  return {
    user,
    authModalOpen,
    pendingAction,
    openAuthModal,
    closeAuthModal,
    requireAuth,
    handleAuthenticated
  };
};

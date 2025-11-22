import { computed } from 'vue';
import { useCookie, useState } from '#imports';

export type OrderConfig = {
  defaultPrice: number;
  holdMinutes: number;
  lastUpdatedAt: string | null;
};

const STORAGE_KEY = 'siam-brick-order-config';
const DEFAULT_CONFIG: OrderConfig = {
  defaultPrice: 999,
  holdMinutes: 60,
  lastUpdatedAt: null
};

export const useOrderConfig = () => {
  // เก็บค่าใน cookie เพื่อให้รอดการรีเฟรช (เลี่ยง dependency เพิ่ม)
  const configCookie = useCookie<OrderConfig | null>(STORAGE_KEY, {
    default: () => null,
    sameSite: 'lax'
  });
  const orderConfig = useState<OrderConfig>('order-config-state', () => {
    if (configCookie.value) return configCookie.value;
    const initial = { ...DEFAULT_CONFIG, lastUpdatedAt: new Date().toISOString() };
    configCookie.value = initial;
    return initial;
  });

  const updateOrderConfig = (updates: Partial<OrderConfig>) => {
    orderConfig.value = {
      ...orderConfig.value,
      ...updates,
      lastUpdatedAt: updates.lastUpdatedAt ?? new Date().toISOString()
    };
    configCookie.value = orderConfig.value;
  };

  const resetOrderConfig = () => {
    orderConfig.value = { ...DEFAULT_CONFIG, lastUpdatedAt: new Date().toISOString() };
    configCookie.value = orderConfig.value;
  };

  const hasCustomPrice = computed(() => orderConfig.value.defaultPrice !== DEFAULT_CONFIG.defaultPrice);

  return { orderConfig, updateOrderConfig, resetOrderConfig, hasCustomPrice };
};

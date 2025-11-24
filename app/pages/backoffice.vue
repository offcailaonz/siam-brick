<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-68px-68px)] w-full flex flex-col px-4 py-10 lg:px-8 lg:py-14 text-slate-800"
    >
      <section class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
        <header class="border-b border-slate-200 bg-slate-50/80 px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">Backoffice</p>
            <h1 class="mt-1 text-2xl font-bold text-slate-900">ภาพรวมออเดอร์และสต็อก</h1>
            <p class="mt-2 text-sm text-slate-600">
              ตรวจออเดอร์ล่าสุด ปรับสถานะ ดูสต็อก และสินค้า/คอนเทนต์ที่แสดงหน้าเว็บ
            </p>
          </div>
          <div v-if="user" class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
            <span class="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              {{ user.email?.charAt(0)?.toUpperCase() || 'U' }}
            </span>
            <span>{{ user.email }}</span>
          </div>
        </header>

        <div v-if="!user" class="px-5 py-6">
          <div class="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-slate-900">กรุณาเข้าสู่ระบบ</p>
              <p class="text-xs text-slate-600">เพื่อเข้าถึงข้อมูลออเดอร์และสต็อก</p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
              @click="openAuthModal"
            >
              เข้าสู่ระบบ
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.146 11.354a.5.5 0 0 1 0-.708L8.793 8 6.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="px-5 py-6">
          <div class="grid gap-6 lg:grid-cols-[260px,1fr]">
            <aside class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm h-fit sticky top-4 space-y-2">
              <p class="text-sm font-semibold text-slate-900">เมนูจัดการ</p>
              <p class="text-[11px] text-slate-500">เลือกหมวดเพื่อแก้ไข</p>
              <nav class="mt-2 space-y-1 text-sm">
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition"
                  :class="activeMenu === 'order-config' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'order-config'"
                >
                  <span>Order config</span>
                  <span class="text-[11px] text-slate-500">ตั้งค่า</span>
                </button>
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition"
                  :class="activeMenu === 'orders' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'orders'"
                >
                  <span>ออเดอร์ล่าสุด</span>
                  <span class="text-[11px] text-slate-500">20 รายการ</span>
                </button>
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition"
                  :class="activeMenu === 'inventory' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'inventory'"
                >
                  <span>สต็อกวัสดุ</span>
                  <span class="text-[11px] text-slate-500">on hand</span>
                </button>
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition"
                  :class="activeMenu === 'products' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'products'"
                >
                  <span>สินค้า/คอนเทนต์</span>
                  <span class="text-[11px] text-slate-500">หน้าเว็บ</span>
                </button>
              </nav>
            </aside>

            <div class="space-y-5">
              <OrderConfigSection
                v-if="activeMenu === 'order-config'"
                :price="configForm.price"
                :hold-minutes="configForm.holdMinutes"
                :last-updated-at="orderConfigSafe.lastUpdatedAt"
                :saving="configSaving"
                :saved-message="configSavedMessage"
                :error="configError"
                :format-date="formatDate"
                @update:price="configForm.price = $event"
                @update:holdMinutes="configForm.holdMinutes = $event"
                @save="handleConfigSave"
              />

              <OrdersSection
                v-else-if="activeMenu === 'orders'"
                :orders="orders"
                :loading="ordersLoading"
                :error="ordersError"
                :status-options="statusOptions"
                :status-drafts="statusDrafts"
                :is-updating-status="isUpdatingStatus"
                :status-update-errors="statusUpdateErrors"
                :format-currency="formatCurrency"
                :format-date="formatDate"
                @refresh="loadOrders"
                @update-draft="updateStatusDraft"
                @save-status="handleStatusChange"
              />

              <InventorySection
                v-else-if="activeMenu === 'inventory'"
                :items="inventory"
                :loading="inventoryLoading"
                :error="inventoryError"
                @refresh="loadInventory"
              />

              <ProductsSection
                v-else-if="activeMenu === 'products'"
                :products="products"
                :loading="productsLoading"
                :error="productsError"
                :format-currency="formatCurrency"
                @refresh="loadProducts"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { useOrderConfig } from '~/composables/useOrderConfig';
import { useOrders } from '~/composables/useOrders';
import OrderConfigSection from '~/components/backoffice/OrderConfigSection.vue';
import OrdersSection from '~/components/backoffice/OrdersSection.vue';
import InventorySection from '~/components/backoffice/InventorySection.vue';
import ProductsSection from '~/components/backoffice/ProductsSection.vue';

const { openAuthModal, user } = useAuthFlow();
const supabase = useSupabaseClient();
const { updateOrderStatus, cancelOrder } = useOrders();
const { orderConfig, updateOrderConfig } = useOrderConfig();

const orders = ref<Array<Record<string, any>>>([]);
const ordersLoading = ref(false);
const ordersError = ref<string | null>(null);
const activeMenu = ref<'order-config' | 'orders' | 'inventory' | 'products'>('order-config');

const statusOptions = [
  'รอชำระเงิน',
  'ชำระแล้ว',
  'กำลังตรวจสอบ',
  'กำลังจัดส่ง',
  'สำเร็จ',
  'ยกเลิก'
];
const statusDrafts = ref<Record<string, string>>({});
const isUpdatingStatus = ref<Record<string, boolean>>({});
const statusUpdateErrors = ref<Record<string, string | null>>({});
const configForm = reactive({ price: 999, holdMinutes: 60 });
const configSaving = ref(false);
const configSavedMessage = ref<string | null>(null);
const configError = ref<string | null>(null);
let configMessageTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  orderConfig,
  (next) => {
    if (!next) return;
    configForm.price = next.defaultPrice ?? configForm.price;
    configForm.holdMinutes = next.holdMinutes ?? configForm.holdMinutes;
  },
  { immediate: true }
);

const orderConfigSafe = computed(() => {
  return {
    defaultPrice: orderConfig?.value?.defaultPrice ?? configForm.price,
    holdMinutes: orderConfig?.value?.holdMinutes ?? configForm.holdMinutes,
    lastUpdatedAt: orderConfig?.value?.lastUpdatedAt ?? null
  };
});

const inventory = ref<Array<Record<string, any>>>([]);
const inventoryLoading = ref(false);
const inventoryError = ref<string | null>(null);

const products = ref<Array<Record<string, any>>>([]);
const productsLoading = ref(false);
const productsError = ref<string | null>(null);

const statusClass = (status: string | null | undefined) => {
  if (!status) return 'badge-grey';
  const s = String(status).toLowerCase();
  if (s.includes('paid') || s.includes('complete') || s.includes('done')) return 'badge-green';
  if (s.includes('ship')) return 'badge-blue';
  if (s.includes('pending') || s.includes('รอชำระ')) return 'badge-amber';
  if (s.includes('cancel')) return 'badge-grey';
  return 'badge-blue';
};

const formatCurrency = (value: number | string | null | undefined) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(num);
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return '-';
  try {
    return new Intl.DateTimeFormat('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const statusDraftValue = (orderId: string | number) => {
  return statusDrafts.value[String(orderId)] ?? 'รอชำระเงิน';
};

const updateStatusDraft = (orderId: string | number, nextValue: string) => {
  statusDrafts.value[String(orderId)] = nextValue;
  statusUpdateErrors.value[String(orderId)] = null;
};

const syncStatusDrafts = () => {
  const next: Record<string, string> = {};
  orders.value.forEach((order) => {
    if (!order?.id) return;
    next[String(order.id)] = order.status ?? 'รอชำระเงิน';
  });
  statusDrafts.value = next;
};

const handleStatusChange = async (orderId: string | number, newStatus: string) => {
  if (!newStatus) return;
  const key = String(orderId);
  isUpdatingStatus.value[key] = true;
  statusUpdateErrors.value[key] = null;
  try {
    const updated =
      newStatus === 'ยกเลิก'
        ? await cancelOrder(orderId, 'ยกเลิกโดยแอดมิน')
        : await updateOrderStatus(orderId, newStatus);
    if (updated) {
      orders.value = orders.value.map((order) => {
        if (order.id === updated.id) {
          return updated;
        }
        return order;
      });
      statusDrafts.value[key] = updated.status ?? newStatus;
    }
  } catch (error: any) {
    statusUpdateErrors.value[key] = error?.message ?? 'ไม่สามารถอัปเดตสถานะได้';
  } finally {
    isUpdatingStatus.value[key] = false;
  }
};

const handleConfigSave = () => {
  configSaving.value = true;
  configError.value = null;
  try {
    const normalizedPrice = Math.max(0, Number(configForm.price));
    const normalizedHold = Math.max(1, Number(configForm.holdMinutes));
    updateOrderConfig({
      defaultPrice: normalizedPrice,
      holdMinutes: normalizedHold
    });
    configSavedMessage.value = 'บันทึกเรียบร้อย';
    if (configMessageTimeout) {
      clearTimeout(configMessageTimeout);
    }
    configMessageTimeout = setTimeout(() => {
      configSavedMessage.value = null;
    }, 2500);
  } catch (error: any) {
    configError.value = error?.message ?? 'ไม่สามารถบันทึก config ได้';
  } finally {
    configSaving.value = false;
  }
};

const loadOrders = async () => {
  ordersLoading.value = true;
  ordersError.value = null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    orders.value = data ?? [];
    syncStatusDrafts();
  } catch (error: any) {
    ordersError.value = error?.message ?? 'เกิดข้อผิดพลาด';
    orders.value = [];
    statusDrafts.value = {};
  } finally {
    ordersLoading.value = false;
  }
};

const loadInventory = async () => {
  inventoryLoading.value = true;
  inventoryError.value = null;
  try {
    const { data, error } = await supabase.from('inventory_items').select('*').order('updated_at', { ascending: false }).limit(50);
    if (error) throw error;
    inventory.value = data ?? [];
  } catch (error: any) {
    inventoryError.value = error?.message ?? 'เกิดข้อผิดพลาด';
    inventory.value = [];
  } finally {
    inventoryLoading.value = false;
  }
};

const loadProducts = async () => {
  productsLoading.value = true;
  productsError.value = null;
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    products.value = data ?? [];
  } catch (error: any) {
    productsError.value = error?.message ?? 'เกิดข้อผิดพลาด';
    products.value = [];
  } finally {
    productsLoading.value = false;
  }
};

const loadAll = async () => {
  await Promise.allSettled([loadOrders(), loadInventory(), loadProducts()]);
};

watch(
  () => user?.value?.id,
  (next) => {
    if (next) {
      loadAll();
    } else {
      orders.value = [];
      inventory.value = [];
      products.value = [];
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (user?.value?.id) {
    loadAll();
  }
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 11px;
  font-weight: 600;
}
.badge-green {
  background: #ecfdf3;
  color: #047857;
}
.badge-blue {
  background: #eef2ff;
  color: #4338ca;
}
.badge-amber {
  background: #fffbeb;
  color: #b45309;
}
.badge-grey {
  background: #f1f5f9;
  color: #475569;
}

@mixin brick-bg($color, $hue: 0deg) {
  $brick-peg-size: 15px;
  $brick-wall-thickness: 6px;
  $brick-square: $brick-peg-size + $brick-wall-thickness * 2;

  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;

    background-color: $color;
    background-image:
      radial-gradient($color $brick-peg-size/2, transparent $brick-peg-size/2+1px),
      radial-gradient(rgba(#fff, .4) $brick-peg-size/2, transparent $brick-peg-size/2+1px),
      radial-gradient(rgba(#000, .18) $brick-peg-size/2, transparent $brick-peg-size/2+$brick-wall-thickness/2),
      radial-gradient(rgba(#000, .18) $brick-peg-size/2, transparent $brick-peg-size/2+$brick-wall-thickness/2);

    background-size: $brick-square $brick-square;
    background-position:
      0px 0px,
      -0.5px -0.5px,
      0px 0px,
      $brick-wall-thickness/2 $brick-wall-thickness/2;

    background-repeat: repeat;

    filter: hue-rotate($hue);
  }
}

.brick-bg--content {
  @include brick-bg(#1E3A8A, 0deg);
}
</style>

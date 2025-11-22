<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-6xl flex-col px-4 py-10 lg:py-14 text-slate-800"
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

        <div v-else class="grid gap-6 px-5 py-6 lg:grid-cols-[1.6fr,1fr]">
          <div class="space-y-5">
            <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-slate-900">Order config</p>
                  <p class="text-xs text-slate-500">
                    ปรับราคาเริ่มต้นและระยะเวลาจองรายการที่หน้า checkout
                  </p>
                </div>
                <span class="text-[11px] font-semibold text-slate-500">
                  เก็บข้อมูล {{ orderConfig.value.holdMinutes }} นาที
                </span>
              </div>
              <form class="mt-4 space-y-3" @submit.prevent="handleConfigSave">
                <div>
                  <label class="text-[11px] font-semibold text-slate-500" for="config-price">ราคาเริ่มต้น (THB)</label>
                  <input
                    id="config-price"
                    type="number"
                    min="0"
                    class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    v-model.number="configForm.price"
                  />
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-slate-500" for="config-hold">เวลาเก็บออเดอร์ (นาที)</label>
                  <input
                    id="config-hold"
                    type="number"
                    min="1"
                    class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    v-model.number="configForm.holdMinutes"
                  />
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="configSaving"
                  >
                    <span v-if="configSaving">กำลังบันทึก…</span>
                    <span v-else>บันทึก config</span>
                  </button>
                  <p v-if="configSavedMessage" class="text-xs text-emerald-600">
                    {{ configSavedMessage }}
                  </p>
                  <p v-else class="text-xs text-slate-500">
                    อัปเดตล่าสุด {{ orderConfig.value.lastUpdatedAt ? formatDate(orderConfig.value.lastUpdatedAt) : '-' }}
                  </p>
                </div>
                <p v-if="configError" class="text-xs text-rose-600">{{ configError }}</p>
              </form>
            </section>
            <!-- Orders -->
            <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">ออเดอร์ล่าสุด</p>
                  <p class="text-xs text-slate-500">แสดง 20 รายการล่าสุด เรียงจากใหม่ไปเก่า</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  :disabled="ordersLoading"
                  @click="loadOrders"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 1 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.967A.25.25 0 0 0 8 4.466z"/>
                  </svg>
                  รีเฟรช
                </button>
              </div>
              <p v-if="ordersError" class="mt-2 text-xs text-rose-600">ไม่สามารถโหลดออเดอร์: {{ ordersError }}</p>
              <div v-else class="mt-3 overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead>
                    <tr class="text-left text-slate-500">
                      <th class="px-2 py-2">ออเดอร์</th>
                      <th class="px-2 py-2">ลูกค้า</th>
                      <th class="px-2 py-2">สถานะ</th>
                      <th class="px-2 py-2">ยอด</th>
                      <th class="px-2 py-2">อัปเดต</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="ordersLoading">
                      <td colspan="5" class="px-2 py-3 text-center text-slate-500">กำลังโหลด...</td>
                    </tr>
                    <tr v-else-if="orders.length === 0">
                      <td colspan="5" class="px-2 py-3 text-center text-slate-500">ยังไม่มีออเดอร์</td>
                    </tr>
                    <tr v-else v-for="order in orders" :key="order.id" class="border-t border-slate-100 hover:bg-slate-50">
                      <td class="px-2 py-2 font-semibold text-slate-900">
                        #{{ order.id }}
                      </td>
                      <td class="px-2 py-2 text-slate-700">
                        {{ order.customer_email || order.user_id || '-' }}
                      </td>
                      <td class="px-2 py-2">
                        <div class="flex flex-col gap-2 text-sm">
                          <span class="badge" :class="statusClass(order.status)">{{ order.status || 'รอชำระเงิน' }}</span>
                          <div class="flex flex-wrap items-center gap-2">
                            <select
                              class="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] text-slate-700 shadow-sm"
                              :value="statusDraftValue(order.id)"
                              @change="(event) => updateStatusDraft(order.id, event.target.value)"
                            >
                              <option v-for="option in statusOptions" :key="option" :value="option">
                                {{ option }}
                              </option>
                            </select>
                            <button
                              type="button"
                              class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                              :disabled="isUpdatingStatus[String(order.id)]"
                              @click="handleStatusChange(order.id, statusDraftValue(order.id))"
                            >
                              <span v-if="isUpdatingStatus[String(order.id)]">บันทึก…</span>
                              <span v-else>บันทึก</span>
                            </button>
                          </div>
                          <p v-if="statusUpdateErrors[String(order.id)]" class="text-[11px] text-rose-600">
                            {{ statusUpdateErrors[String(order.id)] }}
                          </p>
                        </div>
                      </td>
                      <td class="px-2 py-2 text-slate-700">
                        {{ formatCurrency(order.total_amount) }}
                      </td>
                      <td class="px-2 py-2 text-slate-500 text-xs">
                        {{ formatDate(order.updated_at || order.created_at) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Inventory -->
            <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">สต็อกวัสดุ</p>
                  <p class="text-xs text-slate-500">ดูยอดคงเหลือและรายการที่ใกล้หมด</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  :disabled="inventoryLoading"
                  @click="loadInventory"
                >
                  รีเฟรช
                </button>
              </div>
              <p v-if="inventoryError" class="mt-2 text-xs text-rose-600">โหลดสต็อกไม่สำเร็จ: {{ inventoryError }}</p>
              <div v-else class="mt-3 space-y-2 max-h-[340px] overflow-auto pr-1">
                <div v-if="inventoryLoading" class="text-sm text-slate-500 px-1">กำลังโหลด...</div>
                <div v-else-if="inventory.length === 0" class="text-sm text-slate-500 px-1">ยังไม่มีสต็อก</div>
                <div
                  v-else
                  v-for="item in inventory"
                  :key="item.id || item.sku"
                  class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-900">{{ item.name || item.sku }}</span>
                    <span class="text-xs text-slate-500">{{ item.part_num || item.sku || 'ไม่ระบุรหัส' }}</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-slate-900">
                      {{ item.on_hand ?? 0 }} ชิ้น
                    </p>
                    <p class="text-[11px]" :class="item.on_hand <= (item.reorder_point ?? 0) ? 'text-amber-600' : 'text-slate-500'">
                      จุดสั่งซื้อ {{ item.reorder_point ?? 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Products -->
          <aside class="space-y-5">
            <section class="rounded-xl border border-indigo-100 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">สินค้า/คอนเทนต์</p>
                  <p class="text-xs text-slate-500">รายการสินค้าที่แสดงบนหน้าเว็บ</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  :disabled="productsLoading"
                  @click="loadProducts"
                >
                  รีเฟรช
                </button>
              </div>
              <p v-if="productsError" class="mt-2 text-xs text-rose-600">โหลดสินค้าไม่สำเร็จ: {{ productsError }}</p>
              <div v-else class="mt-3 space-y-2 max-h-[420px] overflow-auto pr-1">
                <div v-if="productsLoading" class="text-sm text-slate-500 px-1">กำลังโหลด...</div>
                <div v-else-if="products.length === 0" class="text-sm text-slate-500 px-1">ยังไม่มีสินค้า</div>
                <div
                  v-else
                  v-for="product in products"
                  :key="product.id"
                  class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <p class="text-sm font-semibold text-slate-900">{{ product.name }}</p>
                      <p class="text-xs text-slate-500">{{ product.slug || product.type || 'สินค้า' }}</p>
                    </div>
                    <span
                      class="badge"
                      :class="product.active === false ? 'badge-grey' : 'badge-green'"
                    >
                      {{ product.active === false ? 'ปิด' : 'ขายอยู่' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">
                    ราคา {{ product.price != null ? formatCurrency(product.price) : '—' }}
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useOrderConfig } from '~/composables/useOrderConfig';
import { useOrders } from '~/composables/useOrders';

const { openAuthModal, user } = useAuthFlow();
const supabase = useSupabaseClient();
const { updateOrderStatus } = useOrders();
const { orderConfig, updateOrderConfig } = useOrderConfig();

const orders = ref<Array<Record<string, any>>>([]);
const ordersLoading = ref(false);
const ordersError = ref<string | null>(null);

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
    configForm.price = next.defaultPrice ?? configForm.price;
    configForm.holdMinutes = next.holdMinutes ?? configForm.holdMinutes;
  },
  { immediate: true }
);

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
    const updated = await updateOrderStatus(orderId, newStatus);
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

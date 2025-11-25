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
              ตรวจออเดอร์ล่าสุด ปรับสถานะ และสินค้าที่แสดงหน้าเว็บ
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
                  :class="activeMenu === 'orders' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'orders'"
                >
                  <span>ออเดอร์ล่าสุด</span>
                </button>
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition"
                  :class="activeMenu === 'products' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'products'"
                >
                  <span>สินค้า</span>
                </button>
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition"
                  :class="activeMenu === 'users' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'users'"
                >
                  <span>ผู้ใช้</span>
                  <span class="text-[11px] text-slate-500">role</span>
                </button>
              </nav>
            </aside>

            <Transition name="menu-swap" mode="out-in">
              <div :key="activeMenu" class="space-y-5">
                <OrdersSection
                  v-if="activeMenu === 'orders'"
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

                <ProductsSection
                  v-else-if="activeMenu === 'products'"
                  :products="products"
                  :loading="productsLoading"
                  :error="productsError"
                  :format-currency="formatCurrency"
                  :saving="productSaving"
                  :save-error="productSaveError"
                  @refresh="loadProducts"
                  @save="handleSaveProduct"
                  @delete="handleDeleteProduct"
                />

                <UserRolesSection
                  v-else-if="activeMenu === 'users'"
                  :roles="userRoles"
                  :loading="userRolesLoading"
                  :error="userRolesError"
                  @refresh="loadUserRoles"
                  @update-role="handleUpdateRole"
                  @delete="handleDeleteUser"
                />
              </div>
            </Transition>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useOrders } from '~/composables/useOrders';
import OrdersSection from '~/components/backoffice/OrdersSection.vue';
import ProductsSection from '~/components/backoffice/ProductsSection.vue';
import UserRolesSection from '~/components/backoffice/UserRolesSection.vue';

definePageMeta({
  middleware: ['admin-only']
});

const { openAuthModal, user } = useAuthFlow();
const supabase = useSupabaseClient();
const { updateOrderStatus, cancelOrder } = useOrders();

const orders = ref<Array<Record<string, any>>>([]);
const ordersLoading = ref(false);
const ordersError = ref<string | null>(null);
const activeMenu = ref<'orders' | 'products' | 'users'>('orders');

const statusOptions = ['รอชำระเงิน', 'ชำระแล้ว', 'กำลังตรวจสอบ', 'กำลังจัดส่ง', 'สำเร็จ', 'ยกเลิก'];
const statusDrafts = ref<Record<string, string>>({});
const isUpdatingStatus = ref<Record<string, boolean>>({});
const statusUpdateErrors = ref<Record<string, string | null>>({});
const products = ref<Array<Record<string, any>>>([]);
const productsLoading = ref(false);
const productsError = ref<string | null>(null);
const userRoles = ref<Array<Record<string, any>>>([]);
const userRolesLoading = ref(false);
const userRolesError = ref<string | null>(null);
const productSaving = ref(false);
const productSaveError = ref<string | null>(null);

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

const loadOrders = async () => {
  ordersLoading.value = true;
  ordersError.value = null;
  try {
    const { data, error } = await supabase
      .from('orders_with_email')
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

const loadUserRoles = async () => {
  userRolesLoading.value = true;
  userRolesError.value = null;
  try {
    const { data, error } = await supabase.from('user_roles').select('user_id, email, role, created_at').order('created_at', { ascending: false });
    if (error) throw error;
    userRoles.value = data ?? [];
  } catch (error: any) {
    userRolesError.value = error?.message ?? 'โหลดรายชื่อผู้ใช้ไม่สำเร็จ';
    userRoles.value = [];
  } finally {
    userRolesLoading.value = false;
  }
};

const handleUpdateRole = async (userId: string, role: string) => {
  try {
    const { error } = await supabase.from('user_roles').update({ role }).eq('user_id', userId);
    if (error) throw error;
    await loadUserRoles();
  } catch (error: any) {
    userRolesError.value = error?.message ?? 'อัปเดต role ไม่สำเร็จ';
  }
};

const handleDeleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
    if (error) throw error;
    await loadUserRoles();
  } catch (error: any) {
    userRolesError.value = error?.message ?? 'ลบผู้ใช้ไม่สำเร็จ';
  }
};

const handleSaveProduct = async (payload: any) => {
  productSaving.value = true;
  productSaveError.value = null;
  try {
    const metadata = {
      tag: payload.tag || null,
      studs: payload.studs ?? null,
      difficulty: payload.difficulty || null,
      size: payload.size || null,
      image: payload.image || null,
      priceInstructions: payload.priceInstructions ?? null
    };
    const { error } = await supabase
      .from('products')
      .upsert(
        {
          id: payload.id ?? undefined,
          name: payload.name,
          slug: payload.slug,
          price: payload.priceKit ?? payload.priceInstructions ?? 0,
          active: payload.active !== false,
          metadata
        },
        { onConflict: 'slug' }
      );
    if (error) throw error;
    await loadProducts();
  } catch (error: any) {
    productSaveError.value = error?.message ?? 'บันทึกสินค้าไม่สำเร็จ';
  } finally {
    productSaving.value = false;
  }
};

const handleDeleteProduct = async (id: number | string) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await loadProducts();
  } catch (error: any) {
    productsError.value = error?.message ?? 'ลบสินค้าไม่สำเร็จ';
  }
};

const loadAll = async () => {
  await Promise.allSettled([loadOrders(), loadProducts(), loadUserRoles()]);
};

watch(
  () => user?.value?.id,
  (next) => {
    if (next) {
      loadAll();
    } else {
      orders.value = [];
      products.value = [];
    }
  },
  { immediate: true }
);
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

.menu-swap-enter-active,
.menu-swap-leave-active {
  transition: opacity 180ms ease, transform 200ms ease;
}
.menu-swap-enter-from,
.menu-swap-leave-to {
  opacity: 0;
  transform: translateY(8px);
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

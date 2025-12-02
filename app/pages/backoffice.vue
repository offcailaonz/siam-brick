<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-68px-68px)] w-full flex flex-col px-4 py-10 lg:px-8 lg:py-14 text-slate-800"
    >
      <section
        class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden"
      >
        <header
          class="border-b border-slate-200 bg-slate-50/80 px-5 py-4 flex items-center justify-between gap-3"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-amber-600"
            >
              Backoffice
            </p>
            <h1 class="mt-1 text-2xl font-bold text-slate-900">
              ภาพรวมออเดอร์และสต็อก
            </h1>
            <p class="mt-2 text-sm text-slate-600">
              ตรวจออเดอร์ล่าสุด ปรับสถานะ และสินค้าที่แสดงหน้าเว็บ
            </p>
          </div>
          <div
            v-if="user"
            class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm"
          >
            <span
              class="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center"
            >
              {{ user.email?.charAt(0)?.toUpperCase() || 'U' }}
            </span>
            <span>{{ user.email }}</span>
          </div>
        </header>

        <div v-if="!user" class="px-5 py-6">
          <div
            class="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <p class="text-sm font-semibold text-slate-900">
                กรุณาเข้าสู่ระบบ
              </p>
              <p class="text-xs text-slate-600">
                เพื่อเข้าถึงข้อมูลออเดอร์และสต็อก
              </p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
              @click="openAuthModal"
            >
              เข้าสู่ระบบ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M6.146 11.354a.5.5 0 0 1 0-.708L8.793 8 6.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="px-5 py-6">
          <div class="grid gap-6 lg:grid-cols-[260px,1fr]">
            <aside
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm h-fit sticky top-4 space-y-2"
            >
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
                  :class="activeMenu === 'formats' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-700 hover:bg-slate-50'"
                  @click="activeMenu = 'formats'"
                >
                  <span>รูปแบบ/ราคา</span>
                  <span class="text-[11px] text-slate-500">10 ขนาด</span>
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
                  :selected-ids="selectedOrderIdList"
                  :page="ordersPage"
                  :total-pages="ordersTotalPages"
                  :page-size="ordersPageSize"
                  :total="ordersTotal"
                  :sort="ordersSort"
                  :status-filter="ordersStatusFilter"
                  @refresh="loadOrders"
                  @update-draft="updateStatusDraft"
                  @save-status="handleStatusChange"
                  @view-details="openOrderDetails"
                  @change-page="goOrdersPage"
                  @change-sort="changeOrdersSort"
                  @change-status-filter="changeOrdersStatusFilter"
                  @toggle-select="toggleOrderSelection"
                  @toggle-select-page="toggleOrderSelectionPage"
                  @export-selected="exportSelectedOrders"
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

                <FormatPricesSection
                  v-else-if="activeMenu === 'formats'"
                  :formats="formatPrices"
                  :loading="formatPricesLoading"
                  :error="formatPricesError"
                  :saving="formatPricesSaving"
                  :adding="formatAdding"
                  :parts="partPrices"
                  :parts-loading="partPricesLoading"
                  :part-saving="partPricesSaving"
                  :part-error="partPricesError"
                  :saving-all-formats="formatPricesLoading"
                  :saving-all-parts="partPricesSavingAll"
                  :extras="extraCosts"
                  :extras-loading="extraCostsLoading"
                  :extras-saving="extraCostsSaving"
                  @refresh="() => { loadFormatPrices(); loadPartPrices(); loadExtraCosts(); }"
                  @save="handleSaveFormatPrice"
                  @save-all-formats="handleSaveAllFormatPrices"
                  @add="handleAddFormatSize"
                  @delete="handleDeleteFormatSize"
                  @save-part="handleSavePartPrice"
                  @save-extras="handleSaveExtraCosts"
                  @save-all-parts="handleSaveAllPartPrices"
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
    <BaseModal
      :open="orderDetailOpen"
      :title="orderDetail ? `รายละเอียดออเดอร์ #${orderDetail.id}` : 'รายละเอียดออเดอร์'"
      max-width-class="max-w-5xl"
      @close="closeOrderDetails"
    >
      <div v-if="orderDetail" class="space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div class="h-36 w-36 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              v-if="orderPreview(orderDetail)"
              :src="orderPreview(orderDetail)"
              alt="preview"
              class="h-full w-full object-contain"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-500">
              ไม่มีตัวอย่าง
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-2 text-sm text-slate-700">
            <p><span class="text-slate-500">ลูกค้า:</span> {{ orderDetail.customer_email || orderDetail.user_id || '-' }}</p>
            <p>
              <span class="text-slate-500">ยอด:</span>
              {{ formatCurrency(orderDetail.total_amount) }}
            </p>
            <p class="text-slate-500">
              Stud รวม {{ orderStudTotal }} ชิ้น | สี {{ orderStudUsage.length }} สี
            </p>
          </div>
        </div>
        <div v-if="orderStudUsage.length" class="rounded-xl border border-slate-200 bg-white">
          <div class="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3 max-h-80 overflow-y-auto pr-2">
            <div
              v-for="usage in orderStudUsage"
              :key="usage.hex"
              class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <div class="flex items-center gap-2">
                <span
                  class="h-5 w-5 rounded-full border border-slate-200"
                  :style="{ backgroundColor: usage.hex || '#e5e7eb' }"
                  aria-hidden="true"
                ></span>
                <div class="flex flex-col leading-tight">
                  <span class="text-xs text-slate-500">{{ usage.name }}</span>
                  <span class="text-[11px] text-slate-400 break-all">{{ usage.hex }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end leading-tight">
                <span class="text-xs text-slate-500">ID</span>
                <span class="font-semibold text-slate-800">{{ usage.bricklinkId ?? '—' }}</span>
                <span class="text-xs text-slate-500">× {{ usage.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-slate-500">ไม่มีข้อมูลสี stud สำหรับออเดอร์นี้</p>
        <div v-if="orderFormatDetails" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p class="text-sm font-semibold text-slate-800">
            รายละเอียดจากรูปแบบ ({{ orderFormatDetails.width }}x{{ orderFormatDetails.height }})
          </p>
          <div class="mt-2 grid gap-2 sm:grid-cols-3">
            <div class="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
              <span>ฐาน 32x32</span>
              <span class="font-semibold">× {{ orderFormatDetails.base32 }}</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
              <span>ฐาน 16x16</span>
              <span class="font-semibold">× {{ orderFormatDetails.base16 }}</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
              <span>รูแขวน</span>
              <span class="font-semibold">× {{ orderFormatDetails.hanger }}</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
              <span>มุม</span>
              <span class="font-semibold">× {{ orderFormatDetails.corners }}</span>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
              <span>ขอบ</span>
              <span class="font-semibold">× {{ orderFormatDetails.edges }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-slate-500">ไม่พบข้อมูลออเดอร์</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useOrders } from '~/composables/useOrders';
import OrdersSection from '~/components/backoffice/OrdersSection.vue';
import ProductsSection from '~/components/backoffice/ProductsSection.vue';
import UserRolesSection from '~/components/backoffice/UserRolesSection.vue';
import FormatPricesSection from '~/components/backoffice/FormatPricesSection.vue';
import BaseModal from '~/components/ui/BaseModal.vue';
import { COLOR_NAME_TO_ID, HEX_TO_COLOR_NAME } from '~/lib/brickArtRemix/bricklinkColors';

definePageMeta({
  middleware: ['admin-only']
});

const { openAuthModal, user } = useAuthFlow();
const supabase = useSupabaseClient();
const { updateOrderStatus, cancelOrder } = useOrders();

const orders = ref<Array<Record<string, any>>>([]);
const ordersPage = ref(1);
const ordersPageSize = 20;
const ordersSort = ref<{ field: string; direction: 'asc' | 'desc' }>({ field: 'created_at', direction: 'desc' });
const ordersTotal = ref(0);
const ordersTotalPages = computed(() => Math.max(1, Math.ceil(ordersTotal.value / ordersPageSize)));
const ordersSkip = computed(() => (ordersPage.value - 1) * ordersPageSize);
const ordersStatusFilter = ref<string | null>(null);
const orderDetailOpen = ref(false);
const orderDetail = ref<Record<string, any> | null>(null);
const ordersLoading = ref(false);
const ordersError = ref<string | null>(null);
const selectedOrderMap = ref<Record<string, boolean>>({});
const selectedOrderData = ref<Record<string, any>>({});
const selectedOrderIdList = computed(() => Object.keys(selectedOrderMap.value).filter((id) => selectedOrderMap.value[id]));
const activeMenu = ref<'orders' | 'products' | 'formats' | 'users'>('orders');
const statusOptions = [
  'รอชำระเงิน',
  'ชำระเงินแล้ว',
  // 'กำลังตรวจสอบ',
  'กำลังจัดส่ง',
  'สำเร็จ',
  'ยกเลิก'
];
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
const formatPrices = ref<Array<{ size: string; width?: number | null; height?: number | null; price: number | null }>>([]);
const formatPricesLoading = ref(false);
const formatPricesError = ref<string | null>(null);
const formatPricesSaving = ref<Record<string, boolean>>({});
const formatAdding = ref(false);
const extraCosts = ref<Array<{ id?: number; name: string; amount: number | null }>>([]);
const extraCostsLoading = ref(false);
const extraCostsSaving = ref(false);
const PRODUCT_PDF_BUCKET = 'order-instructions';
const PRODUCT_PDF_PREFIX = 'pdf-product';
const defaultPartPrices = [
  { key: 'plate-16', name: 'ฐาน 16x16', price: 0 },
  { key: 'plate-32', name: 'ฐาน 32x32', price: 0 },
  { key: 'frame-edge', name: 'ชิ้นส่วนกรอบ (ขอบ)', price: 0 },
  { key: 'frame-corner', name: 'ชิ้นส่วนกรอบ (มุม)', price: 0 },
  { key: 'hanger', name: 'รูแขวน', price: 0 },
  { key: 'stud-pack', name: 'Stud', price: 0 }
];
const partPrices = ref<Array<{ key: string; name: string; price: number | null }>>(defaultPartPrices);
const partPricesLoading = ref(false);
const partPricesSaving = ref<Record<string, boolean>>({});
const partPricesError = ref<string | null>(null);
const partPricesSavingAll = ref(false);
const loadPartPrices = async () => {
  partPricesLoading.value = true;
  partPricesError.value = null;
  try {
    const { data, error } = await supabase.from('part_prices').select('part_key, price');
    if (error) throw error;
    const map = new Map<string, number | null>();
    data?.forEach((row: any) => {
      map.set(String(row.part_key), row.price != null ? Number(row.price) : null);
    });
    partPrices.value = defaultPartPrices.map((p) => ({
      ...p,
      price: map.has(p.key) ? map.get(p.key) ?? null : p.price ?? null
    }));
  } catch (error: any) {
    partPricesError.value = error?.message ?? 'โหลดราคาชิ้นส่วนไม่สำเร็จ';
    partPrices.value = defaultPartPrices;
  } finally {
    partPricesLoading.value = false;
  }
};

const handleSavePartPrice = async (key: string, price: number | null) => {
  const normalized = key;
  partPricesSaving.value[normalized] = true;
  partPricesError.value = null;
  try {
    const { error } = await supabase.from('part_prices').upsert({ part_key: normalized, price: price ?? 0 }, { onConflict: 'part_key' });
    if (error) throw error;
    await loadPartPrices();
  } catch (error: any) {
    partPricesError.value = error?.message ?? 'บันทึกราคาชิ้นส่วนไม่สำเร็จ';
  } finally {
    partPricesSaving.value[normalized] = false;
  }
};

const handleSaveAllPartPrices = async (payloads: Array<{ key: string; price: number | null }>) => {
  if (!Array.isArray(payloads) || payloads.length === 0) return;
  partPricesSavingAll.value = true;
  partPricesError.value = null;
  try {
    const rows = payloads.map((p) => ({ part_key: p.key, price: p.price ?? 0 }));
    const { error } = await supabase.from('part_prices').upsert(rows, { onConflict: 'part_key' });
    if (error) throw error;
    await loadPartPrices();
  } catch (error: any) {
    partPricesError.value = error?.message ?? 'บันทึกราคาชิ้นส่วนไม่สำเร็จ';
  } finally {
    partPricesSavingAll.value = false;
  }
};

const loadExtraCosts = async () => {
  extraCostsLoading.value = true;
  try {
    const { data, error } = await supabase.from('extra_costs').select('id, name, amount').order('id', { ascending: true });
    if (error) throw error;
    extraCosts.value = data ?? [];
  } catch (error) {
    extraCosts.value = [];
  } finally {
    extraCostsLoading.value = false;
  }
};

const handleSaveExtraCosts = async (payloads: Array<{ id?: number | string; name: string; amount: number | null }>) => {
  extraCostsSaving.value = true;
  try {
    const sanitized = payloads
      .filter((p) => p.name && p.name.trim())
      .map((p) => ({ id: p.id ? Number(p.id) : undefined, name: p.name.trim(), amount: p.amount ?? 0 }));
    const ids = sanitized.filter((p) => p.id != null).map((p) => Number(p.id));
    if (ids.length === 0) {
      await supabase.from('extra_costs').delete().neq('id', 0);
    } else {
      await supabase.from('extra_costs').delete().not('id', 'in', `(${ids.join(',')})`);
    }
    if (sanitized.length > 0) {
      const { error } = await supabase.from('extra_costs').upsert(sanitized, { onConflict: 'id' });
      if (error) throw error;
    }
    await loadExtraCosts();
  } catch (error) {
    // ignore
  } finally {
    extraCostsSaving.value = false;
  }
};
const parseSizeText = (value: any): { width: number; height: number } | null => {
  if (!value) return null;
  if (typeof value === 'string') {
    const match = value.match(/(\d+)\s*[x×]\s*(\d+)/i);
    if (match) {
      return { width: Number(match[1]), height: Number(match[2]) };
    }
  } else if (typeof value === 'object' && value.width && value.height) {
    const w = Number(value.width);
    const h = Number(value.height);
    if (!Number.isNaN(w) && !Number.isNaN(h)) return { width: w, height: h };
  }
  return null;
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

const normalizeHex = (value: any) => {
  if (!value) return '';
  const str = String(value).trim();
  if (!str) return '';
  const withHash = str.startsWith('#') ? str : `#${str}`;
  return withHash.toLowerCase();
};

const orderPreview = (order: Record<string, any>) => {
  const meta = order?.metadata ?? {};
  const candidates = [
    meta.step3_preview,
    meta.stud_preview,
    order?.preview_url,
    order?.preview,
    meta.image,
    meta.product_image,
    meta.product_preview
  ];
  const found = candidates.find((p) => typeof p === 'string' && p.trim());
  return found ? String(found).trim() : null;
};

const orderStudUsage = computed(() => {
  const meta = orderDetail.value?.metadata ?? {};
  const usage = meta.step3_stud_usage ?? meta.stud_usage ?? meta.step3_meta?.stud_usage;
  if (!Array.isArray(usage)) return [];
  return usage
    .map((item: any) => {
      const count = Number(item?.count ?? item?.amount ?? 0) || 0;
      const rawHex = item?.hex ?? item?.color ?? '';
      const hex = normalizeHex(rawHex);
      const resolvedName = item?.name ?? HEX_TO_COLOR_NAME[hex] ?? HEX_TO_COLOR_NAME[rawHex];
      const bricklinkId = resolvedName ? COLOR_NAME_TO_ID[resolvedName] ?? null : null;
      return {
        hex: hex || rawHex || '',
        name: resolvedName ?? rawHex ?? 'ไม่ทราบสี',
        bricklinkId,
        count
      };
    })
    .filter((item) => item.hex || item.count > 0)
    .sort((a, b) => b.count - a.count);
});

const orderStudTotal = computed(() => orderStudUsage.value.reduce((sum, item) => sum + (Number(item.count) || 0), 0));

const orderStudUsageForExport = (order: Record<string, any>) => {
  const meta = order?.metadata ?? {};
  const usage = meta.step3_stud_usage ?? meta.stud_usage ?? meta.step3_meta?.stud_usage;
  if (!Array.isArray(usage)) return [];
  return usage
    .map((item: any) => {
      const count = Number(item?.count ?? item?.amount ?? 0) || 0;
      const rawHex = item?.hex ?? item?.color ?? '';
      const hex = normalizeHex(rawHex);
      const resolvedName = item?.name ?? HEX_TO_COLOR_NAME[hex] ?? HEX_TO_COLOR_NAME[rawHex];
      const bricklinkId = resolvedName ? COLOR_NAME_TO_ID[resolvedName] ?? null : null;
      return {
        hex: hex || rawHex || '',
        name: resolvedName ?? rawHex ?? 'ไม่ทราบสี',
        bricklinkId,
        count
      };
    })
    .filter((item) => (item.hex && item.count > 0) || item.count > 0)
    .sort((a, b) => b.count - a.count);
};

const orderSizeLabel = (order: Record<string, any>) => {
  const meta = order?.metadata ?? {};
  const formatMeta = meta.format_price ?? {};
  const resolution =
    parseSizeText(formatMeta) ??
    parseSizeText({ width: formatMeta.width, height: formatMeta.height }) ??
    parseSizeText(meta.step3_resolution) ??
    parseSizeText(meta.resolution) ??
    parseSizeText(meta.size);
  if (!resolution) return '';
  const w = Number(resolution.width);
  const h = Number(resolution.height);
  if (!Number.isFinite(w) || !Number.isFinite(h)) return '';
  const a = Math.min(w, h);
  const b = Math.max(w, h);
  return `${a}x${b}`;
};

const csvEscape = (value: any) => {
  const str = value == null ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const exportSelectedOrders = () => {
  const selected = Object.values(selectedOrderData.value ?? {}).filter(Boolean);
  if (!selected.length) return;
  if (typeof window === 'undefined') {
    ordersError.value = 'ต้องเปิดในเบราว์เซอร์เพื่อ export';
    return;
  }
  const aggregates = new Map<
    string,
    {
      colorId: string | number | null;
      hex: string;
      count: number;
    }
  >();

  selected.forEach((order) => {
    const usage = orderStudUsageForExport(order);
    usage.forEach((item) => {
      const key = item.bricklinkId != null ? String(item.bricklinkId) : item.hex || item.name || '';
      if (!key) return;
      const existing = aggregates.get(key) ?? {
        colorId: item.bricklinkId ?? null,
        hex: item.hex ?? '',
        count: 0
      };
      existing.count += item.count ?? 0;
      aggregates.set(key, existing);
    });
  });

  const aggregatedRows = Array.from(aggregates.values()).sort((a, b) => b.count - a.count);

  const header = ['no', 'color_id', 'color_hex', 'count'];
  const rows: Array<Array<string | number>> = aggregatedRows.map((item, index) => [
    index + 1,
    item.colorId ?? '',
    item.hex ?? '',
    item.count ?? 0
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-colors-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

const getFrameAndBase = (width: number, height: number) => {
  const hasSize = width > 0 && height > 0;
  const corners = hasSize ? 4 : 0;
  const clips = hasSize ? 2 : 0;
  const sideShort = hasSize ? ((width - 16) / 16) * 2 : 0;
  const sideLong = hasSize ? ((height - 16) / 16) * 2 : 0;
  const canUse32 = hasSize && width % 32 === 0 && height % 32 === 0;
  const base32 = canUse32 ? (width / 32) * (height / 32) : 0;
  const base16 = !canUse32 && hasSize ? (width / 16) * (height / 16) : 0;
  return { corners, clips, sideShort, sideLong, base32, base16 };
};

const orderFormatDetails = computed(() => {
  const meta = orderDetail.value?.metadata ?? {};
  const formatMeta = meta.format_price ?? {};
  const resolution =
    parseSizeText(formatMeta) ??
    parseSizeText({ width: formatMeta.width, height: formatMeta.height }) ??
    parseSizeText(meta.step3_resolution) ??
    parseSizeText(meta.resolution) ??
    parseSizeText(meta.size);
  if (!resolution) return null;
  const { width, height } = resolution;
  const frame = getFrameAndBase(width, height);
  return {
    width,
    height,
    base16: frame.base16,
    base32: frame.base32,
    hanger: frame.clips,
    corners: frame.corners,
    edges: frame.sideShort + frame.sideLong
  };
});

const normalizeStatusValue = (value: string | null | undefined) => {
  const raw = (value ?? '').toString().trim();
  if (!raw) return 'รอชำระเงิน';
  const lower = raw.toLowerCase();
  if (!lower.includes('unpaid') && (lower.includes('ชำระ') || lower.includes('paid') || lower.includes('success'))) {
    return 'ชำระเงินแล้ว';
  }
  if (lower.includes('ship')) return 'กำลังจัดส่ง';
  // if (lower.includes('ตรวจ')) return 'กำลังตรวจสอบ';
  if (lower.includes('cancel') || lower.includes('ยกเลิก')) return 'ยกเลิก';
  return raw;
};

const statusDraftValue = (orderId: string | number) => {
  return normalizeStatusValue(statusDrafts.value[String(orderId)]) ?? 'รอชำระเงิน';
};

const updateStatusDraft = (orderId: string | number, nextValue: string) => {
  statusDrafts.value[String(orderId)] = nextValue;
  statusUpdateErrors.value[String(orderId)] = null;
};

const syncStatusDrafts = () => {
  const next: Record<string, string> = {};
  orders.value.forEach((order) => {
    if (!order?.id) return;
    next[String(order.id)] = normalizeStatusValue(order.status);
  });
  statusDrafts.value = next;
};

const handleStatusChange = async (orderId: string | number, newStatus: string) => {
  if (!newStatus) return;
  const key = String(orderId);
  isUpdatingStatus.value[key] = true;
  statusUpdateErrors.value[key] = null;
  try {
    const normalizedStatus = normalizeStatusValue(newStatus);
    const updated =
      normalizedStatus === 'ยกเลิก'
        ? await cancelOrder(orderId, 'ยกเลิกโดยแอดมิน')
        : await updateOrderStatus(orderId, normalizedStatus);
    if (updated) {
      orders.value = orders.value.map((order) => {
        if (order.id === updated.id) {
          return updated;
        }
        return order;
      });
      statusDrafts.value[key] = normalizeStatusValue(updated.status ?? normalizedStatus);
    }
  } catch (error: any) {
    statusUpdateErrors.value[key] = error?.message ?? 'ไม่สามารถอัปเดตสถานะได้';
  } finally {
    isUpdatingStatus.value[key] = false;
  }
};

const openOrderDetails = (order: Record<string, any>) => {
  orderDetail.value = order;
  orderDetailOpen.value = true;
};

const closeOrderDetails = () => {
  orderDetailOpen.value = false;
  orderDetail.value = null;
};

const goOrdersPage = (page: number) => {
  const target = Math.min(Math.max(1, page), ordersTotalPages.value);
  if (target === ordersPage.value) return;
  ordersPage.value = target;
  loadOrders();
};

const changeOrdersSort = (payload: { field: string; direction: 'asc' | 'desc'; reset?: boolean }) => {
  const fieldMap: Record<string, string> = {
    preview: 'created_at',
    customer: 'customer_email',
    total: 'total_amount',
    total_amount: 'total_amount'
  };
  const nextField = fieldMap[payload.field] ?? payload.field;
  ordersSort.value = payload.reset ? { field: 'created_at', direction: 'desc' } : { field: nextField, direction: payload.direction };
  loadOrders();
};

const changeOrdersStatusFilter = (status: string | null) => {
  ordersStatusFilter.value = status || null;
  ordersPage.value = 1;
  loadOrders();
};

const upsertSelectedOrder = (order: Record<string, any>, checked: boolean) => {
  const key = order?.id != null ? String(order.id) : '';
  if (!key) return;
  if (checked) {
    selectedOrderMap.value[key] = true;
    selectedOrderData.value[key] = order;
  } else {
    delete selectedOrderMap.value[key];
    delete selectedOrderData.value[key];
  }
};

const toggleOrderSelection = (order: Record<string, any>, checked: boolean) => {
  upsertSelectedOrder(order, checked);
};

const toggleOrderSelectionPage = (checked: boolean) => {
  orders.value.forEach((order) => upsertSelectedOrder(order, checked));
};

const refreshSelectedOrderData = (list: Array<Record<string, any>>) => {
  list.forEach((order) => {
    const key = order?.id != null ? String(order.id) : '';
    if (key && selectedOrderMap.value[key]) {
      selectedOrderData.value[key] = order;
    }
  });
};

const loadOrders = async () => {
  ordersLoading.value = true;
  ordersError.value = null;
  try {
    const result = await $fetch<{ items: any[]; total: number; page: number; pageSize: number }>('/api/admin/orders', {
      params: {
        skip: ordersSkip.value,
        take: ordersPageSize,
        sort: `${ordersSort.value.field}:${ordersSort.value.direction}`,
        status: ordersStatusFilter.value ?? undefined
      }
    });
    orders.value = result.items ?? [];
    ordersTotal.value = result.total ?? orders.value.length;
    refreshSelectedOrderData(orders.value);
    const maxPage = Math.max(1, Math.ceil(ordersTotal.value / ordersPageSize));
    if (ordersPage.value > maxPage) {
      ordersPage.value = maxPage;
      await loadOrders();
      return;
    }
    syncStatusDrafts();
  } catch (error: any) {
    ordersError.value = error?.message ?? 'เกิดข้อผิดพลาด';
    orders.value = [];
    ordersTotal.value = 0;
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

const mergeFormatPrices = (records: Array<{ size: string; price: number | null }>) => {
  const merge = records.map((item) => {
    const parsed = parseSizeText(item.size);
    return {
      size: item.size,
      width: (item as any).width ?? parsed?.width ?? null,
      height: (item as any).height ?? parsed?.height ?? null,
      price: item.price ?? null
    };
  });
  return merge
    .map((item) => {
      const ordered = (() => {
        const w = item.width ?? 0;
        const h = item.height ?? 0;
        if (w && h) {
          const a = Math.min(w, h);
          const b = Math.max(w, h);
          return { width: a, height: b, size: `${a}x${b}` };
        }
        const parsed = parseSizeText(item.size);
        if (parsed?.width && parsed?.height) {
          const a = Math.min(parsed.width, parsed.height);
          const b = Math.max(parsed.width, parsed.height);
          return { width: a, height: b, size: `${a}x${b}` };
        }
        return { width: item.width ?? null, height: item.height ?? null, size: item.size };
      })();
      return { ...item, ...ordered };
    })
    .sort((a, b) => (a.size || '').localeCompare(b.size || '', 'en', { numeric: true }));
};

const loadFormatPrices = async () => {
  formatPricesLoading.value = true;
  formatPricesError.value = null;
  try {
    const { data, error } = await supabase.from('format_prices').select('size, price, width, height');
    if (error) throw error;
    formatPrices.value = mergeFormatPrices(data ?? []);
  } catch (error: any) {
    const message = error?.message ?? 'โหลดรูปแบบราคาไม่สำเร็จ';
    formatPricesError.value = message;
    // fallback แสดงรายการขนาดให้กรอกไว้ก่อน
    formatPrices.value = mergeFormatPrices([]);
    if (error?.code === '42P01' || error?.code === 'PGRST302') {
      formatPricesError.value = `${message} (ตรวจสอบว่ามีตาราง format_prices หรือยัง)`;
    }
    console.error('loadFormatPrices error', error);
  } finally {
    formatPricesLoading.value = false;
  }
};

const handleSaveFormatPrice = async (payload: { size: string; width: number | null; height: number | null; price: number | null }) => {
  const key = payload.size.toLowerCase();
  formatPricesSaving.value[key] = true;
  formatPricesError.value = null;
  try {
    const toSave = {
      size: payload.size,
      width: payload.width != null && payload.height != null ? Math.min(payload.width, payload.height) : payload.width,
      height: payload.width != null && payload.height != null ? Math.max(payload.width, payload.height) : payload.height,
      price: payload.price ?? 0
    };
    const { error } = await supabase.from('format_prices').upsert(toSave, { onConflict: 'size' });
    if (error) throw error;
    await loadFormatPrices();
  } catch (error: any) {
    formatPricesError.value = error?.message ?? 'บันทึกราคาไม่สำเร็จ';
  } finally {
    formatPricesSaving.value[key] = false;
  }
};

const handleSaveAllFormatPrices = async (payloads: Array<{ size: string; width: number | null; height: number | null; price: number | null }>) => {
  if (!Array.isArray(payloads) || payloads.length === 0) return;
  formatPricesLoading.value = true;
  formatPricesError.value = null;
  try {
    const rows = payloads.map((p) => ({
      size: p.size,
      width: p.width,
      height: p.height,
      price: p.price ?? 0
    }));
    const { error } = await supabase.from('format_prices').upsert(rows, { onConflict: 'size' });
    if (error) throw error;
    await loadFormatPrices();
  } catch (error: any) {
    formatPricesError.value = error?.message ?? 'บันทึกแบบขนาดไม่สำเร็จ';
  } finally {
    formatPricesLoading.value = false;
  }
};

const handleAddFormatSize = async (payload: { width: number; height: number }) => {
  const size = `${payload.width}x${payload.height}`;
  const key = size.toLowerCase();
  formatPricesSaving.value[key] = true;
  formatAdding.value = true;
  formatPricesError.value = null;
  try {
    const { error } = await supabase.from('format_prices').upsert({ size, width: Math.min(payload.width, payload.height), height: Math.max(payload.width, payload.height), price: 0 }, { onConflict: 'size' });
    if (error) throw error;
    await loadFormatPrices();
  } catch (error: any) {
    formatPricesError.value = error?.message ?? 'เพิ่มรูปแบบไม่สำเร็จ';
  } finally {
    formatPricesSaving.value[key] = false;
    formatAdding.value = false;
  }
};

const handleDeleteFormatSize = async (size: string) => {
  const key = size.toLowerCase();
  formatPricesSaving.value[key] = true;
  formatPricesError.value = null;
  try {
    const parsed = parseSizeText(size);
    const w = parsed?.width ?? null;
    const h = parsed?.height ?? null;
    const ordered = w && h ? `${Math.min(w, h)}x${Math.max(w, h)}` : size;
    const alt = w && h ? `${Math.max(w, h)}x${Math.min(w, h)}` : null;
    const orFilters = [`size.eq.${ordered}`];
    if (alt && alt !== ordered) orFilters.push(`size.eq.${alt}`);
    if (w && h) {
      orFilters.push(`and(width.eq.${Math.min(w, h)},height.eq.${Math.max(w, h)})`);
      orFilters.push(`and(width.eq.${Math.max(w, h)},height.eq.${Math.min(w, h)})`);
    }
    const { error } = await supabase.from('format_prices').delete().or(orFilters.join(','));
    if (error) throw error;
    await loadFormatPrices();
  } catch (error: any) {
    formatPricesError.value = error?.message ?? 'ลบรูปแบบไม่สำเร็จ';
  } finally {
    formatPricesSaving.value[key] = false;
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

const uploadProductPdf = async (productId: string | number, pdf: { blob: Blob; fileName: string }) => {
  const productIdStr = String(productId);
  const filePath = `${PRODUCT_PDF_PREFIX}/Siam-Brick-Product-${productIdStr}.pdf`;
  const { error } = await supabase.storage.from(PRODUCT_PDF_BUCKET).upload(filePath, pdf.blob, {
    contentType: 'application/pdf',
    upsert: true
  });
  if (error) throw error;
  const { data: publicUrlData } = supabase.storage.from(PRODUCT_PDF_BUCKET).getPublicUrl(filePath);
  let signedUrl: string | null = null;
  try {
    const { data: signedData, error: signedError } = await supabase.storage
      .from(PRODUCT_PDF_BUCKET)
      .createSignedUrl(filePath, 60 * 60 * 24 * 30);
    if (!signedError) {
      signedUrl = signedData?.signedUrl ?? null;
    }
  } catch {
    signedUrl = null;
  }
  return {
    bucket: PRODUCT_PDF_BUCKET,
    path: filePath,
    publicUrl: publicUrlData?.publicUrl ?? null,
    signedUrl
  };
};

const handleSaveProduct = async (payload: any) => {
  productSaving.value = true;
  productSaveError.value = null;
  try {
    const isEditing = payload.id != null && payload.id !== '';
    const instructionPdf = payload.instructionPdf ?? null;
    const currentProduct = isEditing
      ? products.value.find((p) => String(p.id) === String(payload.id))
      : null;
    const normalizeSlug = (value: string | null | undefined) =>
      (value || '')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/--+/g, '-');

    const baseSlug = normalizeSlug(payload.slug || payload.name || '');
    if (!baseSlug) {
      throw new Error('กรุณากรอกชื่อหรือ slug สินค้า');
    }

    // หา slug ที่ไม่ชน โดยเพิ่ม suffix -2, -3 ... ถ้าจำเป็น
    const findAvailableSlug = async (base: string, currentId?: string | number | null) => {
      const { data, error } = await supabase
        .from('products')
        .select('id, slug')
        .ilike('slug', `${base}%`);
      if (error && error.code !== 'PGRST116') throw error;
      const rows = data ?? [];
      const isTakenByOther = (slug: string) =>
        rows.some((row) => String(row.slug) === slug && String(row.id) !== String(currentId ?? ''));
      if (!isTakenByOther(base)) return base;
      for (let i = 2; i < 100; i++) {
        const candidate = `${base}-${i}`;
        if (!isTakenByOther(candidate)) return candidate;
      }
      throw new Error('ไม่สามารถสร้าง slug ที่ไม่ซ้ำได้');
    };

    const slug = await findAvailableSlug(baseSlug, isEditing ? payload.id : null);

    const baseMetadata = currentProduct?.metadata ?? {};
    const nextStudUsage = Array.isArray(payload.studUsage) ? payload.studUsage : baseMetadata.stud_usage ?? null;
    const metadata = {
      ...baseMetadata,
      tag: payload.tag ?? baseMetadata.tag ?? null,
      studs: payload.studs ?? baseMetadata.studs ?? null,
      difficulty: payload.difficulty ?? baseMetadata.difficulty ?? null,
      size: payload.size ?? baseMetadata.size ?? null,
      image: payload.image ?? baseMetadata.image ?? null,
      priceKit: payload.priceKit ?? baseMetadata.priceKit ?? null,
      format_price: payload.formatPriceMeta ?? baseMetadata.format_price ?? null,
      ...(nextStudUsage ? { stud_usage: nextStudUsage } : {})
    };

    if (isEditing) {
      let pdfMeta = baseMetadata?.instruction_pdf ?? null;
      if (instructionPdf) {
        pdfMeta = await uploadProductPdf(payload.id, instructionPdf);
      }
      const metadataWithPdf = {
        ...metadata,
        ...(pdfMeta ? { instruction_pdf: pdfMeta } : {})
      };
      const { error } = await supabase
        .from('products')
        .update({
          name: payload.name,
          slug,
          price: payload.priceKit ?? 0,
          active: payload.active !== false,
          metadata: metadataWithPdf
        })
        .eq('id', payload.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: payload.name,
          slug,
          price: payload.priceKit ?? 0,
          active: payload.active !== false,
          metadata
        })
        .select()
        .single();
      if (error) throw error;
      const productId = data?.id;
      if (instructionPdf && productId != null) {
        const pdfMeta = await uploadProductPdf(productId, instructionPdf);
        const metadataWithPdf = { ...metadata, instruction_pdf: pdfMeta };
        const { error: updateError } = await supabase
          .from('products')
          .update({ metadata: metadataWithPdf })
          .eq('id', productId);
        if (updateError) throw updateError;
      }
    }

    await loadProducts();
  } catch (error: any) {
    const status = error?.code || error?.status;
    if (status === '23505' || status === 409) {
      productSaveError.value = 'slug นี้ซ้ำกับสินค้าอื่น หรือมี ID ซ้ำ กรุณาเปลี่ยนชื่อ/slug แล้วลองใหม่';
    } else {
      productSaveError.value = error?.message ?? 'บันทึกสินค้าไม่สำเร็จ';
    }
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
  ordersPage.value = 1;
  await Promise.allSettled([loadOrders(), loadProducts(), loadUserRoles(), loadFormatPrices(), loadPartPrices(), loadExtraCosts()]);
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

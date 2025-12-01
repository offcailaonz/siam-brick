<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-5xl flex-col px-4 py-10 lg:py-14 text-slate-800"
    >
      <section
        class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden"
      >
        <div
          class="flex justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-4"
        >
          <div class="">
            <p
              class="text-xs font-semibold uppercase tracking-wide text-amber-600"
            >
              Checkout
            </p>
            <h1 class="mt-1 text-2xl font-bold text-slate-900">
              จ่ายเงินให้เสร็จใน 3 ขั้นตอน
            </h1>
            <p class="mt-2 text-sm text-slate-600">
              ตรวจรูป · เลือกแพ็กเกจ · ส่งข้อมูลให้ทีมงานเตรียมลิงก์จ่าย
              ได้ไฟล์/ชุดตัวต่อเร็วขึ้น
            </p>
          </div>
          <div class="flex flex-wrap gap-3 py-4" v-if="!isPaymentCompleted">
            <NuxtLink
              v-if="!isProductMode && !isPaymentCompleted && !isSummaryLoading"
              :to="brickLink"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              :aria-disabled="isPaymentCompleted"
              tabindex="0"
              @click.prevent="isPaymentCompleted ? null : $router.push(brickLink)"
            >
              กลับไปแก้ภาพ
            </NuxtLink>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="payButtonDisabled"
              @click="handleCreateOrder"
            >
              <span>{{ payButtonText }}</span>
            </button>
            <p v-if="showShippingWarning" class="text-[11px] text-rose-600">
              กรุณาเลือกหรือเพิ่มที่อยู่ให้ครบก่อนชำระเงิน
            </p>
          </div>
        </div>

        <div
          v-if="isPaymentCompleted"
          class="mx-5 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <div>
              <p class="font-semibold text-emerald-900">
                ชำระเงินเรียบร้อยแล้ว
              </p>
              <p class="text-xs text-emerald-700">
                ตรวจสอบรายละเอียดออเดอร์ด้านล่างได้เลย
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[12px] font-semibold text-emerald-800 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="!instructionPdfUrl"
              @click="handleDownloadInstructionPdf"
            >
              <span>ดาวน์โหลด PDF</span>
            </button>
            <span
              class="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800"
            >
              Paid
            </span>
          </div>
        </div>

        <div class="grid gap-6 px-5 py-6 lg:grid-cols-[1.6fr,1fr]">
          <div class="space-y-4">
            <div
              v-if="checkoutPreview"
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-xs font-semibold uppercase tracking-wide text-indigo-600"
                  >
                    {{ previewMeta.title }}
                  </p>
                  <p class="text-sm text-slate-600">
                    {{ previewMeta.subtitle }}
                  </p>
                </div>
                <span
                  class="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700"
                  >{{ previewMeta.badge }}</span
                >
              </div>
              <div
                class="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                <img
                  :src="checkoutPreview"
                  alt="Final preview"
                  class="w-full max-h-[420px] object-contain bg-white"
                />
              </div>
            </div>
            <div
              v-else-if="isPreviewLoading"
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="space-y-2">
                  <p
                    class="text-xs font-semibold uppercase tracking-wide text-indigo-600"
                  >
                    กำลังโหลดพรีวิว
                  </p>
                  <p class="text-sm text-slate-600">
                    {{ isProductMode ? 'กำลังโหลดข้อมูลสินค้า...' : 'ดึงรูปจากออเดอร์ที่ลิงก์มา...' }}
                  </p>
                  <div class="mt-2 space-y-2">
                    <div
                      class="h-4 w-28 rounded-full bg-slate-100 animate-pulse"
                    />
                    <div
                      class="h-3 w-44 rounded-full bg-slate-100 animate-pulse"
                    />
                  </div>
                </div>
                <span
                  class="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
                  >loading</span
                >
              </div>
              <div class="mt-3 space-y-3">
                <div class="h-64 rounded-lg bg-slate-100 animate-pulse"></div>
                <div class="h-3 w-1/2 rounded bg-slate-100 animate-pulse"></div>
                <div class="h-3 w-1/3 rounded bg-slate-100 animate-pulse"></div>
              </div>
            </div>
            <div
              v-else-if="productError"
              class="rounded-xl border border-rose-100 bg-rose-50 px-4 py-4 shadow-sm"
            >
              <p class="text-sm font-semibold text-rose-700">
                โหลดสินค้าที่เลือกไม่สำเร็จ
              </p>
              <p class="text-xs text-rose-600 mt-1">{{ productError }}</p>
            </div>
            <div
              v-else-if="studPreviewError"
              class="rounded-xl border border-rose-100 bg-rose-50 px-4 py-4 shadow-sm"
            >
              <p class="text-sm font-semibold text-rose-700">
                โหลดพรีวิวจาก Step 2 ไม่สำเร็จ
              </p>
              <p class="text-xs text-rose-600 mt-1">{{ studPreviewError }}</p>
            </div>
          </div>

          <aside class="space-y-4">
            <section
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <template v-if="isSummaryLoading">
                <div class="flex items-center justify-between gap-3">
                  <div class="h-4 w-24 rounded bg-slate-100 animate-pulse" />
                  <div
                    class="h-6 w-16 rounded-full bg-slate-100 animate-pulse"
                  />
                </div>
                <div class="mt-3 space-y-2">
                  <div class="h-3 w-full rounded bg-slate-100 animate-pulse" />
                  <div class="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
                  <div class="h-3 w-2/3 rounded bg-slate-100 animate-pulse" />
                </div>
                <div
                  class="mt-4 h-12 rounded-lg bg-slate-100 animate-pulse"
                ></div>
              </template>
              <template v-else>
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-slate-900">
                      สรุปออเดอร์
                    </p>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-[11px] font-semibold"
                    :class="summaryStatusBadge.color"
                  >
                    {{ summaryStatusBadge.text }}
                  </span>
                </div>
                <div class="mt-3 space-y-2 text-sm text-slate-600">
                  <div class="flex justify-between">
                    <span class="text-slate-500">ออเดอร์เลขที่</span>
                    <span
                      class="font-semibold text-slate-900"
                      >{{ summaryOrderId ?? '-' }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">สร้างเมื่อ</span>
                    <span
                      class="font-semibold text-slate-900"
                      >{{ formatDateTime(summaryCreatedAt) }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">อัปเดตล่าสุด</span>
                    <span
                      class="font-semibold text-slate-900"
                      >{{ formatDateTime(summaryUpdatedAt) }}</span
                    >
                  </div>
                </div>
                <div
                  class="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <p class="mt-1 text-2xl font-bold text-emerald-700">
                    {{ formatCurrency(summaryPrice) }}
                  </p>
                  <p
                    v-if="isProductMode && activeProductInfo"
                    class="mt-1 text-xs text-slate-500"
                  >
                    {{ activeProductInfo.name }} ·
                    {{ activeProductInfo.size || 'ขนาดไม่ระบุ' }} ·
                    {{ activeProductInfo.studs || 0 }} studs
                  </p>
                </div>
              </template>
            </section>
            <section
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-slate-900">
                    เลือกที่อยู่จัดส่ง
                  </p>
                  <p class="text-xs text-slate-500">
                    ที่อยู่จากโปรไฟล์จะถูกดึงมาให้
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  :disabled="addressesLoading || !user"
                  @click="addressesLoading ? null : loadAddresses()"
                >
                  รีเฟรช
                </button>
                <button
                  type="button"
                  class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  :disabled="addressSaving || !user"
                  @click="openAddressModal"
                >
                  เพิ่มที่อยู่ใหม่
                </button>
              </div>
              <p v-if="addressesError" class="text-xs text-rose-600 mt-2">
                {{ addressesError }}
              </p>
              <div class="mt-3 space-y-2" v-auto-animate>
                <div v-if="!user" class="text-sm text-slate-500">
                  เข้าสู่ระบบเพื่อใช้ที่อยู่จัดส่ง
                </div>
                <div
                  v-else-if="addressesLoading"
                  class="text-sm text-slate-500"
                >
                  กำลังโหลดที่อยู่...
                </div>
                <div
                  v-else-if="addresses.length === 0"
                  class="text-sm text-slate-500"
                >
                  ยังไม่มีที่อยู่จัดส่ง
                  <button
                    type="button"
                    class="ml-2 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    @click="openAddressModal"
                  >
                    เพิ่มที่อยู่ใหม่
                  </button>
                </div>
                <div
                  v-else
                  v-for="address in addresses"
                  :key="address.id"
                  class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm"
                >
                  <div class="flex items-center justify-between gap-2">
                    <label
                      class="inline-flex items-start gap-2 text-sm text-slate-800 cursor-pointer"
                    >
                      <input
                        type="radio"
                        class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        :value="Number(address.id)"
                        v-model="selectedAddressId"
                      />
                      <div>
                        <div class="flex items-center gap-2">
                          <span
                            class="font-semibold"
                            >{{ address.label || 'ที่อยู่' }}</span
                          >
                          <span
                            v-if="address.is_default"
                            class="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100"
                            >หลัก</span
                          >
                        </div>
                        <p class="text-xs text-slate-600">
                          {{ address.recipient_name }} {{ address.phone }}
                        </p>
                        <p class="text-xs text-slate-600">
                          {{ address.address_line }}
                        </p>
                        <p class="text-xs text-slate-600">
                          {{ address.subdistrict }} {{ address.district }}
                          {{ address.province }} {{ address.postcode }}
                        </p>
                      </div>
                    </label>
                    <div class="flex flex-col gap-1">
                      <button
                        type="button"
                        class="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        :disabled="address.is_default || addressDefaulting[address.id]"
                        @click="markDefault(address.id)"
                      >
                        ตั้งหลัก
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                        :disabled="addressDeleting[address.id]"
                        @click="removeAddress(address.id)"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <ReceiveInfo
          class="mx-5 mb-6"
          :breakdown="kitBreakdown"
          :resolution="previewResolution"
        />
      </section>
    </main>
    <BaseModal
      :open="showAddressModal"
      title="เพิ่มที่อยู่ใหม่"
      @close="closeAddressModal"
    >
      <AddressForm
        class="mt-2"
        :model-value="addressForm"
        :loading="addressSaving"
        :error="addressFormError"
        :saved-message="addressSavedMessage"
        :show-default-toggle="true"
        submit-label="บันทึกที่อยู่"
        @submit="saveAddress"
        @reset="resetAddressForm"
        @update:model-value="(v) => Object.assign(addressForm, v)"
      />
    </BaseModal>
    <ClientOnly>
      <div class="hidden" aria-hidden="true">
        <BrickArtRemixApp
          ref="remixAppRef"
          :key="currentOrderId || 'remix-helper'"
          :show-step4="false"
          :enable-persistence="false"
          :enable-price-fetch="false"
          :initial-step2-preview="step2PreviewSource"
          :initial-step3-preview="selectedOrderStep3Preview || checkoutPreview"
          :initial-step3-base="selectedOrderStep3Base || selectedOrderStep3Preview || checkoutPreview"
          :editing-order-id="currentOrderId"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { alignPixelsToStudMap, drawStudImageOnCanvas, replaceSparseColors, rgbToHex } from '~/lib/brickArtRemix/algo';
import { ALL_BRICKLINK_SOLID_COLORS, PIXEL_TYPE_OPTIONS } from '~/lib/brickArtRemix/bricklinkColors';
import BrickArtRemixApp from '~/components/BrickArtRemix/BrickArtRemixApp.vue';
import AddressForm from '~/components/address/AddressForm.vue';
import ReceiveInfo from '~/components/checkout/ReceiveInfo.vue';
import BaseModal from '~/components/ui/BaseModal.vue';
import { useAddresses } from '~/composables/useAddresses';
import { useThaiAddressSearch } from '~/composables/useThaiAddressSearch';

const route = useRoute();
const supabase = useSupabaseClient();
const { openAuthModal, user, requireAuth } = useAuthFlow();
const { recordPendingPaymentOrder, fetchMyOrders, fetchOrderById, updateOrderAssets } = useOrders();
const { fetchAddresses, createAddress, deleteAddress, setDefaultAddress } = useAddresses();
const { loadAddressData } = useThaiAddressSearch();
const DEFAULT_ORDER_PRICE = 999;
const STUD_COLOR_SET = new Set(ALL_BRICKLINK_SOLID_COLORS.map((c) => c.hex.toLowerCase()));
const MAX_STUD_PREVIEW_PIXELS = 20000;
const SCALING_FACTOR = 30;
const SPARSE_COLOR_THRESHOLD = 10;
const DEFAULT_PIXEL_TYPE = PIXEL_TYPE_OPTIONS[0]?.number ?? 3024;
const selectedOrderId = computed(() => (route.query.id ? String(route.query.id) : null));
const hasLinkedOrder = computed(() => Boolean(selectedOrderId.value));
const step2Preview = useState<string | null>('brick-step2-preview', () => null);
const finalPreview = useState<string | null>('brick-final-step3-preview', () => null);
const originalImage = useState<string | null>('brick-original-image', () => null);
const cropInteractionForOrder = useState<Record<string, any> | null>('brick-crop-interaction', () => null);
const isCreatingOrder = ref(false);
const isRedirectingToStripe = ref(false);
const initialLoadPending = ref(true);
const orderError = ref<string | null>(null);
const orderSuccess = ref<{ id: string | number } | null>(null);
const myOrders = ref<Array<Record<string, any>>>([]);
const myOrdersLoading = ref(false);
const myOrdersError = ref<string | null>(null);
const selectedOrder = ref<Record<string, any> | null>(null);
const selectedOrderLoading = ref(false);
const selectedOrderError = ref<string | null>(null);
const addresses = ref<Array<Record<string, any>>>([]);
const addressesLoading = ref(false);
const addressesInitialized = ref(false);
const addressesError = ref<string | null>(null);
const addressFormError = ref<string | null>(null);
const addressSaving = ref(false);
const addressDeleting = ref<Record<number, boolean>>({});
const addressDefaulting = ref<Record<number, boolean>>({});
const addressSavedMessage = ref<string | null>(null);
const selectedAddressId = ref<number | null>(null);
const showAddressModal = ref(false);
const remixAppRef = ref<InstanceType<typeof BrickArtRemixApp> | null>(null);
const productInfo = ref<{
  id: number | string;
  slug: string | null;
  name: string;
  price: number | null;
  image: string | null;
  studs: number;
  size: string;
  resolution: { width: number; height: number };
  difficulty: string;
  tag: string;
  instructionPdf?: Record<string, any> | null;
} | null>(null);
const linkedProductInfo = ref<{
  id: number | string;
  slug: string | null;
  name: string;
  price: number | null;
  image: string | null;
  studs: number;
  size: string;
  resolution: { width: number; height: number };
  difficulty: string;
  tag: string;
  instructionPdf?: Record<string, any> | null;
} | null>(null);
const productLoading = ref(false);
const productError = ref<string | null>(null);
const addressForm = reactive({
  label: '',
  recipient_name: '',
  phone: '',
  address_line: '',
  province: '',
  district: '',
  subdistrict: '',
  postcode: '',
  is_default: false
});
const linkedOrderStep2Preview = computed(() => {
  if (!hasLinkedOrder.value) return null;
  const preview = selectedOrder.value?.preview_url || selectedOrder.value?.preview;
  if (typeof preview !== 'string') return null;
  const trimmed = preview.trim();
  return trimmed || null;
});
const step2PreviewSource = computed(() => {
  // ถ้ามีลิงก์ออเดอร์ ให้รอข้อมูลจาก API เพื่อหลีกเลี่ยงการโชว์พรีวิวเก่าจาก state เดิม
  if (hasLinkedOrder.value && !selectedOrder.value) {
    return null;
  }
  if (hasLinkedOrder.value) {
    return linkedOrderStep2Preview.value ?? null;
  }
  return step2Preview.value ?? null;
});
const studPreview = ref<string | null>(null);
const studPreviewError = ref<string | null>(null);
const studPreviewLoading = ref(false);
const STUD_PREVIEW_TIMEOUT_MS = 7000;
const checkoutPreview = computed(() => {
  if (hasProductQuery.value && (productLoading.value || !productInfo.value)) {
    return null;
  }
  if (hasLinkedOrder.value && !selectedOrder.value) {
    return null;
  }
  return studPreview.value ?? (hasLinkedOrder.value ? null : finalPreview.value) ?? null;
});
const latestOrder = computed(() => {
  // สำหรับ ready kit (product mode) ไม่ควร fallback ไปออเดอร์ล่าสุดของผู้ใช้ เพื่อป้องกันแสดงสถานะ Paid ผิดออเดอร์
  if (hasProductQuery.value) {
    return hasLinkedOrder.value ? selectedOrder.value : null;
  }
  return hasLinkedOrder.value ? selectedOrder.value : myOrders.value?.[0] ?? null;
});
const isPreviewLoading = computed(() => {
  if (hasProductQuery.value) {
    return productLoading.value;
  }
  return (
    (hasLinkedOrder.value && (selectedOrderLoading.value || (!selectedOrder.value && !selectedOrderError.value))) ||
    studPreviewLoading.value
  );
});
const currentOrderId = computed(() => {
  const fromLinkedOrSuccess = selectedOrderId.value ?? orderSuccess.value?.id ?? null;
  if (hasProductQuery.value) {
    // ใน product mode ไม่ใช้ latestOrder (ออเดอร์เก่าของผู้ใช้) เป็น current id
    return fromLinkedOrSuccess;
  }
  return fromLinkedOrSuccess ?? latestOrder.value?.id ?? null;
});
const brickLink = computed(() => (currentOrderId.value ? `/brick?id=${currentOrderId.value}` : '/brick'));
const selectedOrderShipping = computed(() => {
  const shipping = (selectedOrder.value as any)?.order_shipping;
  if (Array.isArray(shipping)) {
    return shipping[0] ?? null;
  }
  return shipping ?? null;
});
const selectedAddress = computed(() => {
  const id = selectedAddressId.value == null ? null : Number(selectedAddressId.value);
  return id != null ? addresses.value.find((addr) => Number(addr.id) === id) ?? null : null;
});
const productQuery = computed(() => (typeof route.query.product === 'string' ? route.query.product : null));
const hasProductQuery = computed(() => Boolean(productQuery.value));
const activeProductInfo = computed(() => (hasProductQuery.value ? productInfo.value : linkedProductInfo.value));
const isProductMode = computed(() => hasProductQuery.value || Boolean(linkedProductInfo.value));
const selectedOrderStep3Base = computed(() => {
  const o = selectedOrder.value ?? null;
  const meta = o?.metadata ?? {};
  const candidates = [meta.step3_base, meta.preview_base, o?.preview_base, o?.step3_base];
  const found = candidates.find((item) => typeof item === 'string' && item.trim());
  return found ? String(found).trim() : null;
});
const selectedOrderStep3Preview = computed(() => {
  const o = selectedOrder.value ?? null;
  const meta = o?.metadata ?? {};
  const candidates = [
    meta.step3_preview,
    meta.instruction_preview,
    meta.stud_preview,
    meta.product_image,
    o?.preview_url,
    o?.preview
  ];
  const found = candidates.find((item) => typeof item === 'string' && item.trim());
  return found ? String(found).trim() : null;
});
const previewMeta = computed(() =>
  isProductMode.value
    ? {
        title: 'สินค้าพร้อมสร้าง',
        subtitle: 'รูปตัวอย่างจาก Ready Kit (แก้ไขรูปไม่ได้)',
        badge: 'Ready kit'
      }
    : {
        title: 'ตรวจสอบรูป',
        subtitle: 'พรีวิว Step 3 ล่าสุด (รวมการแก้สีแล้ว)',
        badge: 'พร้อมสั่ง'
      }
);
const remixReady = computed(() => remixAppRef.value?.step3Ready?.value ?? false);
const productPrice = computed(() => {
  const info = activeProductInfo.value;
  if (!isProductMode.value || !info) return null;
  const priceValue = info.price;
  const priceNum = priceValue != null ? Number(priceValue) : NaN;
  return Number.isNaN(priceNum) ? null : priceNum;
});

const mapAddressToShipping = (address: Record<string, any> | null | undefined) => {
  if (!address) return null;
  return {
    recipient_name: address.recipient_name ?? null,
    phone: address.phone ?? null,
    address_line: address.address_line ?? null,
    province: address.province ?? null,
    district: address.district ?? null,
    subdistrict: address.subdistrict ?? null,
    postcode: address.postcode ?? null,
    label: address.label ?? null,
    is_temp: false
  };
};

const effectiveShipping = computed(() => {
  const chosenAddressShipping = mapAddressToShipping(selectedAddress.value);
  if (chosenAddressShipping) return chosenAddressShipping;
  if (selectedOrderShipping.value) {
    return {
      recipient_name: selectedOrderShipping.value.recipient_name ?? null,
      phone: selectedOrderShipping.value.phone ?? null,
      address_line: selectedOrderShipping.value.address_line ?? null,
      province: selectedOrderShipping.value.province ?? null,
      district: selectedOrderShipping.value.district ?? null,
      subdistrict: selectedOrderShipping.value.subdistrict ?? null,
      postcode: selectedOrderShipping.value.postcode ?? null,
      label: selectedOrderShipping.value.label ?? null,
      is_temp: selectedOrderShipping.value.is_temp ?? false
    };
  }
  return null;
});

const isShippingFilled = computed(() => {
  const s = effectiveShipping.value;
  if (!s) return false;
  const required = [
    s.recipient_name,
    s.phone,
    s.address_line,
    s.province,
    s.district,
    s.subdistrict,
    s.postcode
  ];
  return required.every((val) => typeof val === 'string' && val.trim().length > 0);
});

const loadImagePixels = async (
  src: string,
  timeoutMs = 8000,
  maxPixels?: number
): Promise<{ pixels: Uint8ClampedArray; width: number; height: number } | null> => {
  if (typeof window === 'undefined') {
    return null;
  }
  return new Promise((resolve) => {
    let settled = false;
    const cleanup = (img: HTMLImageElement, timer: number | undefined) => {
      if (timer) window.clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
    };
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (settled) return;
      settled = true;
      cleanup(img, timeoutId);
      let targetWidth = Math.max(1, img.naturalWidth || img.width);
      let targetHeight = Math.max(1, img.naturalHeight || img.height);
      if (maxPixels && targetWidth * targetHeight > maxPixels) {
        // Downscale huge inputs to keep stud preview generation responsive
        const scale = Math.sqrt(maxPixels / (targetWidth * targetHeight));
        targetWidth = Math.max(1, Math.round(targetWidth * scale));
        targetHeight = Math.max(1, Math.round(targetHeight * scale));
      }
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const data = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
      resolve({ pixels: new Uint8ClampedArray(data), width: targetWidth, height: targetHeight });
    };
    img.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup(img, timeoutId);
      resolve(null);
    };
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup(img, undefined);
      resolve(null);
    }, timeoutMs);
    img.src = src;
  });
};

const pivotRgbToLinear = (value: number) => {
  const channel = value / 255;
  return channel > 0.04045 ? Math.pow((channel + 0.055) / 1.055, 2.4) : channel / 12.92;
};

const rgbToLab = (rgb: number[]) => {
  const [r, g, b] = rgb.map((channel) => pivotRgbToLinear(channel));
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  const refX = 0.95047;
  const refY = 1.0;
  const refZ = 1.08883;

  const fx = x / refX;
  const fy = y / refY;
  const fz = z / refZ;

  const epsilon = 216 / 24389;
  const kappa = 24389 / 27;

  const pivot = (t: number) => (t > epsilon ? Math.pow(t, 1 / 3) : (kappa * t + 16) / 116);

  const fxCube = pivot(fx);
  const fyCube = pivot(fy);
  const fzCube = pivot(fz);

  const L = 116 * fyCube - 16;
  const a = 500 * (fxCube - fyCube);
  const bLab = 200 * (fxCube - fzCube);
  return [L, a, bLab];
};

const ciede2000ColorDistance = (rgb1: number[] | Uint8ClampedArray, rgb2: number[] | Uint8ClampedArray) => {
  const lab1 = rgbToLab(Array.from(rgb1.slice(0, 3)));
  const lab2 = rgbToLab(Array.from(rgb2.slice(0, 3)));

  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const avgLp = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;

  const h1p = Math.atan2(b1, a1p) + (Math.atan2(b1, a1p) < 0 ? 2 * Math.PI : 0);
  const h2p = Math.atan2(b2, a2p) + (Math.atan2(b2, a2p) < 0 ? 2 * Math.PI : 0);

  let deltahp = h2p - h1p;
  if (C1p * C2p === 0) {
    deltahp = 0;
  } else if (Math.abs(deltahp) > Math.PI) {
    deltahp += deltahp > 0 ? -2 * Math.PI : 2 * Math.PI;
  }

  const deltaLp = L2 - L1;
  const deltaCp = C2p - C1p;
  const deltaHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deltahp / 2);

  const avgHp =
    Math.abs(h1p - h2p) > Math.PI
      ? (h1p + h2p + 2 * Math.PI) / 2
      : (h1p + h2p) / 2;

  const T =
    1 -
    0.17 * Math.cos(avgHp - Math.PI / 6) +
    0.24 * Math.cos(2 * avgHp) +
    0.32 * Math.cos(3 * avgHp + Math.PI / 30) -
    0.2 * Math.cos(4 * avgHp - (63 * Math.PI) / 180);
  const deltaTheta = ((30 * Math.PI) / 180) * Math.exp(-Math.pow((avgHp - (275 * Math.PI) / 180) / ((25 * Math.PI) / 180), 2));
  const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const Sl = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;
  const Rt = -Math.sin(2 * deltaTheta) * Rc;
  return Math.sqrt(
    Math.pow(deltaLp / Sl, 2) +
    Math.pow(deltaCp / Sc, 2) +
    Math.pow(deltaHp / Sh, 2) +
    Rt * (deltaCp / Sc) * (deltaHp / Sh)
  );
};

const isAlreadyStudPalette = (pixels: Uint8ClampedArray) => {
  for (let i = 0; i < pixels.length; i += 4) {
    const hex = rgbToHex(pixels[i], pixels[i + 1], pixels[i + 2]).toLowerCase();
    if (!STUD_COLOR_SET.has(hex)) {
      return false;
    }
  }
  return true;
};

const buildStudPreviewFromStep2 = async (src: string): Promise<string | null> => {
  const loaded = await loadImagePixels(src, 8000, MAX_STUD_PREVIEW_PIXELS);
  if (!loaded) {
    return null;
  }
  const { pixels, width, height } = loaded;
  const baseStudMap = ALL_BRICKLINK_SOLID_COLORS.reduce((acc, color) => {
    acc[color.hex] = Number.MAX_SAFE_INTEGER;
    return acc;
  }, {} as Record<string, number>);
  const alreadyStud = isAlreadyStudPalette(pixels);
  const aligned = alreadyStud ? pixels : Uint8ClampedArray.from(alignPixelsToStudMap(Array.from(pixels), baseStudMap, ciede2000ColorDistance));
  const quantPixels = alreadyStud ? pixels : replaceSparseColors(aligned, SPARSE_COLOR_THRESHOLD, ciede2000ColorDistance);
  const studCanvas = document.createElement('canvas');
  drawStudImageOnCanvas(quantPixels, width, SCALING_FACTOR, studCanvas, DEFAULT_PIXEL_TYPE);
  return studCanvas.toDataURL('image/png', 0.92);
};

let studPreviewTaskId = 0;
const updateStudPreviewFromStep2 = async (src: string | null) => {
  const currentTask = ++studPreviewTaskId;
  studPreviewError.value = null;
  if (!src) {
    if (!isProductMode.value) {
      studPreviewLoading.value = false;
      studPreview.value = null;
    }
    return;
  }
  studPreviewLoading.value = true;
  studPreview.value = null;
  // ปล่อย event loop ให้อัพเดต UI ก่อนเริ่มงานแปลงพรีวิวที่หนัก
  await new Promise((resolve) => setTimeout(resolve, 0));
  const withTimeout = Promise.race([
    buildStudPreviewFromStep2(src),
    new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('โหลดพรีวิวนานเกินไป')), STUD_PREVIEW_TIMEOUT_MS)
    )
  ]);
  try {
    const preview = await withTimeout;
    if (currentTask !== studPreviewTaskId) {
      studPreviewLoading.value = false;
      return;
    }
    if (preview) {
      studPreview.value = preview;
    } else {
      studPreview.value = null;
      studPreviewError.value = 'ไม่สามารถแปลงภาพ Step 2 เป็นพรีวิวตัวต่อได้';
    }
  } catch (error: any) {
    if (currentTask !== studPreviewTaskId) {
      studPreviewLoading.value = false;
      return;
    }
    // fallback แสดงภาพดิบ (จะได้ไม่ค้างโหลด) และแจ้งเตือน
    studPreview.value = src;
    studPreviewError.value = error?.message ?? 'โหลดพรีวิวไม่สำเร็จ';
  } finally {
    if (currentTask === studPreviewTaskId) {
      studPreviewLoading.value = false;
    }
  }
};

onMounted(() => {
  // หากมี id ให้โหลดจาก API ทันที เพื่อใช้ข้อมูลจริง
  if (hasLinkedOrder.value) {
    finalPreview.value = null; // เคลียร์ค่าเดิมเพื่อรอข้อมูลจากฐาน
  }
});

watch(
  () => step2PreviewSource.value,
  (next) => {
    if (isProductMode.value) return;
    updateStudPreviewFromStep2(next);
    if (hasLinkedOrder.value) {
      finalPreview.value = null;
    }
    if (next) {
      const img = new Image();
      img.onload = () => {
        previewResolution.value = { width: img.naturalWidth, height: img.naturalHeight };
      };
      img.src = next;
    }
  },
  { immediate: true }
);

watch(
  () => finalPreview.value,
  (next) => {
    if (isProductMode.value) return;
    if (step2PreviewSource.value) return;
    studPreview.value = next ?? null;
  }
);

const formatDateTime = (value: string | null | undefined) => {
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

const formatCurrency = (value: number | string | null | undefined) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(num);
};

const resolveStatusString = (input: any) => {
  if (!input) return '';
  if (typeof input === 'object') {
    const candidate =
      input.payment_status ??
      input.status ??
      input.status_text ??
      input.state ??
      '';
    return String(candidate);
  }
  return String(input);
};

const normalizeStatus = (status: string | null | undefined | Record<string, any>) =>
  resolveStatusString(status).toLowerCase().trim();

const pendingTokens = [
  'unpaid',
  'pending',
  'รอ',
  'รอชำระ',
  'ยังไม่',
  'wait',
  'waiting',
  'await',
  'awaiting',
  'payment_pending',
  'waiting_payment',
  'wait_payment',
  'รอตรวจสอบ',
  'รอจ่าย'
];
const paidTokens = [
  'paid',
  'ชำระแล้ว',
  'ชำระเงินแล้ว',
  'success',
  'successful',
  'สำเร็จ',
  'complete',
  'completed',
  'payment_succeeded',
  'paid_success'
];

const isPending = (status: string | null | undefined | Record<string, any>) => {
  const s = normalizeStatus(status);
  if (!s) return true;
  return pendingTokens.some((token) => s.includes(token));
};

const isPaidStatus = (status: string | null | undefined | Record<string, any>) => {
  const s = normalizeStatus(status);
  if (!s || isPending(s)) return false;
  return paidTokens.some((token) => s.includes(token));
};

const statusBadge = (statusOrOrder: string | null | undefined | Record<string, any>) => {
  const raw = resolveStatusString(statusOrOrder);
  if (!raw) return { text: 'รอชำระเงิน', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (isPending(statusOrOrder)) return { text: raw, color: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (isPaidStatus(statusOrOrder)) return { text: raw, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  const s = raw.toLowerCase();
  if (s.includes('ship')) return { text: raw, color: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (s.includes('cancel')) return { text: raw, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  return { text: raw, color: 'bg-amber-50 text-amber-700 border-amber-200' };
};

const paymentLink = (order: Record<string, any>) => {
  const ref = order?.payment_ref || order?.payment_link;
  if (typeof ref !== 'string') return null;
  const trimmed = ref.trim();
  if (!trimmed) return null;
  const looksLikeUrl = /^https?:\/\//i.test(trimmed);
  return looksLikeUrl ? trimmed : null;
};

const handleDownloadSample = () => {
  remixAppRef.value?.handleGenerateInstructions?.();
};

const resetAddressForm = () => {
  addressForm.label = '';
  addressForm.recipient_name = '';
  addressForm.phone = '';
  addressForm.address_line = '';
  addressForm.province = '';
  addressForm.district = '';
  addressForm.subdistrict = '';
  addressForm.postcode = '';
  addressForm.is_default = false;
  addressFormError.value = null;
};

const openAddressModal = () => {
  if (!user.value) {
    requireAuth(() => openAddressModal());
    return;
  }
  resetAddressForm();
  showAddressModal.value = true;
};

const closeAddressModal = () => {
  resetAddressForm();
  showAddressModal.value = false;
};

const loadAddresses = async () => {
  if (!user.value?.id) return;
  addressesLoading.value = true;
  addressesError.value = null;
  try {
    const data = await fetchAddresses(user.value.id);
    addresses.value = data ?? [];
    if (!selectedAddressId.value && data?.length) {
      const defaultAddress = data.find((item: any) => item.is_default) ?? data[0];
      selectedAddressId.value = defaultAddress?.id != null ? Number(defaultAddress.id) : null;
    }
    if ((addresses.value?.length ?? 0) === 0) {
      showAddressModal.value = true;
    }
  } catch (error: any) {
    addressesError.value = error?.message ?? 'ไม่สามารถโหลดที่อยู่ได้';
    addresses.value = [];
  } finally {
    addressesLoading.value = false;
    addressesInitialized.value = true;
  }
};

const saveAddress = async () => {
  if (!user.value?.id) {
    requireAuth(() => saveAddress());
    return;
  }
  addressFormError.value = null;
  addressSavedMessage.value = null;
  if (!addressForm.recipient_name || !addressForm.address_line) {
    addressFormError.value = 'กรุณากรอกชื่อผู้รับและที่อยู่';
    return;
  }
  addressSaving.value = true;
  try {
    const created = await createAddress(user.value.id, {
      ...addressForm,
      user_id: user.value.id
    });
    if (addressForm.is_default && created?.id) {
      await setDefaultAddress(created.id, user.value.id);
    }
    await loadAddresses();
    selectedAddressId.value = created?.id != null ? Number(created.id) : selectedAddressId.value;
    addressSavedMessage.value = 'บันทึกที่อยู่เรียบร้อย';
    resetAddressForm();
    showAddressModal.value = false;
  } catch (error: any) {
    addressFormError.value = error?.message ?? 'บันทึกที่อยู่ไม่สำเร็จ';
  } finally {
    addressSaving.value = false;
    setTimeout(() => {
      addressSavedMessage.value = null;
    }, 2200);
  }
};

const removeAddress = async (addressId: number) => {
  if (!user.value?.id) return;
  addressDeleting.value[addressId] = true;
  try {
    await deleteAddress(addressId, user.value.id);
    if (selectedAddressId.value === addressId) {
      selectedAddressId.value = null;
    }
    await loadAddresses();
  } catch (error: any) {
    addressesError.value = error?.message ?? 'ลบที่อยู่ไม่สำเร็จ';
  } finally {
    addressDeleting.value[addressId] = false;
  }
};

const markDefault = async (addressId: number) => {
  if (!user.value?.id) return;
  addressDefaulting.value[addressId] = true;
  try {
    await setDefaultAddress(addressId, user.value.id);
    selectedAddressId.value = Number(addressId);
    await loadAddresses();
  } catch (error: any) {
    addressesError.value = error?.message ?? 'ไม่สามารถตั้งค่าที่อยู่หลักได้';
  } finally {
    addressDefaulting.value[addressId] = false;
  }
};

const summaryOrder = computed(() => latestOrder.value);
const summaryOrderId = computed(() => summaryOrder.value?.id ?? currentOrderId.value ?? null);
const summaryCreatedAt = computed(() => summaryOrder.value?.created_at ?? null);
const summaryUpdatedAt = computed(() => summaryOrder.value?.updated_at ?? summaryOrder.value?.created_at ?? null);
const summaryStatusBadge = computed(() => statusBadge(summaryOrder.value));
const isPaymentCompleted = computed(() => {
  const currentId = summaryOrderId.value ?? currentOrderId.value;
  const fromStatus =
    summaryOrder.value?.id != null &&
    currentId != null &&
    String(summaryOrder.value.id) === String(currentId) &&
    isPaidStatus(summaryOrder.value);
  return Boolean(fromStatus);
});
const isSummaryLoading = computed(() => {
  if (hasProductQuery.value) return productLoading.value;
  if (hasLinkedOrder.value) return selectedOrderLoading.value;
  return false;
});
const summaryPrice = computed(() => {
  if (hasProductQuery.value && productLoading.value) return null;
  const rawAmount = summaryOrder.value?.total_amount;
  const normalized = rawAmount != null ? Number(rawAmount) : NaN;
  if (!Number.isNaN(normalized) && normalized > 0) return normalized;
  const metadataAmount = summaryOrder.value?.metadata?.format_price?.amount;
  const normalizedMetadata = metadataAmount != null ? Number(metadataAmount) : NaN;
  if (!Number.isNaN(normalizedMetadata) && normalizedMetadata > 0) return normalizedMetadata;
  if (productPrice.value != null) {
    return productPrice.value;
  }
  return DEFAULT_ORDER_PRICE;
});

const previewResolution = ref({ width: 0, height: 0 });

const instructionPdfMeta = computed(() => summaryOrder.value?.metadata?.instruction_pdf ?? null);
const instructionPdfUrl = computed(() => {
  const meta = instructionPdfMeta.value;
  if (!meta) return null;
  return meta.signedUrl ?? meta.publicUrl ?? null;
});
const handleDownloadInstructionPdf = () => {
  const url = instructionPdfUrl.value;
  if (!url) return;
  window.open(url, '_blank');
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

  const studs = width * height;

  return { corners, clips, sideShort, sideLong, base32, base16, studs };
};

const kitBreakdown = computed(() => getFrameAndBase(previewResolution.value.width, previewResolution.value.height));

const loadMyOrders = async () => {
  if (!user.value?.id) return;
  myOrdersLoading.value = true;
  myOrdersError.value = null;
  try {
    const result = await fetchMyOrders(user.value.id, { page: 1, pageSize: 5 });
    myOrders.value = result.items;
  } catch (error: any) {
    myOrdersError.value = error?.message ?? 'ไม่สามารถโหลดออเดอร์ของคุณได้';
  } finally {
    myOrdersLoading.value = false;
    if (initialLoadPending.value) {
      initialLoadPending.value = false;
    }
  }
};

const loadSelectedOrder = async () => {
  if (!selectedOrderId.value) {
    selectedOrder.value = null;
    selectedOrderError.value = null;
    return;
  }
  if (!user.value?.id) {
    selectedOrder.value = null;
    selectedOrderLoading.value = false;
    selectedOrderError.value = 'กรุณาเข้าสู่ระบบเพื่อดูออเดอร์นี้';
    return;
  }
  selectedOrderLoading.value = true;
  selectedOrderError.value = null;
  try {
    const data = await fetchOrderById(selectedOrderId.value, user.value.id);
    if (!data) {
      selectedOrderError.value = 'ไม่พบออเดอร์จากลิงก์นี้';
      selectedOrder.value = null;
      linkedProductInfo.value = null;
    } else {
      selectedOrder.value = data;
      linkedProductInfo.value = mapOrderProductMeta(data);
      if (data.original_image !== undefined) {
        originalImage.value = data.original_image;
      }
      if (data.crop_interaction !== undefined) {
        cropInteractionForOrder.value = data.crop_interaction;
      }
      if (data.preview_url !== undefined) {
        step2Preview.value = data.preview_url || null;
      }
      if (linkedProductInfo.value?.image) {
        studPreview.value = linkedProductInfo.value.image;
      }
      if (linkedProductInfo.value?.resolution?.width && linkedProductInfo.value?.resolution?.height) {
        previewResolution.value = linkedProductInfo.value.resolution;
      }
    }
  } catch (error: any) {
    selectedOrderError.value = error?.message ?? 'ไม่สามารถโหลดออเดอร์ที่ลิงก์มาได้';
    selectedOrder.value = null;
    linkedProductInfo.value = null;
  } finally {
    selectedOrderLoading.value = false;
    if (initialLoadPending.value) {
      initialLoadPending.value = false;
    }
  }
};

watch(
  () => user.value?.id,
  (next) => {
    if (next) {
      loadMyOrders();
      loadAddresses();
      loadAddressData();
      loadSelectedOrder();
    } else {
      myOrders.value = [];
      selectedOrder.value = null;
      selectedOrderLoading.value = false;
      selectedOrderError.value = hasLinkedOrder.value ? 'กรุณาเข้าสู่ระบบเพื่อดูออเดอร์นี้' : null;
      addresses.value = [];
      linkedProductInfo.value = null;
      initialLoadPending.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => selectedOrderId.value,
  (next) => {
    if (user.value?.id && selectedOrderId.value) {
      loadSelectedOrder();
    } else {
      selectedOrder.value = null;
      selectedOrderLoading.value = false;
      selectedOrderError.value =
        selectedOrderId.value && !user.value?.id ? 'กรุณาเข้าสู่ระบบเพื่อดูออเดอร์นี้' : null;
      linkedProductInfo.value = null;
    }
  }
);

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

const mapProductRow = (row: any) => {
  const meta = row?.metadata ?? {};
  const size = meta.size ?? meta.resolution ?? null;
  const resolution = parseSizeText(size) ?? { width: 0, height: 0 };
  const studs = Number(meta.studs ?? meta.totalStuds ?? meta.studCount ?? 0) || 0;
  const price = meta.priceKit ?? row?.price ?? meta.price ?? null;
  const instructionPdf = meta.instruction_pdf ?? null;
  return {
    id: row?.id,
    slug: row?.slug ?? null,
    name: row?.name ?? 'Ready kit',
    price: price != null ? Number(price) : null,
    image: meta.image ?? meta.preview ?? meta.thumbnail ?? '/placeholder.png',
    studs,
    size: typeof size === 'string' ? size : resolution.width && resolution.height ? `${resolution.width}x${resolution.height}` : '',
    resolution,
    difficulty: meta.difficulty ?? 'Beginner',
    tag: meta.tag ?? meta.type ?? 'พร้อมสร้าง',
    instructionPdf
  };
};

const mapOrderProductMeta = (order: Record<string, any> | null | undefined) => {
  if (!order) return null;
  const meta = order.metadata ?? {};
  if (!meta || typeof meta !== 'object') return null;
  const hasProductHints =
    meta.product_id != null ||
    typeof meta.product_slug === 'string' ||
    typeof meta.product_name === 'string' ||
    meta.priceKit != null ||
    meta.price != null ||
    (typeof order.source === 'string' && order.source.includes('product'));
  if (!hasProductHints) return null;

  const size = meta.size ?? meta.resolution ?? null;
  const resolution = parseSizeText(size) ?? { width: 0, height: 0 };
  const studs =
    Number(meta.studs ?? meta.totalStuds ?? meta.studCount ?? 0) ||
    (resolution.width && resolution.height ? resolution.width * resolution.height : 0);
  const priceRaw =
    meta.format_price?.amount ??
    meta.priceKit ??
    meta.price ??
    order.total_amount ??
    null;
  const price = priceRaw != null && !Number.isNaN(Number(priceRaw)) ? Number(priceRaw) : null;
  const image = meta.product_image ?? meta.image ?? meta.preview ?? order.preview_url ?? null;
  const instructionPdf = meta.instruction_pdf ?? null;

  return {
    id: (meta.product_id ?? meta.product_slug ?? order.id ?? 'ready-kit') as number | string,
    slug: typeof meta.product_slug === 'string' ? meta.product_slug : null,
    name: meta.product_name ?? 'Ready kit',
    price,
    image,
    studs,
    size:
      typeof size === 'string'
        ? size
        : resolution.width && resolution.height
          ? `${resolution.width}x${resolution.height}`
          : '',
    resolution,
    difficulty: meta.difficulty ?? 'Beginner',
    tag: meta.tag ?? meta.type ?? 'พร้อมสร้าง',
    instructionPdf
  };
};

const loadProduct = async () => {
  if (!productQuery.value) {
    productInfo.value = null;
    return;
  }
  productLoading.value = true;
  productError.value = null;
  try {
    const identifier = productQuery.value;
    const parsedId = Number(identifier);
    const filters = [`slug.eq.${identifier}`];
    if (!Number.isNaN(parsedId)) {
      filters.push(`id.eq.${parsedId}`);
    }
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, price, active, metadata')
      .or(filters.join(','))
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      productInfo.value = null;
      productError.value = 'ไม่พบสินค้าที่เลือก';
      return;
    }
    const mapped = mapProductRow(data);
    productInfo.value = mapped;
    studPreview.value = mapped.image ?? null;
    previewResolution.value = mapped.resolution;
    if (mapped.image && (!mapped.resolution.width || !mapped.resolution.height) && typeof window !== 'undefined') {
      const img = new Image();
      img.onload = () => {
        previewResolution.value = { width: img.naturalWidth, height: img.naturalHeight };
      };
      img.src = mapped.image;
    }
  } catch (error: any) {
    productError.value = error?.message ?? 'โหลดสินค้าไม่สำเร็จ';
    productInfo.value = null;
  } finally {
    productLoading.value = false;
  }
};

watch(
  () => productQuery.value,
  () => {
    studPreview.value = null;
    studPreviewError.value = null;
    finalPreview.value = null;
    loadProduct();
  },
  { immediate: true }
);

watch(
  () => activeProductInfo.value,
  (info) => {
    if (!info) return;
    if (info.image) {
      studPreview.value = info.image;
    }
    if (info.resolution?.width && info.resolution?.height) {
      previewResolution.value = info.resolution;
    }
  }
);

const startStripeCheckout = async (orderId: string | number) => {
  if (!orderId) {
    orderError.value = 'ไม่พบเลขออเดอร์เพื่อไปหน้าจ่าย';
    return;
  }
  isRedirectingToStripe.value = true;
  try {
    const response = await $fetch<{ url?: string | null; sessionId?: string | null }>('/api/checkout-session', {
      method: 'POST',
      body: { orderId }
    });
    const redirectUrl = response?.url;
    if (!redirectUrl) {
      throw new Error('ไม่พบลิงก์จ่ายเงินจาก Stripe');
    }
    window.location.href = redirectUrl;
  } catch (error: any) {
    orderError.value =
      error?.data?.statusMessage || error?.message || 'ไม่สามารถสร้างลิงก์ชำระเงินได้';
  } finally {
    isRedirectingToStripe.value = false;
  }
};

const payButtonDisabled = computed(
  () =>
    initialLoadPending.value ||
    isCreatingOrder.value ||
    isRedirectingToStripe.value ||
    !isShippingFilled.value ||
    isPaymentCompleted.value
);

const payButtonText = computed(() => {
  if (initialLoadPending.value || selectedOrderLoading.value || myOrdersLoading.value) return 'Loading...';
  if (isPaymentCompleted.value) return 'ชำระเงินสำเร็จแล้ว';
  if (isRedirectingToStripe.value) return 'กำลังไปหน้าจ่ายเงิน…';
  if (isCreatingOrder.value) return 'กำลังสร้างออเดอร์…';
  return 'ชำระเงิน';
});
const showShippingWarning = computed(
  () => addressesInitialized.value && !addressesLoading.value && !isShippingFilled.value && !isPaymentCompleted.value
);

const buildStep3Meta = () => {
  const res = previewResolution.value;
  const studs = res?.width && res?.height ? res.width * res.height : kitBreakdown.value?.studs ?? null;
  const preview = checkoutPreview.value || finalPreview.value || studPreview.value || step2PreviewSource.value || null;
  const stud = studPreview.value || finalPreview.value || checkoutPreview.value || null;
  return {
    stud_preview: stud ?? null,
    step3_preview: preview ?? null,
    instruction_preview: stud ?? preview ?? null,
    step3_resolution: res?.width && res?.height ? res : null,
    step3_studs: studs ?? null,
    pixel_type: DEFAULT_PIXEL_TYPE,
    step3_preview_source: isProductMode.value ? 'product' : 'custom'
  };
};

const handleCreateOrder = async () => {
  if (isPaymentCompleted.value) {
    orderError.value = 'ออเดอร์นี้ชำระเงินแล้ว';
    return;
  }
  orderError.value = null;
  if (!user.value) {
    requireAuth(() => handleCreateOrder());
    return;
  }
  const productFlow = isProductMode.value;
  const info = activeProductInfo.value;
  if (!productFlow) {
    if (!step2PreviewSource.value) {
      orderError.value = 'ยังไม่มีรูป Step 2 กรุณากลับไปสร้างก่อน';
      return;
    }
    if (!checkoutPreview.value) {
      orderError.value = 'ยังไม่มีรูป Step 3 กรุณากลับไปสร้างก่อน';
      return;
    }
  } else if (!info) {
    orderError.value = 'ไม่พบข้อมูลสินค้า';
    return;
  }
  if (!effectiveShipping.value || !isShippingFilled.value) {
    orderError.value = 'กรุณาเลือกหรือเพิ่มที่อยู่จัดส่งให้ครบถ้วน';
    return;
  }
  isCreatingOrder.value = true;
  try {
    let data: any = null;
    let createdOrderId: string | number | null = null;
    const shippingSnapshot = effectiveShipping.value ? { shipping_snapshot: effectiveShipping.value } : {};
    const mergedMetadataForLinked = hasLinkedOrder.value
      ? { ...(selectedOrder.value?.metadata ?? {}), ...shippingSnapshot }
      : shippingSnapshot;
    const step3Meta = buildStep3Meta();
    const productMetadata = info
      ? {
          product_id: (info.id as any) ?? null,
          product_slug: info.slug ?? null,
          product_name: info.name ?? null,
          size: info.size ?? null,
          studs: info.studs ?? null,
          difficulty: info.difficulty ?? null,
          tag: info.tag ?? null,
          product_image: info.image ?? null,
          ...(info.instructionPdf ? { instruction_pdf: info.instructionPdf } : {})
        }
      : {};

    if (productFlow && hasLinkedOrder.value && selectedOrderId.value) {
      data = await updateOrderAssets(
        selectedOrderId.value,
        {
          previewUrl: info?.image ?? step2PreviewSource.value,
          source: 'checkout:product',
          cropInteraction: null,
          originalImage: null,
          totalAmount: productPrice.value ?? DEFAULT_ORDER_PRICE,
          metadata: { ...mergedMetadataForLinked, ...productMetadata, ...step3Meta }
        },
        user.value.id
      );
      createdOrderId = selectedOrderId.value;
      orderSuccess.value = { id: selectedOrderId.value };
    } else if (!productFlow && hasLinkedOrder.value && selectedOrderId.value) {
      data = await updateOrderAssets(
        selectedOrderId.value,
        {
          previewUrl: step2PreviewSource.value,
          source: 'checkout:linked',
          cropInteraction: cropInteractionForOrder.value ?? null,
          originalImage: originalImage.value ?? null,
          metadata: { ...mergedMetadataForLinked, ...step3Meta }
        },
        user.value.id
      );
      createdOrderId = selectedOrderId.value;
      orderSuccess.value = { id: selectedOrderId.value };
    } else {
      data = await recordPendingPaymentOrder({
        userId: user.value.id,
        previewUrl: productFlow ? info?.image ?? null : step2PreviewSource.value,
        source: productFlow ? 'checkout:product' : 'checkout',
        cropInteraction: productFlow ? null : cropInteractionForOrder.value ?? null,
        originalImage: productFlow ? null : originalImage.value ?? null,
        totalAmount: productFlow ? productPrice.value ?? DEFAULT_ORDER_PRICE : undefined,
        metadata: productFlow
          ? {
              ...productMetadata,
              shipping_snapshot: effectiveShipping.value ?? null,
              ...step3Meta
            }
          : { ...shippingSnapshot, ...step3Meta }
      });
      createdOrderId = data?.id ?? null;
      orderSuccess.value = createdOrderId ? { id: createdOrderId } : null;
    }
    await loadMyOrders();
    if (createdOrderId != null) {
      await startStripeCheckout(createdOrderId);
    } else {
      orderError.value = 'สร้างออเดอร์สำเร็จ แต่ไม่พบเลขออเดอร์เพื่อจ่ายเงิน';
    }
  } catch (error: any) {
    orderError.value = error?.message ?? 'ไม่สามารถสร้างออเดอร์ได้';
    console.error('create order error', error);
  } finally {
    isCreatingOrder.value = false;
  }
};
</script>
<style lang="scss">
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

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
          <div class="flex flex-wrap gap-3 py-4">
            <NuxtLink
              :to="brickLink"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              กลับไปแก้ภาพ
            </NuxtLink>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="isCreatingOrder"
              @click="handleCreateOrder"
            >
              <span v-if="isCreatingOrder">กำลังสร้างออเดอร์…</span>
              <span v-else>ชำระเงิน</span>
            </button>
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
                    ตรวจสอบรูป
                  </p>
                  <p class="text-sm text-slate-600">
                    พรีวิว Step 3 ล่าสุด (รวมการแก้สีแล้ว)
                  </p>
                </div>
                <span
                  class="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700"
                  >พร้อมสั่ง</span
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
              <p class="mt-2 text-xs text-slate-500">
                ถ้าอยากแก้อีกครั้ง กดกลับไป Step 3 ก่อน แล้วค่อยกลับมาชำระเงิน
              </p>
            </div>
            <div
              v-else-if="isPreviewLoading"
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm animate-pulse"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p
                    class="text-xs font-semibold uppercase tracking-wide text-indigo-600"
                  >
                    กำลังโหลดพรีวิว
                  </p>
                  <p class="text-sm text-slate-600">
                    ดึงรูปจากออเดอร์ที่ลิงก์มา...
                  </p>
                </div>
                <span
                  class="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
                  >loading</span
                >
              </div>
              <div class="mt-3 h-64 rounded-lg bg-slate-100"></div>
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

            <ReceiveInfo />
          </div>

          <aside class="space-y-4">
            <section
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
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
              </div>
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
              <div
                v-if="user && addresses.length === 0"
                class="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-3"
              >
                <p class="text-sm font-semibold text-amber-800">
                  เพิ่มที่อยู่จัดส่งแรกของคุณ
                </p>
                <p class="text-xs text-amber-700">
                  บันทึกไว้แล้วจะเลือกอัตโนมัติ
                </p>
                <AddressForm
                  :model-value="addressForm"
                  :loading="addressSaving"
                  :error="addressFormError"
                  :saved-message="addressSavedMessage"
                  :show-default-toggle="true"
                  submit-label="บันทึก"
                  @submit="saveAddress"
                  @reset="resetAddressForm"
                  @update:model-value="(v) => Object.assign(addressForm, v)"
                />
              </div>
              <details
                v-else
                class="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <summary
                  class="cursor-pointer text-sm font-semibold text-slate-800"
                >
                  เพิ่มที่อยู่ใหม่
                </summary>
                <div class="mt-3">
                  <AddressForm
                    :model-value="addressForm"
                    :loading="addressSaving"
                    :error="addressFormError"
                    :saved-message="addressSavedMessage"
                    :show-default-toggle="true"
                    submit-label="บันทึก"
                    @submit="saveAddress"
                    @reset="resetAddressForm"
                    @update:model-value="(v) => Object.assign(addressForm, v)"
                  />
                </div>
              </details>
            </section>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { alignPixelsToStudMap, drawStudImageOnCanvas, replaceSparseColors, rgbToHex } from '~/lib/brickArtRemix/algo';
import { ALL_BRICKLINK_SOLID_COLORS, PIXEL_TYPE_OPTIONS } from '~/lib/brickArtRemix/bricklinkColors';
import AddressForm from '~/components/address/AddressForm.vue';
import ReceiveInfo from '~/components/checkout/ReceiveInfo.vue';
import { useAddresses } from '~/composables/useAddresses';
import { useThaiAddressSearch } from '~/composables/useThaiAddressSearch';

const route = useRoute();
const { openAuthModal, user, requireAuth } = useAuthFlow();
const { recordPendingPaymentOrder, fetchMyOrders, fetchOrderById, updateOrderAssets, upsertOrderShipping } = useOrders();
const { fetchAddresses, createAddress, deleteAddress, setDefaultAddress } = useAddresses();
const { loadAddressData } = useThaiAddressSearch();
const DEFAULT_ORDER_PRICE = 999;
const STUD_COLOR_SET = new Set(ALL_BRICKLINK_SOLID_COLORS.map((c) => c.hex.toLowerCase()));
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
const addressesError = ref<string | null>(null);
const addressFormError = ref<string | null>(null);
const addressSaving = ref(false);
const addressDeleting = ref<Record<number, boolean>>({});
const addressDefaulting = ref<Record<number, boolean>>({});
const addressSavedMessage = ref<string | null>(null);
const selectedAddressId = ref<number | null>(null);
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
const step2PreviewSource = computed(() => linkedOrderStep2Preview.value ?? step2Preview.value ?? null);
const studPreview = ref<string | null>(null);
const studPreviewError = ref<string | null>(null);
const studPreviewLoading = ref(false);
const checkoutPreview = computed(() => studPreview.value ?? finalPreview.value ?? null);
const latestOrder = computed(() => (hasLinkedOrder.value ? selectedOrder.value : myOrders.value?.[0] ?? null));
const isPreviewLoading = computed(
  () =>
    (hasLinkedOrder.value && (selectedOrderLoading.value || (!selectedOrder.value && !selectedOrderError.value))) ||
    studPreviewLoading.value
);
const currentOrderId = computed(() => selectedOrderId.value ?? orderSuccess.value?.id ?? latestOrder.value?.id ?? null);
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

const loadImagePixels = async (
  src: string
): Promise<{ pixels: Uint8ClampedArray; width: number; height: number } | null> => {
  if (typeof window === 'undefined') {
    return null;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, img.width);
      canvas.height = Math.max(1, img.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      resolve({ pixels: new Uint8ClampedArray(data), width: canvas.width, height: canvas.height });
    };
    img.onerror = () => resolve(null);
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
  const loaded = await loadImagePixels(src);
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
    studPreviewLoading.value = false;
    studPreview.value = null;
    return;
  }
  studPreviewLoading.value = true;
  const preview = await buildStudPreviewFromStep2(src);
  if (currentTask !== studPreviewTaskId) {
    return;
  }
  studPreviewLoading.value = false;
  if (preview) {
    studPreview.value = preview;
  } else {
    studPreview.value = null;
    studPreviewError.value = 'ไม่สามารถแปลงภาพ Step 2 เป็นพรีวิวตัวต่อได้';
  }
};

onMounted(() => {
  // หากมี id ให้โหลดจาก API ทันที เพื่อใช้ข้อมูลจริง
  if (hasLinkedOrder.value) {
    finalPreview.value = null; // เคลียร์ค่าเดิมเพื่อรอข้อมูลจากฐาน
    if (user.value?.id) {
      loadSelectedOrder();
    }
  }
});

watch(
  () => step2PreviewSource.value,
  (next) => {
    updateStudPreviewFromStep2(next);
    if (hasLinkedOrder.value) {
      finalPreview.value = null;
    }
  },
  { immediate: true }
);

watch(
  () => finalPreview.value,
  (next) => {
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

const statusBadge = (status: string | null | undefined) => {
  if (!status) return { text: 'รอชำระเงิน', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  const s = String(status).toLowerCase();
  if (s.includes('paid') || s.includes('สำเร็จ')) return { text: status, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (s.includes('ship')) return { text: status, color: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (s.includes('cancel')) return { text: status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  return { text: status, color: 'bg-amber-50 text-amber-700 border-amber-200' };
};

const isPending = (status: string | null | undefined) => {
  if (!status) return true;
  const s = String(status).toLowerCase();
  return s.includes('pending') || s.includes('รอชำระ') || s.includes('unpaid');
};

const paymentLink = (order: Record<string, any>) => {
  const ref = order?.payment_ref || order?.payment_link;
  if (typeof ref !== 'string') return null;
  const trimmed = ref.trim();
  if (!trimmed) return null;
  const looksLikeUrl = /^https?:\/\//i.test(trimmed);
  return looksLikeUrl ? trimmed : null;
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
  } catch (error: any) {
    addressesError.value = error?.message ?? 'ไม่สามารถโหลดที่อยู่ได้';
    addresses.value = [];
  } finally {
    addressesLoading.value = false;
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
const summaryStatusBadge = computed(() => statusBadge(summaryOrder.value?.status));
const summaryPrice = computed(() => {
  const rawAmount = summaryOrder.value?.total_amount;
  const normalized = typeof rawAmount === 'number' ? rawAmount : Number(rawAmount ?? DEFAULT_ORDER_PRICE);
  return !Number.isNaN(normalized) && normalized > 0 ? normalized : DEFAULT_ORDER_PRICE;
});

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
  }
};

const loadSelectedOrder = async () => {
  if (!user.value?.id || !selectedOrderId.value) {
    selectedOrder.value = null;
    selectedOrderError.value = null;
    return;
  }
  selectedOrderLoading.value = true;
  selectedOrderError.value = null;
  try {
    const data = await fetchOrderById(selectedOrderId.value, user.value.id);
    if (!data) {
      selectedOrderError.value = 'ไม่พบออเดอร์จากลิงก์นี้';
      selectedOrder.value = null;
    } else {
      selectedOrder.value = data;
      if (data.original_image !== undefined) {
        originalImage.value = data.original_image;
      }
      if (data.crop_interaction !== undefined) {
        cropInteractionForOrder.value = data.crop_interaction;
      }
      if (data.preview_url !== undefined) {
        step2Preview.value = data.preview_url || null;
      }
    }
  } catch (error: any) {
    selectedOrderError.value = error?.message ?? 'ไม่สามารถโหลดออเดอร์ที่ลิงก์มาได้';
    selectedOrder.value = null;
  } finally {
    selectedOrderLoading.value = false;
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
      addresses.value = [];
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
      selectedOrderError.value = null;
    }
  }
);

const handleCreateOrder = async () => {
  orderError.value = null;
  if (!user.value) {
    requireAuth(() => handleCreateOrder());
    return;
  }
  if (!step2PreviewSource.value) {
    orderError.value = 'ยังไม่มีรูป Step 2 กรุณากลับไปสร้างก่อน';
    return;
  }
  if (!checkoutPreview.value) {
    orderError.value = 'ยังไม่มีรูป Step 3 กรุณากลับไปสร้างก่อน';
    return;
  }
  if (!effectiveShipping.value) {
    orderError.value = 'กรุณาเลือกหรือเพิ่มที่อยู่จัดส่ง';
    return;
  }
  isCreatingOrder.value = true;
  try {
    let data: any = null;
    if (hasLinkedOrder.value && selectedOrderId.value) {
      data = await updateOrderAssets(
        selectedOrderId.value,
        {
          previewUrl: step2PreviewSource.value,
          source: 'checkout:linked',
          cropInteraction: cropInteractionForOrder.value ?? null,
          originalImage: originalImage.value ?? null
        },
        user.value.id
      );
      orderSuccess.value = { id: selectedOrderId.value };
      await upsertOrderShipping(selectedOrderId.value, effectiveShipping.value);
    } else {
      data = await recordPendingPaymentOrder({
        userId: user.value.id,
        previewUrl: step2PreviewSource.value,
        source: 'checkout',
        cropInteraction: cropInteractionForOrder.value ?? null,
        originalImage: originalImage.value ?? null,
        shipping: effectiveShipping.value
      });
      orderSuccess.value = { id: data?.id ?? 'new' };
    }
    await loadMyOrders();
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

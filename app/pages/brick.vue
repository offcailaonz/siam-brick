<template>
  <div class="brick-bg--content">
    <div
      class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-6xl flex-col px-4 py-6 lg:py-10 space-y-4"
    >
      <div
        v-if="orderId"
        class="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm lg:flex lg:flex-wrap lg:justify-between items-center  gap-3"
      >
        <div>
          <p class="text-sm font-semibold text-slate-900">
            โหมดแก้ไขออเดอร์ #{{ orderId }}
          </p>
          <p class="text-xs text-slate-600">
            ระบบจะดึงรูปต้นฉบับและตำแหน่งครอปจากฐานข้อมูลให้
            เพื่อแก้ไขต่อได้ทันที
          </p>
        </div>
        <div class="flex flex-wrap gap-2 items-center justify-end">
          <button
            v-if="orderError"
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700"
            @click="loadOrderForEdit(true)"
          >
            ลองโหลดใหม่
          </button>
          <button
            v-if="orderId"
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            :disabled="savingEdits"
            @click="handleSaveEdits"
          >
            <span v-if="savingEdits">กำลังบันทึก...</span>
            <span v-else>บันทึกการแก้ไข</span>
          </button>
          <!-- <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="savingEdits"
            @click="goToCheckout"
          >
            กลับไป Checkout
          </button> -->
        </div>
      </div>

      <BrickArtRemixApp
        ref="remixAppRef"
        :enable-persistence="true"
        :enable-price-fetch="true"
        :initial-crop-interaction="initialCropInteraction"
        :default-image-src="initialImageSrc"
        :editing-order-id="orderId"
        :initial-format-price="initialFormatPrice"
        :initial-step2-preview="initialStep2Preview"
        :initial-step3-preview="initialStep3Preview"
        :initial-step3-base="initialStep3Base"
        @preview-modal="handlePreviewModal"
      />
    </div>
  </div>
  <BaseModal :open="previewModalOpen" title="ตัวอย่าง Step 3" max-width-class="max-w-4xl" @close="closePreviewModal">
    <div class="mt-2 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-3">
      <img
        v-if="previewModalSrc"
        :src="previewModalSrc"
        alt="Step 3 preview"
        class="max-h-[80vh] w-full object-contain rounded-lg bg-white"
      />
      <p v-else class="text-sm text-slate-500">ยังไม่มีรูปตัวอย่าง</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
type FormatPriceMeta = {
  amount: number;
  width?: number | null;
  height?: number | null;
  size?: string | null;
};

import BaseModal from '~/components/ui/BaseModal.vue';
import BrickArtRemixApp from '~/components/BrickArtRemix/BrickArtRemixApp.vue';

const route = useRoute();
const router = useRouter();
const { user, requireAuth } = useAuthFlow();
const { fetchOrderById, updateOrderAssets } = useOrders();

const orderId = computed(() => (route.query.id ? String(route.query.id) : null));
const orderLoading = ref(false);
const orderError = ref<string | null>(null);
const orderStatus = ref<string | null>(null);
const initialImageSrc = ref<string | null>(null);
const initialCropInteraction = ref<any | null>(null);
const initialStep2Preview = ref<string | null>(null);
const initialStep3Preview = ref<string | null>(null);
const initialStep3Base = ref<string | null>(null);
const initialFormatPrice = ref<number | null>(null);
const savingEdits = ref(false);
const saveMessage = ref<string | null>(null);
const lastLoadedKey = ref<string | null>(null);
const orderMetadata = ref<Record<string, any> | null>(null);
const previewModalOpen = ref(false);
const previewModalSrc = ref<string | null>(null);
const remixAppRef = ref<InstanceType<typeof BrickArtRemixApp> | null>(null);

const step2PreviewForOrder = useState<string | null>('brick-step2-preview', () => null);
const finalPreview = useState<string | null>('brick-final-step3-preview', () => null);
const originalImageForOrder = useState<string | null>('brick-original-image', () => null);
const cropInteractionForOrder = useState<Record<string, any> | null>('brick-crop-interaction', () => null);
const formatPrice = useState<number | null>('brick-format-price', () => null);
const formatPriceMeta = useState<FormatPriceMeta | null>('brick-format-price-meta', () => null);

const checkoutLink = computed(() => (orderId.value ? `/checkout?id=${orderId.value}` : '/checkout'));
const isPaidOrder = computed(() => {
  const status = orderStatus.value?.toLowerCase() ?? '';
  if (!status) return false;
  const paidTokens = ['paid', 'paid_success', 'complete', 'completed', 'สำเร็จ', 'payment_succeeded'];
  return paidTokens.some((token) => status.includes(token));
});
watch(
  () => isPaidOrder.value,
  (paid) => {
    if (paid) {
      router.replace('/');
    }
  }
);

const handlePreviewModal = (payload: { src: string | null }) => {
  previewModalSrc.value = payload?.src ?? null;
  previewModalOpen.value = Boolean(payload?.src);
};
const closePreviewModal = () => {
  previewModalOpen.value = false;
  previewModalSrc.value = null;
};
const normalizeFormatPriceMeta = (meta: any): FormatPriceMeta | null => {
  if (!meta || meta.amount == null) return null;
  const amount = Number(meta.amount);
  if (Number.isNaN(amount)) return null;
  const width = meta.width != null ? Number(meta.width) : null;
  const height = meta.height != null ? Number(meta.height) : null;
  const size =
    typeof meta.size === 'string' && meta.size.trim()
      ? meta.size
      : width != null && height != null
        ? `${Math.min(width, height)}x${Math.max(width, height)}`
        : null;
  return {
    amount,
    width,
    height,
    size
  };
};
const mergeOrderMetadata = (
  normalizedAmount: number | null,
  extras?: { instructionPdf?: Record<string, any> | null; step3Meta?: Record<string, any> | null }
): Record<string, any> | undefined => {
  const baseMetadata = orderMetadata.value ?? {};
  const sourceMeta = formatPriceMeta.value ?? (normalizedAmount != null ? { amount: normalizedAmount } : null);
  const amount = normalizedAmount ?? (sourceMeta?.amount != null ? Number(sourceMeta.amount) : null);
  const width = sourceMeta?.width != null ? Number(sourceMeta.width) : null;
  const height = sourceMeta?.height != null ? Number(sourceMeta.height) : null;
  const size =
    sourceMeta?.size && typeof sourceMeta.size === 'string' && sourceMeta.size.trim()
      ? sourceMeta.size
      : width != null && height != null
        ? `${Math.min(width, height)}x${Math.max(width, height)}`
        : null;

  const formatPricePayload =
    amount != null && !Number.isNaN(amount)
      ? {
          amount,
          width,
          height,
          size
        }
      : null;

  const hasExtras = Boolean(extras?.step3Meta) || Boolean(extras?.instructionPdf);
  if (!formatPricePayload && !orderMetadata.value && !hasExtras) {
    return undefined;
  }

  const merged = {
    ...baseMetadata,
    ...(formatPricePayload ? { format_price: formatPricePayload } : {}),
    ...(extras?.step3Meta ?? {}),
    ...(extras?.instructionPdf ? { instruction_pdf: extras.instructionPdf } : {})
  };

  return Object.keys(merged).length > 0 ? merged : undefined;
};

const loadOrderForEdit = async (force = false) => {
  if (!orderId.value) return;
  if (!user.value?.id) {
    orderError.value = 'ต้องเข้าสู่ระบบก่อนเพื่อโหลดออเดอร์';
    return;
  }
  const fetchKey = `${orderId.value}|${user.value.id}`;
  if (!force && fetchKey && fetchKey === lastLoadedKey.value) {
    return;
  }
  lastLoadedKey.value = fetchKey;
  orderLoading.value = true;
  orderError.value = null;
  initialImageSrc.value = null;
  initialCropInteraction.value = null;
  initialStep2Preview.value = null;
  initialStep3Preview.value = null;
  initialStep3Base.value = null;
  step2PreviewForOrder.value = null;
  try {
    const data = await fetchOrderById(orderId.value, user.value.id);
    if (!data) {
      orderError.value = 'ไม่พบออเดอร์ที่ต้องการแก้ไข';
      return;
    }
    orderStatus.value = data.status ?? null;
    if (isPaidOrder.value) {
      router.replace('/');
      return;
    }
    initialImageSrc.value = data.original_image || null;
    initialCropInteraction.value = data.crop_interaction || null;
    orderMetadata.value = data.metadata ?? null;
    const apiStep3Base =
      (typeof data.preview_base === 'string' && data.preview_base) ||
      (typeof data.step3_base === 'string' && data.step3_base) ||
      null;
    initialStep3Base.value = apiStep3Base;
    const metaPriceRaw = data.metadata?.format_price?.amount ?? data.total_amount ?? null;
    const metaPrice = metaPriceRaw != null ? Number(metaPriceRaw) : null;
    initialFormatPrice.value = metaPrice != null && !Number.isNaN(metaPrice) ? metaPrice : null;
    formatPriceMeta.value = normalizeFormatPriceMeta(data.metadata?.format_price);
    initialStep2Preview.value = data.preview_url || null;
    step2PreviewForOrder.value = data.preview_url || null;
    initialStep3Preview.value = null;
    finalPreview.value = null;
    originalImageForOrder.value = data.original_image || null;
    cropInteractionForOrder.value = data.crop_interaction || null;
    saveMessage.value = null;
  } catch (error: any) {
    orderError.value = error?.message ?? 'ไม่สามารถโหลดออเดอร์สำหรับแก้ไขได้';
  } finally {
    orderLoading.value = false;
  }
};

watch(
  () => [orderId.value, user.value?.id],
  ([id, uid]) => {
    if (id && uid) {
      loadOrderForEdit();
    }
  },
  { immediate: true }
);

const handleSaveEdits = async (): Promise<boolean> => {
  saveMessage.value = null;
  if (!orderId.value) return false;
  if (!user.value) {
    requireAuth(() => handleSaveEdits());
    return false;
  }
  if (!finalPreview.value) {
    saveMessage.value = 'ยังไม่มีภาพตัวอย่าง กรุณาสร้าง Step 3 ให้เสร็จ';
    return false;
  }
  if (!step2PreviewForOrder.value) {
    saveMessage.value = 'ยังไม่มีภาพ Step 2 หลังแก้ไข กรุณาบันทึกอีกครั้ง';
    return false;
  }
  const normalizedAmount = formatPrice.value != null ? Number(formatPrice.value) : null;
  const priceAmount = normalizedAmount != null && !Number.isNaN(normalizedAmount) ? normalizedAmount : null;
  let instructionPdfMeta: Record<string, any> | null = null;
  let step3Meta: Record<string, any> | null = null;
  try {
    if (!remixAppRef.value?.generateInstructionPdfForOrder) {
      throw new Error('ไม่สามารถสร้างไฟล์ PDF ได้ (component ไม่พร้อม)');
    }
    const pdfResult = await remixAppRef.value.generateInstructionPdfForOrder(orderId.value);
    instructionPdfMeta = pdfResult?.pdfMeta ?? null;
    step3Meta = pdfResult?.step3Meta ?? null;
  } catch (error: any) {
    saveMessage.value = error?.message ?? 'ไม่สามารถสร้างหรืออัปโหลด PDF ได้';
    return false;
  }
  const mergedMetadata = mergeOrderMetadata(priceAmount, {
    instructionPdf: instructionPdfMeta,
    step3Meta
  });
  savingEdits.value = true;
  try {
    await updateOrderAssets(
      orderId.value,
      {
        previewUrl: step2PreviewForOrder.value,
        source: 'brick:edit',
        cropInteraction: cropInteractionForOrder.value ?? null,
        originalImage: originalImageForOrder.value ?? null,
        totalAmount: priceAmount ?? undefined,
        metadata: mergedMetadata
      },
      user.value.id
    );
    if (mergedMetadata) {
      orderMetadata.value = mergedMetadata;
    }
    saveMessage.value = 'บันทึกการแก้ไขเรียบร้อย';
    return true;
  } catch (error: any) {
    saveMessage.value = error?.message ?? 'บันทึกการแก้ไขไม่สำเร็จ';
    return false;
  } finally {
    savingEdits.value = false;
  }
};

const goToCheckout = async () => {
  if (!user.value) {
    requireAuth(() => goToCheckout());
    return;
  }
  if (orderId.value) {
    const saved = await handleSaveEdits();
    if (!saved) return;
  }
  await router.push(checkoutLink.value);
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

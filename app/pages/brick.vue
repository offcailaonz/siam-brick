<template>
  <div class="brick-bg--content">
    <div
      class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-6xl flex-col px-4 py-6 lg:py-10 space-y-4"
    >
      <div
        v-if="orderId"
        class="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3"
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
        <div class="flex flex-wrap gap-2 items-center">
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
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="savingEdits"
            @click="goToCheckout"
          >
            กลับไป Checkout
          </button>
        </div>
      </div>

      <BrickArtRemixApp
        :enable-persistence="true"
        :initial-crop-interaction="initialCropInteraction"
        :default-image-src="initialImageSrc"
        :editing-order-id="orderId"
        :initial-step3-preview="initialStep3Preview"
        :initial-step3-base="initialStep3Base"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { user, requireAuth } = useAuthFlow();
const { fetchOrderById, updateOrderAssets } = useOrders();

const orderId = computed(() => (route.query.id ? String(route.query.id) : null));
const orderLoading = ref(false);
const orderError = ref<string | null>(null);
const initialImageSrc = ref<string | null>(null);
const initialCropInteraction = ref<any | null>(null);
const initialStep3Preview = ref<string | null>(null);
const initialStep3Base = ref<string | null>(null);
const savingEdits = ref(false);
const saveMessage = ref<string | null>(null);
const lastLoadedKey = ref<string | null>(null);

const finalPreview = useState<string | null>('brick-final-step3-preview', () => null);
const originalImageForOrder = useState<string | null>('brick-original-image', () => null);
const cropInteractionForOrder = useState<Record<string, any> | null>('brick-crop-interaction', () => null);

const checkoutLink = computed(() => (orderId.value ? `/checkout?id=${orderId.value}` : '/checkout'));

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
  initialStep3Preview.value = null;
  initialStep3Base.value = null;
  try {
    const data = await fetchOrderById(orderId.value, user.value.id);
    if (!data) {
      orderError.value = 'ไม่พบออเดอร์ที่ต้องการแก้ไข';
      return;
    }
    initialImageSrc.value = data.original_image || null;
    initialCropInteraction.value = data.crop_interaction || null;
    const apiStep3Base =
      (typeof data.preview_base === 'string' && data.preview_base) ||
      (typeof data.step3_base === 'string' && data.step3_base) ||
      null;
    initialStep3Base.value = apiStep3Base;
    initialStep3Preview.value = data.preview_url || null;
    finalPreview.value = data.preview_url || null;
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
  savingEdits.value = true;
  try {
    await updateOrderAssets(
      orderId.value,
      {
        previewUrl: finalPreview.value,
        source: 'brick:edit',
        cropInteraction: cropInteractionForOrder.value ?? null,
        originalImage: originalImageForOrder.value ?? null
      },
      user.value.id
    );
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

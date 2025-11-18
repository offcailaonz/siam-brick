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
          </div>

          <aside class="space-y-4">
            <div
              class="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 shadow-inner h-full"
            >
              <p class="text-sm font-semibold text-amber-900">
                สินค้าที่จะได้รับ
              </p>
              <ul class="mt-3 space-y-2 text-sm text-amber-900/90">
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  จำนวนแผ่นฐาน/สัดส่วน studs จาก Step 3 + ชื่อสีที่ใช้
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  ต้องการสั่งชุดเต็ม หรือเฉพาะไฟล์ PDF
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  ช่องทางติดต่อที่สะดวก (อีเมล/LINE/โทร)
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  ที่อยู่จัดส่ง/จังหวัด (สำหรับคำนวณค่าขนส่ง)
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { openAuthModal, user, requireAuth } = useAuthFlow();
const { recordPendingPaymentOrder, fetchMyOrders, fetchOrderById, updateOrderAssets } = useOrders();
const workflowCookie = useCookie<Record<string, any> | null>('brick-workflow', { sameSite: 'lax', path: '/' });
const stepImagesCookie = useCookie<Record<string, any> | null>('brick-step-images', { sameSite: 'lax', path: '/' });
const step3HashCookie = useCookie<Record<string, any> | null>('brick-step3-hash', { sameSite: 'lax', path: '/' });
const selectedOrderId = computed(() => (route.query.id ? String(route.query.id) : null));
const hasLinkedOrder = computed(() => Boolean(selectedOrderId.value));
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
const linkedOrderPreview = computed(() => {
  if (!hasLinkedOrder.value) return null;
  const preview = selectedOrder.value?.preview_url || selectedOrder.value?.preview;
  if (typeof preview !== 'string') return null;
  const trimmed = preview.trim();
  return trimmed || null;
});
const checkoutPreview = computed(() => linkedOrderPreview.value ?? finalPreview.value ?? null);
const latestOrder = computed(() => (hasLinkedOrder.value ? selectedOrder.value : myOrders.value?.[0] ?? null));
const isPreviewLoading = computed(() => hasLinkedOrder.value && (selectedOrderLoading.value || (!selectedOrder.value && !selectedOrderError.value)));
const currentOrderId = computed(() => selectedOrderId.value ?? orderSuccess.value?.id ?? latestOrder.value?.id ?? null);
const brickLink = computed(() => (currentOrderId.value ? `/brick?id=${currentOrderId.value}` : '/brick'));

const clearLocalMosaicPersistence = () => {
  try {
    sessionStorage.removeItem('brick-step3-final-preview');
    localStorage.removeItem('brick-step3-final-preview');
    sessionStorage.removeItem('brick-step3-final-base');
    localStorage.removeItem('brick-step3-final-base');
    const storageKey = `brick-workflow-image-${user.value?.id ?? 'guest'}`;
    localStorage.removeItem(storageKey);
    localStorage.removeItem('brick-workflow-image-guest');
  } catch (error) {
    console.warn('ไม่สามารถล้างข้อมูล preview ใน storage ได้', error);
  }
  workflowCookie.value = null;
  stepImagesCookie.value = null;
  step3HashCookie.value = null;
};

const restorePreviewFromStorage = () => {
  try {
    if (finalPreview.value) return;
    const stored =
      sessionStorage.getItem('brick-step3-final-preview') ?? localStorage.getItem('brick-step3-final-preview');
    if (stored) {
      finalPreview.value = stored;
    }
  } catch (error) {
    console.warn('ไม่สามารถอ่านภาพจาก sessionStorage/localStorage ได้', error);
  }
};

onMounted(() => {
  // หากมี id ให้โหลดจาก API ทันที เพื่อใช้ข้อมูลจริง
  if (hasLinkedOrder.value) {
    finalPreview.value = null; // เคลียร์ค่าเดิมเพื่อรอข้อมูลจากฐาน
    if (user.value?.id) {
      loadSelectedOrder();
    }
  } else {
    // fallback for hard refresh: try sessionStorage (ไม่ใช้ cookie)
    restorePreviewFromStorage();
  }
});

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
      loadSelectedOrder();
    } else {
      myOrders.value = [];
      selectedOrder.value = null;
    }
  },
  { immediate: true }
);

watch(
  () => linkedOrderPreview.value,
  (next) => {
    if (!hasLinkedOrder.value) return;
    finalPreview.value = next ?? null;
  }
);

watch(
  () => selectedOrderId.value,
  (next) => {
    if (!next && !finalPreview.value) {
      restorePreviewFromStorage();
    }
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
  if (!checkoutPreview.value) {
    orderError.value = 'ยังไม่มีรูป Step 3 กรุณากลับไปสร้างก่อน';
    return;
  }
  isCreatingOrder.value = true;
  try {
    let data: any = null;
    if (hasLinkedOrder.value && selectedOrderId.value) {
      data = await updateOrderAssets(
        selectedOrderId.value,
        {
          previewUrl: checkoutPreview.value,
          source: 'checkout:linked',
          cropInteraction: cropInteractionForOrder.value ?? null,
          originalImage: originalImage.value ?? null
        },
        user.value.id
      );
      orderSuccess.value = { id: selectedOrderId.value };
    } else {
      data = await recordPendingPaymentOrder({
        userId: user.value.id,
        previewUrl: checkoutPreview.value,
        source: 'checkout',
        cropInteraction: cropInteractionForOrder.value ?? null,
        originalImage: originalImage.value ?? null
      });
      orderSuccess.value = { id: data?.id ?? 'new' };
    }
    await loadMyOrders();
    clearLocalMosaicPersistence();
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

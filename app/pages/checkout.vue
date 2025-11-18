<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-5xl flex-col px-4 py-10 lg:py-14 text-slate-800"
    >
      <section class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
        <div class="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Checkout
          </p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900">
            จ่ายเงินให้เสร็จใน 3 ขั้นตอน
          </h1>
          <p class="mt-2 text-sm text-slate-600">
            ตรวจรูป · เลือกแพ็กเกจ · ส่งข้อมูลให้ทีมงานเตรียมลิงก์จ่าย ได้ไฟล์/ชุดตัวต่อเร็วขึ้น
          </p>
        </div>

        <div class="grid gap-6 px-5 py-6 lg:grid-cols-[1.6fr,1fr]">
          <div class="space-y-4">
            <div v-if="finalPreview" class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">ตรวจสอบรูป</p>
                  <p class="text-sm text-slate-600">พรีวิว Step 3 ล่าสุด (รวมการแก้สีแล้ว)</p>
                </div>
                <span class="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">พร้อมสั่ง</span>
              </div>
              <div class="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img :src="finalPreview" alt="Final preview" class="w-full max-h-[420px] object-contain bg-white" />
              </div>
              <p class="mt-2 text-xs text-slate-500">
                ถ้าอยากแก้อีกครั้ง กดกลับไป Step 3 ก่อน แล้วค่อยกลับมาชำระเงิน
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  1
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-slate-900">
                    ตรวจสอบไฟล์จาก Step 3
                  </p>
                  <p class="text-sm text-slate-600">
                    ดูสีที่ใช้และตัวอย่าง PDF ให้จบก่อนสั่ง จะได้ไม่มีการแก้ทีหลัง
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  2
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-slate-900">
                    เลือกแพ็กเกจที่ต้องการ
                  </p>
                  <p class="text-sm text-slate-600">
                    • ชุดเต็ม: ฐาน + ตัวต่อครบตาม Bill of Materials<br>
                    • เฉพาะไฟล์: PDF คำสั่งประกอบความละเอียดสูง
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  3
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-slate-900">
                    ส่งข้อมูลเพื่อรับลิงก์ชำระเงิน
                  </p>
                  <p class="text-sm text-slate-600">
                    ทีมงานจะส่งลิงก์จ่าย/เลขบัญชี ตามช่องทางที่คุณสะดวก และแจ้งเวลาจัดส่งทันที
                  </p>
                </div>
              </div>
            </div>

            <div v-if="user" class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">ออเดอร์ของฉัน</p>
                  <p class="text-xs text-slate-500">5 รายการล่าสุด</p>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                  :disabled="myOrdersLoading"
                  @click="loadMyOrders"
                >
                  รีเฟรช
                </button>
              </div>
              <p v-if="myOrdersError" class="mt-2 text-xs text-rose-600">โหลดออเดอร์ไม่สำเร็จ: {{ myOrdersError }}</p>
              <div v-else class="mt-3 space-y-2">
                <div v-if="myOrdersLoading" class="text-sm text-slate-500">กำลังโหลด...</div>
                <div v-else-if="myOrders.length === 0" class="text-sm text-slate-500">ยังไม่มีออเดอร์</div>
                <div
                  v-else
                  v-for="order in myOrders"
                  :key="order.id"
                  class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-slate-900">#{{ order.id }}</p>
                    <p class="text-xs text-slate-500">
                      อัปเดต {{ formatDateTime(order.updated_at || order.created_at) }}
                    </p>
                  </div>
                  <span class="ml-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold" :class="statusBadge(order.status).color">
                    {{ statusBadge(order.status).text }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside class="space-y-4">
            <div class="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 shadow-inner">
              <p class="text-sm font-semibold text-amber-900">
                เตรียมข้อมูลนี้ให้ครบ จ่ายได้ไว
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
              <p class="mt-3 rounded-lg border border-amber-100 bg-white px-3 py-2 text-xs text-amber-800">
                ระบบจ่ายออนไลน์กำลังเชื่อมต่อ ระหว่างนี้แจ้งข้อมูลกับทีมงานเพื่อรับลิงก์จ่ายได้ทันที
              </p>
              <div class="mt-4 flex flex-wrap gap-3 items-center">
                <NuxtLink
                  to="/brick"
                  class="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-50"
                >
                  กลับไปแก้ไขภาพ
                </NuxtLink>
                <template v-if="user">
                  <div class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
                    <span class="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      {{ user.email?.charAt(0)?.toUpperCase() || 'U' }}
                    </span>
                    <span>เข้าสู่ระบบแล้ว · {{ user.email }}</span>
                  </div>
                </template>
                <button
                  v-else
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
                  @click="openAuthModal"
                >
                  เข้าสู่ระบบ/บันทึกงาน
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.146 11.354a.5.5 0 0 1 0-.708L8.793 8 6.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="rounded-xl border border-emerald-100 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">สร้างคำสั่งซื้อ</p>
                  <p class="text-xs text-slate-500">ล็อกออเดอร์ไว้ แล้วทีมจะส่งลิงก์จ่ายให้</p>
                </div>
                <span
                  v-if="orderSuccess"
                  class="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700"
                >
                  #{{ orderSuccess.id }}
                </span>
              </div>
              <div class="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="isCreatingOrder"
                  @click="handleCreateOrder"
                >
                  <span v-if="isCreatingOrder">กำลังสร้างออเดอร์…</span>
                  <span v-else>สร้างออเดอร์/ขอลิงก์จ่าย</span>
                </button>
                <NuxtLink
                  to="/brick"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  กลับไปแก้ภาพ
                </NuxtLink>
              </div>
              <p v-if="orderError" class="mt-2 text-xs text-rose-600">{{ orderError }}</p>
              <p v-else-if="orderSuccess" class="mt-2 text-xs text-emerald-600">
                บันทึกออเดอร์แล้ว ทีมงานจะติดต่อพร้อมลิงก์ชำระเงิน/เลขบัญชีตามช่องทางที่ระบุ
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { openAuthModal, user, requireAuth } = useAuthFlow();
const { recordPendingPaymentOrder, fetchMyOrders } = useOrders();
const finalPreview = useState<string | null>('brick-final-step3-preview', () => null);
const isCreatingOrder = ref(false);
const orderError = ref<string | null>(null);
const orderSuccess = ref<{ id: string | number } | null>(null);
const myOrders = ref<Array<Record<string, any>>>([]);
const myOrdersLoading = ref(false);
const myOrdersError = ref<string | null>(null);

onMounted(() => {
  // fallback for hard refresh: try sessionStorage (ไม่ใช้ cookie)
  try {
    if (!finalPreview.value) {
      const stored =
        sessionStorage.getItem('brick-step3-final-preview') ??
        localStorage.getItem('brick-step3-final-preview');
      if (stored) {
        finalPreview.value = stored;
      }
    }
  } catch (error) {
    console.warn('ไม่สามารถอ่านภาพจาก sessionStorage/localStorage ได้', error);
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

const statusBadge = (status: string | null | undefined) => {
  if (!status) return { text: 'รอชำระเงิน', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  const s = String(status).toLowerCase();
  if (s.includes('paid') || s.includes('สำเร็จ')) return { text: status, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (s.includes('ship')) return { text: status, color: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (s.includes('cancel')) return { text: status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  return { text: status, color: 'bg-amber-50 text-amber-700 border-amber-200' };
};

const loadMyOrders = async () => {
  if (!user.value?.id) return;
  myOrdersLoading.value = true;
  myOrdersError.value = null;
  try {
    myOrders.value = await fetchMyOrders(user.value.id, 5);
  } catch (error: any) {
    myOrdersError.value = error?.message ?? 'ไม่สามารถโหลดออเดอร์ของคุณได้';
  } finally {
    myOrdersLoading.value = false;
  }
};

watch(
  () => user.value?.id,
  (next) => {
    if (next) {
      loadMyOrders();
    } else {
      myOrders.value = [];
    }
  },
  { immediate: true }
);

const handleCreateOrder = async () => {
  orderError.value = null;
  if (!user.value) {
    requireAuth(() => handleCreateOrder());
    return;
  }
  if (!finalPreview.value) {
    orderError.value = 'ยังไม่มีรูป Step 3 กรุณากลับไปสร้างก่อน';
    return;
  }
  isCreatingOrder.value = true;
  try {
    const data = await recordPendingPaymentOrder({
      userId: user.value.id,
      previewUrl: finalPreview.value,
      source: 'checkout'
    });
    orderSuccess.value = { id: data?.id ?? 'new' };
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

<template>
  <div class="brick-bg--content">
    <main class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-5xl flex-col px-4 py-10 lg:py-14 text-slate-800">
      <section class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
        <header class="border-b border-slate-200 bg-slate-50/80 px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">บัญชีผู้ใช้</p>
            <h1 class="mt-1 text-2xl font-bold text-slate-900">โปรไฟล์และออเดอร์</h1>
            <p class="mt-2 text-sm text-slate-600">ดูข้อมูลบัญชี และติดตามสถานะออเดอร์ที่สั่งไว้</p>
          </div>
          <div v-if="user" class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
            <span class="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              {{ userInitial }}
            </span>
            <span>{{ user.email }}</span>
          </div>
        </header>

        <div class="grid gap-6 px-5 py-6 lg:grid-cols-[1.4fr,1fr]">
          <div class="space-y-4">
            <div class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">ข้อมูลบัญชี</p>
                  <p class="text-xs text-slate-500">อัปเดตล่าสุด {{ formatDateTime(user?.last_sign_in_at || user?.created_at) }}</p>
                </div>
                <button
                  v-if="!user"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
                  @click="openAuthModal"
                >
                  เข้าสู่ระบบ
                </button>
              </div>

              <div v-if="!user" class="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-slate-700">
                เข้าสู่ระบบเพื่อดูโปรไฟล์และออเดอร์ของคุณ
              </div>

              <div v-else class="mt-4 space-y-2 text-sm text-slate-700">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">อีเมล</span>
                  <span class="font-semibold text-slate-900">{{ user.email }}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">รหัสผู้ใช้</span>
                  <span class="font-mono text-xs text-slate-900">{{ user.id }}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">สร้างเมื่อ</span>
                  <span class="font-semibold text-slate-900">{{ formatDateTime(user.created_at) }}</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">เข้าสู่ระบบล่าสุด</span>
                  <span class="font-semibold text-slate-900">{{ formatDateTime(user.last_sign_in_at) }}</span>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">ออเดอร์ของฉัน</p>
                  <p class="text-xs text-slate-500">5 รายการล่าสุด</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    :disabled="myOrdersLoading || !user"
                    @click="handleRefreshOrders"
                  >
                    รีเฟรช
                  </button>
                </div>
              </div>

              <p v-if="myOrdersError" class="mt-2 text-xs text-rose-600">โหลดออเดอร์ไม่สำเร็จ: {{ myOrdersError }}</p>
              <div v-else class="mt-3 space-y-2">
                <div v-if="!user" class="text-sm text-slate-500">เข้าสู่ระบบเพื่อดูออเดอร์</div>
                <div v-else-if="myOrdersLoading" class="text-sm text-slate-500">กำลังโหลด...</div>
                <div v-else-if="myOrders.length === 0" class="text-sm text-slate-500">ยังไม่มีออเดอร์</div>
                <div
                  v-else
                  v-for="order in myOrders"
                  :key="order.id"
                  class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <p class="text-sm font-semibold text-slate-900">ออเดอร์ #{{ order.id }}</p>
                      <p class="text-xs text-slate-500">อัปเดต {{ formatDateTime(order.updated_at || order.created_at) }}</p>
                    </div>
                    <span
                      class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                      :class="statusBadge(order.status).color"
                    >
                      {{ statusBadge(order.status).text }}
                    </span>
                  </div>
                  <div class="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>ยอดรวม</span>
                    <span class="font-semibold text-slate-900">{{ formatCurrency(order.total_amount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="space-y-4">
            <div class="rounded-xl border border-indigo-100 bg-white px-4 py-4 shadow-sm">
              <p class="text-sm font-semibold text-slate-900">จัดการบัญชี</p>
              <p class="text-xs text-slate-500 mt-1">เข้าดูข้อมูลและอัปเดตได้ที่นี่</p>
              <div class="mt-3 space-y-2 text-sm text-slate-700">
                <p>• ดูสถานะออเดอร์ล่าสุด</p>
                <p>• ตรวจสอบอีเมลและเวลาล็อกอิน</p>
                <p>• ถ้าเจอปัญหาแจ้งทีมงานได้ทันที</p>
              </div>
              <div class="mt-4 flex flex-wrap gap-3">
                <NuxtLink
                  to="/checkout"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  กลับไป Checkout
                </NuxtLink>
                <button
                  v-if="user"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
                  :disabled="myOrdersLoading"
                  @click="handleRefreshOrders"
                >
                  รีเฟรชออเดอร์
                </button>
                <button
                  v-else
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
                  @click="openAuthModal"
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, openAuthModal, requireAuth } = useAuthFlow();
const { fetchMyOrders } = useOrders();

const myOrders = ref<Array<Record<string, any>>>([]);
const myOrdersLoading = ref(false);
const myOrdersError = ref<string | null>(null);

const userInitial = computed(() => user.value?.email?.charAt(0)?.toUpperCase() || 'U');

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

const formatCurrency = (value: number | string | null | undefined) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(num);
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

const handleRefreshOrders = async () => {
  if (!user.value) {
    requireAuth(() => loadMyOrders());
    return;
  }
  await loadMyOrders();
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

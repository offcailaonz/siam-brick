<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-5xl flex-col px-4 py-10 lg:py-14 text-slate-800"
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
              บัญชีผู้ใช้
            </p>
            <h1 class="mt-1 text-2xl font-bold text-slate-900">
              โปรไฟล์และออเดอร์
            </h1>
            <p class="mt-2 text-sm text-slate-600">
              ดูข้อมูลบัญชี และติดตามสถานะออเดอร์ที่สั่งไว้
            </p>
          </div>
          <div
            v-if="user"
            class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm"
          >
            <span
              class="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center"
            >
              {{ userInitial }}
            </span>
            <span>{{ user.email }}</span>
          </div>
        </header>

        <div class="grid gap-6 px-5 py-6">
          <div class="space-y-4">
            <div
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">
                    ข้อมูลบัญชี
                  </p>
                  <p class="text-xs text-slate-500">
                    อัปเดตล่าสุด
                    {{ formatDateTime(user?.last_sign_in_at || user?.created_at) }}
                  </p>
                </div>
                <button
                  v-if="user"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-sm text-sm font-semibold text-white shadow hover:bg-indigo-700"
                  @click="openPasswordModal"
                >
                  แก้ไขรหัสผ่าน
                </button>
              </div>

              <div
                v-if="!user"
                class="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-slate-700"
              >
                เข้าสู่ระบบเพื่อดูโปรไฟล์และออเดอร์ของคุณ
              </div>

              <div v-else class="mt-4 space-y-2 text-sm text-slate-700">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">อีเมล</span>
                  <span
                    class="font-semibold text-slate-900"
                    >{{ user.email }}</span
                  >
                </div>
                <!-- <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">รหัสผู้ใช้</span>
                  <span
                    class="font-mono text-xs text-slate-900"
                    >{{ user.id }}</span
                  >
                </div> -->
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">สร้างเมื่อ</span>
                  <span
                    class="font-semibold text-slate-900"
                    >{{ formatDateTime(user.created_at) }}</span
                  >
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500">เข้าสู่ระบบล่าสุด</span>
                  <span
                    class="font-semibold text-slate-900"
                    >{{ formatDateTime(user.last_sign_in_at) }}</span
                  >
                </div>
              </div>
            </div>

            <div
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">
                    ที่อยู่จัดส่ง
                  </p>
                  <p class="text-xs text-slate-500">
                    เพิ่ม/เลือกที่อยู่ให้ดึงไปใช้ตอน checkout ได้ทันที
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    :disabled="addressesLoading"
                    @click="loadAddresses"
                  >
                    รีเฟรช
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
                    :disabled="addressSaving"
                    @click="openAddressForm"
                  >
                    เพิ่มที่อยู่ใหม่
                  </button>
                </div>
              </div>

              <div
                v-if="!user"
                class="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-slate-700"
              >
                เข้าสู่ระบบเพื่อจัดการที่อยู่จัดส่ง
              </div>

              <div v-else class="mt-4 space-y-3" v-auto-animate>
                <div class="space-y-2" v-auto-animate>
                  <p v-if="addressesError" class="text-xs text-rose-600">
                    {{ addressesError }}
                  </p>
                  <div v-else class="space-y-2" v-auto-animate>
                    <div v-if="addressesLoading" class="text-sm text-slate-500">
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
                      class="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                          <span
                            class="text-sm font-semibold text-slate-900"
                            >{{ address.label || 'ที่อยู่' }}</span
                          >
                          <span
                            v-if="address.is_default"
                            class="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-100"
                          >
                            ค่าเริ่มต้น
                          </span>
                        </div>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                            :disabled="address.is_default || addressDefaulting[address.id]"
                            @click="markDefault(address.id)"
                          >
                            ตั้งเป็นหลัก
                          </button>
                          <button
                            type="button"
                            class="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                            :disabled="addressDeleting[address.id]"
                            @click="removeAddress(address.id)"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                      <div class="mt-1 text-xs text-slate-600 space-y-1">
                        <p class="font-semibold text-slate-800">
                          {{ address.recipient_name }}
                          <span
                            class="text-slate-500"
                            >{{ address.phone }}</span
                          >
                        </p>
                        <p>{{ address.address_line }}</p>
                        <p>
                          {{ address.subdistrict }} {{ address.district }}
                          {{ address.province }} {{ address.postcode }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div class="flex items-center justify-between gap-2">
                <div>
                  <p class="text-sm font-semibold text-slate-900">
                    ออเดอร์ของฉัน
                  </p>
                  <p class="text-xs text-slate-500">5 รายการล่าสุด</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    :disabled="myOrdersLoading || !user"
                    @click="handleRefreshOrders"
                  >
                    รีเฟรช
                  </button>
                </div>
              </div>

              <p v-if="myOrdersError" class="mt-2 text-xs text-rose-600">
                โหลดออเดอร์ไม่สำเร็จ: {{ myOrdersError }}
              </p>
              <div v-else class="mt-3 space-y-2" v-auto-animate>
                <div v-if="!user" class="text-sm text-slate-500">
                  เข้าสู่ระบบเพื่อดูออเดอร์
                </div>
                <div v-else-if="myOrdersLoading" class="text-sm text-slate-500">
                  กำลังโหลด...
                </div>
                <div
                  v-else-if="myOrders.length === 0"
                  class="text-sm text-slate-500"
                >
                  ยังไม่มีออเดอร์
                </div>
                <div
                  v-else
                  v-for="order in myOrders"
                  :key="order.id"
                  class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <div class="flex items-start gap-3">
                    <div
                      v-if="orderPreview(order)"
                      class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white"
                    >
                      <img
                        :src="orderPreview(order)"
                        alt="order preview"
                        class="h-full w-full object-contain"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-slate-900">
                        ออเดอร์ #{{ order.id }}
                      </p>
                      <p class="text-xs text-slate-500">
                        อัปเดต
                        {{ formatDateTime(order.updated_at || order.created_at) }}
                      </p>
                      <div class="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold"
                          :class="statusBadge(order).color"
                        >
                          {{ statusBadge(order).text }}
                        </span>
                        <span
                          v-if="isReadyKitOrder(order)"
                          class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 border border-amber-100"
                        >
                          Ready Kit
                        </span>
                        <span
                          v-if="order.is_locked_for_edits"
                          class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200"
                        >
                          ล็อกแก้ไข
                        </span>
                      </div>
                    </div>
                    <div class="text-end text-xl text-slate-600">
                      <span
                        class="font-semibold text-slate-900"
                        >{{ formatCurrency(order.total_amount) }}</span
                      >
                      <div
                        v-if="isPending(order)"
                        class="mt-3 flex flex-wrap items-center gap-2"
                      >
                        <template v-if="paymentLink(order)">
                          <a
                            :href="paymentLink(order)"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                          >
                            ไปชำระเงิน
                          </a>
                          <p class="text-xs text-slate-500">
                            เปิดลิงก์จ่ายในหน้าต่างใหม่
                          </p>
                        </template>
                        <template v-else>
                          <div
                            class="flex flex-wrap items-center gap-2 items-center"
                          >
                            <NuxtLink
                              v-if="canEditOrder(order)"
                              :to="`/brick?id=${order.id}`"
                              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                            >
                              แก้ไขรูปภาพ
                            </NuxtLink>
                            <NuxtLink
                              :to="`/checkout?id=${order.id}`"
                              class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                            >
                              ชำระเงิน
                            </NuxtLink>
                          </div>
                        </template>
                      </div>
                      <div
                        v-else-if="isPaid(order)"
                        class="mt-3 flex flex-wrap items-start gap-2 text-sm"
                      >
                        <NuxtLink
                          :to="`/checkout?id=${order.id}`"
                          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                          ดูรายละเอียด
                        </NuxtLink>
                        <button
                          type="button"
                          class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                          :disabled="isPdfLoading(order.id) || !findInstructionPdf(order)"
                          @click="downloadOrderPdfFor(order)"
                        >
                          <span v-if="isPdfLoading(order.id)">กำลังดาวน์โหลด…</span>
                          <span v-else-if="!findInstructionPdf(order)">ไม่มีไฟล์คู่มือ</span>
                          <span v-else>ดาวน์โหลด PDF</span>
                        </button>
                        <p v-if="orderPdfError" class="w-full text-[11px] text-rose-600">{{ orderPdfError }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="myOrdersTotal > myOrdersPageSize"
                  class="flex items-center justify-between pt-2 text-xs text-slate-600"
                >
                  <span
                    >หน้า {{ myOrdersPage }} / {{ myOrdersTotalPages }}</span
                  >
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 disabled:opacity-50"
                      :disabled="myOrdersLoading || myOrdersPage === 1"
                      @click="goPage('prev')"
                    >
                      ก่อนหน้า
                    </button>
                    <button
                      type="button"
                      class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 disabled:opacity-50"
                      :disabled="myOrdersLoading || myOrdersPage === myOrdersTotalPages"
                      @click="goPage('next')"
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <ChangePasswordModal
      :open="showPasswordModal"
      :model="passwordForm"
      :saving="passwordSaving"
      :error="passwordError || null"
      :success="passwordSuccess || null"
      @close="closePasswordModal"
      @submit="handleChangePassword"
      @reset="resetPasswordForm"
    />
    <BaseModal
      :open="showAddressForm"
      title="เพิ่มที่อยู่ใหม่"
      @close="closeAddressForm"
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
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '#imports';
import AddressForm from '~/components/address/AddressForm.vue';
import ChangePasswordModal from '~/components/profile/ChangePasswordModal.vue';
import BaseModal from '~/components/ui/BaseModal.vue';
import { useThaiAddressSearch } from '~/composables/useThaiAddressSearch';

const { user, openAuthModal, requireAuth } = useAuthFlow();
const { fetchMyOrders } = useOrders();
const { fetchAddresses, createAddress, deleteAddress, setDefaultAddress } = useAddresses();
const { loadAddressData } = useThaiAddressSearch();
const supabase = useSupabaseClient();

const myOrders = ref<Array<Record<string, any>>>([]);
const myOrdersLoading = ref(false);
const myOrdersError = ref<string | null>(null);
const myOrdersTotal = ref(0);
const myOrdersPage = ref(1);
const myOrdersPageSize = 5;
const myOrdersTotalPages = computed(() => Math.max(1, Math.ceil(myOrdersTotal.value / myOrdersPageSize)));
const orderPdfLoading = ref<Record<string, boolean>>({});
const orderPdfError = ref<string | null>(null);
const addresses = ref<Array<Record<string, any>>>([]);
const addressesLoading = ref(false);
const addressesError = ref<string | null>(null);
const addressSaving = ref(false);
const addressFormError = ref<string | null>(null);
const addressSavedMessage = ref<string | null>(null);
const addressDefaulting = ref<Record<number, boolean>>({});
const addressDeleting = ref<Record<number, boolean>>({});
const addressForm = reactive({
  recipient_name: '',
  phone: '',
  address_line: '',
  province: '',
  district: '',
  subdistrict: '',
  postcode: '',
  is_default: false
});
const showAddressForm = ref(false);

const passwordForm = reactive({
  current: '',
  next: '',
  confirm: ''
});
const passwordSaving = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');
const showPasswordModal = ref(false);

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

const statusBadge = (statusOrOrder: string | null | undefined | Record<string, any>) => {
  const raw = resolveStatusString(statusOrOrder);
  if (!raw) return { text: 'รอชำระเงิน', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (isPending(statusOrOrder)) return { text: raw, color: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (isPaid(statusOrOrder)) return { text: raw, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  const s = raw.toLowerCase();
  if (s.includes('ship')) return { text: raw, color: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (s.includes('cancel')) return { text: raw, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  return { text: raw, color: 'bg-amber-50 text-amber-700 border-amber-200' };
};

const formatCurrency = (value: number | string | null | undefined) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(num);
};

const isReadyKitOrder = (order: Record<string, any>) => {
  if (!order) return false;
  const source = typeof order.source === 'string' ? order.source.toLowerCase() : '';
  const meta = order.metadata ?? {};
  return source.includes('product') || Boolean(meta.product_id || meta.product_slug || meta.product_name);
};

const canEditOrder = (order: Record<string, any>) => {
  if (!order) return false;
  if (order.is_locked_for_edits) return false;
  return !isReadyKitOrder(order);
};

const orderPreview = (order: Record<string, any>) => {
  const candidates = [
    order?.preview_url,
    order?.preview,
    order?.metadata?.image,
    order?.metadata?.product_image,
    order?.metadata?.product_preview,
    order?.original_image
  ];
  const found = candidates.find((p) => typeof p === 'string' && p.trim());
  return found ? String(found).trim() : null;
};

const orderStudPreview = (order: Record<string, any>) => {
  const meta = order?.metadata ?? {};
  const candidates = [
    meta.stud_preview,
    meta.step3_preview,
    meta.instruction_preview,
    meta.product_image,
    order?.preview_url,
    order?.preview
  ];
  const found = candidates.find((p) => typeof p === 'string' && p.trim());
  return found ? String(found).trim() : orderPreview(order);
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

const isPaid = (status: string | null | undefined | Record<string, any>) => {
  const s = normalizeStatus(status);
  if (!s || isPending(s)) return false;
  return paidTokens.some((token) => s.includes(token));
};

const paymentLink = (order: Record<string, any>) => {
  const ref = order?.payment_ref || order?.payment_link;
  if (typeof ref !== 'string') return null;
  const trimmed = ref.trim();
  if (!trimmed) return null;
  const looksLikeUrl = /^https?:\/\//i.test(trimmed);
  return looksLikeUrl ? trimmed : null;
};

const shippingSnapshot = (order: Record<string, any>) => {
  if (!order) return null;
  const meta = order.metadata;
  if (meta && typeof meta === 'object' && meta.shipping_snapshot) {
    const snap = meta.shipping_snapshot;
    if (snap && typeof snap === 'object') return snap;
  }
  return null;
};

const findInstructionPdf = (order: Record<string, any> | null | undefined) => {
  const meta = order?.metadata ?? {};
  const link =
    meta.instruction_pdf ||
    meta.instruction_pdf_url ||
    meta.instructionPdf ||
    meta.pdf_url ||
    meta.guide_pdf ||
    meta.guide_url ||
    null;
  if (typeof link === 'string' && link.trim()) return link.trim();
  return null;
};

const isPdfLoading = (orderId: string | number | null | undefined) => {
  if (orderId == null) return false;
  return Boolean(orderPdfLoading.value[String(orderId)]);
};

const downloadOrderPdfFor = async (order: Record<string, any> | null | undefined) => {
  if (!order?.id) return;
  const key = String(order.id);
  orderPdfLoading.value[key] = true;
  orderPdfError.value = null;
  try {
    const url = findInstructionPdf(order);
    if (!url) {
      throw new Error('ไม่มีไฟล์คู่มือจาก Step 3 ในออเดอร์นี้');
    }
    window.open(url, '_blank', 'noopener');
  } catch (error: any) {
    orderPdfError.value = error?.message ?? 'ดาวน์โหลด PDF ไม่สำเร็จ';
  } finally {
    orderPdfLoading.value[key] = false;
    orderPdfLoading.value = { ...orderPdfLoading.value };
  }
};

const resetPasswordForm = (clearMessages = true) => {
  passwordForm.current = '';
  passwordForm.next = '';
  passwordForm.confirm = '';
  if (clearMessages) {
    passwordError.value = '';
    passwordSuccess.value = '';
  }
};

const handleChangePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  if (!user.value?.email) {
    requireAuth(() => handleChangePassword());
    return;
  }
  if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
    passwordError.value = 'กรุณากรอกรหัสผ่านให้ครบ';
    return;
  }
  if (passwordForm.next.length < 6) {
    passwordError.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    return;
  }
  if (passwordForm.next !== passwordForm.confirm) {
    passwordError.value = 'รหัสผ่านใหม่ไม่ตรงกัน';
    return;
  }

  passwordSaving.value = true;
  try {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.value.email,
      password: passwordForm.current
    });
    if (verifyError) {
      passwordError.value = verifyError.message || 'รหัสผ่านเดิมไม่ถูกต้อง';
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: passwordForm.next });
    if (error) {
      passwordError.value = error.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ';
      return;
    }

    resetPasswordForm(false);
    passwordSuccess.value = 'เปลี่ยนรหัสผ่านสำเร็จ';
  } catch (error: any) {
    passwordError.value = error?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ';
  } finally {
    passwordSaving.value = false;
  }
  if (passwordSuccess.value) {
    showPasswordModal.value = false;
  }
};

const openPasswordModal = () => {
  if (!user.value) {
    openAuthModal();
    return;
  }
  resetPasswordForm();
  showPasswordModal.value = true;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
};

const resetAddressForm = () => {
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

const openAddressForm = () => {
  resetAddressForm();
  showAddressForm.value = true;
};

const closeAddressForm = () => {
  resetAddressForm();
  showAddressForm.value = false;
};

const loadAddresses = async () => {
  if (!user.value?.id) return;
  addressesLoading.value = true;
  addressesError.value = null;
  try {
    const data = await fetchAddresses(user.value.id);
    addresses.value = data ?? [];
    if ((addresses.value?.length ?? 0) === 0) {
      showAddressForm.value = true;
    }
  } catch (error: any) {
    addressesError.value = error?.message ?? 'ไม่สามารถโหลดที่อยู่ได้';
    addresses.value = [];
  } finally {
    addressesLoading.value = false;
  }
};

const saveAddress = async () => {
  addressFormError.value = null;
  addressSavedMessage.value = null;
  if (!user.value?.id) {
    requireAuth(() => saveAddress());
    return;
  }
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
    addressSavedMessage.value = 'บันทึกที่อยู่เรียบร้อย';
    resetAddressForm();
    showAddressForm.value = false;
  } catch (error: any) {
    addressFormError.value = error?.message ?? 'บันทึกที่อยู่ไม่สำเร็จ';
  } finally {
    addressSaving.value = false;
    setTimeout(() => {
      addressSavedMessage.value = null;
    }, 2200);
  }
};

const markDefault = async (addressId: number) => {
  if (!user.value?.id) return;
  addressDefaulting.value[addressId] = true;
  try {
    await setDefaultAddress(addressId, user.value.id);
    await loadAddresses();
  } catch (error) {
    // ignore, error already surfaced via supabase toast if any
  } finally {
    addressDefaulting.value[addressId] = false;
  }
};

const removeAddress = async (addressId: number) => {
  if (!user.value?.id) return;
  addressDeleting.value[addressId] = true;
  try {
    await deleteAddress(addressId, user.value.id);
    await loadAddresses();
  } catch (error: any) {
    addressesError.value = error?.message ?? 'ลบที่อยู่ไม่สำเร็จ';
  } finally {
    addressDeleting.value[addressId] = false;
  }
};

const loadMyOrders = async () => {
  if (!user.value?.id) return;
  myOrdersLoading.value = true;
  myOrdersError.value = null;
  try {
    const result = await fetchMyOrders(user.value.id, { page: myOrdersPage.value, pageSize: myOrdersPageSize });
    myOrders.value = result.items;
    myOrdersTotal.value = result.total;
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

const goPage = async (direction: 'prev' | 'next') => {
  if (direction === 'prev' && myOrdersPage.value > 1) {
    myOrdersPage.value -= 1;
    await loadMyOrders();
  }
  if (direction === 'next' && myOrdersPage.value < myOrdersTotalPages.value) {
    myOrdersPage.value += 1;
    await loadMyOrders();
  }
};

watch(
  () => user.value?.id,
  (next) => {
    if (next) {
      loadAddressData();
      loadMyOrders();
      loadAddresses();
    } else {
      myOrders.value = [];
      addresses.value = [];
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

<template>
  <section
    class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
  >
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">ออเดอร์ล่าสุด</p>
        <p class="text-xs text-slate-500">
          แสดง 20 รายการล่าสุด เรียงจากใหม่ไปเก่า
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        :disabled="loading"
        @click="$emit('refresh')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 1 0-.908-.417A6 6 0 1 0 8 2v1z"
          />
          <path
            d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.967A.25.25 0 0 0 8 4.466z"
          />
        </svg>
        รีเฟรช
      </button>
    </div>
    <p v-if="error" class="mt-2 text-xs text-rose-600">
      ไม่สามารถโหลดออเดอร์: {{ error }}
    </p>
    <div v-else class="mt-3 overflow-x-auto" v-auto-animate>
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-slate-500">
            <th class="px-2 py-2">ออเดอร์</th>
            <th class="px-2 py-2">ลูกค้า</th>
            <th class="px-2 py-2">สถานะ</th>
            <th class="px-2 py-2">ยอด</th>
            <th class="px-2 py-2">อัปเดต</th>
            <th class="px-2 py-2">รายละเอียด</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="px-2 py-3 text-center text-slate-500">
              กำลังโหลด...
            </td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="6" class="px-2 py-3 text-center text-slate-500">
              ยังไม่มีออเดอร์
            </td>
          </tr>
          <tr
            v-else
            v-for="order in orders"
            :key="order.id"
            class="border-t border-slate-100 hover:bg-slate-50"
          >
            <td class="px-2 py-2 font-semibold text-slate-900">
              <div class="flex items-center gap-3">
                <div
                  class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white"
                  v-if="orderPreview(order)"
                >
                  <img
                    :src="orderPreview(order)"
                    alt="preview"
                    class="h-full w-full object-contain"
                  />
                </div>
                <div class="flex flex-col">
                  <span>#{{ order.id }}</span>
                  <span
                    v-if="orderPreview(order)"
                    class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 w-fit"
                  >
                    preview
                  </span>
                </div>
              </div>
            </td>
            <td class="px-2 py-2 text-slate-700">
              {{ order.customer_email || order.user_id || '-' }}
            </td>
            <td class="px-2 py-2 text-slate-700">
              <div class="flex flex-col gap-2">
                <div class="inline-flex items-center gap-2">
                  <select
                    class="w-full rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    :value="order.status"
                    @change="$emit('update-draft', order.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option
                      v-for="option in statusOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="isUpdatingStatus[String(order.id)]"
                    @click="$emit('save-status', order.id, statusDrafts[String(order.id)] ?? order.status ?? 'รอชำระเงิน')"
                  >
                    <span v-if="isUpdatingStatus[String(order.id)]"
                      >บันทึก…</span
                    >
                    <span v-else>บันทึก</span>
                  </button>
                </div>
                <p
                  v-if="statusUpdateErrors[String(order.id)]"
                  class="text-[11px] text-rose-600"
                >
                  {{ statusUpdateErrors[String(order.id)] }}
                </p>
              </div>
            </td>
            <td class="px-2 py-2 text-slate-700">
              {{ formatCurrency(order.total_amount) }}
            </td>
            <td class="px-2 py-2 text-slate-500 text-xs">
              {{ formatDate(order.updated_at || order.created_at) }}
            </td>
            <td class="px-2 py-2 text-slate-700">
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                @click="$emit('view-details', order)"
              >
                ดูรายละเอียด
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  orders: Array<Record<string, any>>;
  loading: boolean;
  error: string | null;
  statusOptions: string[];
  statusDrafts: Record<string, string>;
  isUpdatingStatus: Record<string, boolean>;
  statusUpdateErrors: Record<string, string | null>;
  formatCurrency: (v: number | string | null | undefined) => string;
  formatDate: (v: string | null | undefined) => string;
}>();

defineEmits<{
  (e: 'refresh'): void;
  (e: 'update-draft', orderId: string | number, value: string): void;
  (e: 'save-status', orderId: string | number, value: string): void;
  (e: 'view-details', order: Record<string, any>): void;
}>();

const orderPreview = (order: Record<string, any>) => {
  const candidates = [
    order?.preview_url,
    order?.preview,
    order?.metadata?.image,
    order?.metadata?.product_image,
    order?.metadata?.product_preview
  ];
  const found = candidates.find((p) => typeof p === 'string' && p.trim());
  return found ? String(found).trim() : null;
};
</script>

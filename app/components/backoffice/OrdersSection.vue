<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">ออเดอร์ล่าสุด</p>
        <p class="text-xs text-slate-500">รายการออเดอร์จากฐานข้อมูล</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        :disabled="loading"
        @click="$emit('refresh')"
      >
        รีเฟรช
      </button>
    </div>

    <DataTable
      :columns="columns"
      :rows="orders"
      :loading="loading"
      :error="error"
      :page="page ?? 1"
      :page-size="pageSize ?? 20"
      :total="total ?? orders.length"
      :sort="sort"
      :show-sort="true"
      row-key="id"
      @change-page="$emit('change-page', $event)"
      @change-sort="$emit('change-sort', $event)"
    >
      <template #filter-bar>
        <div class="flex flex-wrap items-center gap-2 px-1 pb-2">
          <ColorSelect
            :options="[{ label: 'ทั้งหมด', value: null, colorClass: 'bg-slate-100 text-slate-700 border-slate-200' }, ...statusOptionItems]"
            :model-value="statusFilter ?? null"
            placeholder="ทั้งหมด"
            @update:modelValue="$emit('change-status-filter', $event)"
          />
        </div>
      </template>

      <template #cell-preview="{ row }">
        <div class="flex items-center gap-3">
          <div
            v-if="orderPreview(row)"
            class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <img :src="orderPreview(row)" alt="preview" class="h-full w-full object-contain" />
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-slate-900">#{{ row.id }}</span>
            <span
              v-if="orderPreview(row)"
              class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 w-fit"
            >
              preview
            </span>
          </div>
        </div>
      </template>

      <template #cell-customer="{ row }">
        <span class="text-slate-700">{{ row.customer_email || row.user_id || '-' }}</span>
      </template>

      <template #cell-status="{ row }">
        <div class="flex flex-col gap-2">
          <div class="inline-flex items-center gap-2">
            <ColorSelect
              class="w-full"
              :options="statusOptionItems"
              :model-value="row.status"
              placeholder="เลือกสถานะ"
              @update:modelValue="$emit('update-draft', row.id, $event)"
            />
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="isUpdatingStatus[String(row.id)]"
              @click="$emit('save-status', row.id, statusDrafts[String(row.id)] ?? row.status ?? 'รอชำระเงิน')"
            >
              <span v-if="isUpdatingStatus[String(row.id)]">บันทึก…</span>
              <span v-else>บันทึก</span>
            </button>
          </div>
          <p v-if="statusUpdateErrors[String(row.id)]" class="text-[11px] text-rose-600">
            {{ statusUpdateErrors[String(row.id)] }}
          </p>
        </div>
      </template>

      <template #cell-total_amount="{ row }">
        {{ formatCurrency(row.total_amount) }}
      </template>

      <template #cell-updated_at="{ row }">
        <span class="text-xs text-slate-500">
          {{ formatDate(row.updated_at || row.created_at) }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          @click="$emit('view-details', row)"
        >
          ดูรายละเอียด
        </button>
      </template>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataTable from '~/components/backoffice/DataTable.vue';
import ColorSelect from '~/components/backoffice/ColorSelect.vue';

const props = defineProps<{
  orders: Array<Record<string, any>>;
  loading: boolean;
  error: string | null;
  statusOptions: string[];
  statusDrafts: Record<string, string>;
  isUpdatingStatus: Record<string, boolean>;
  statusUpdateErrors: Record<string, string | null>;
  formatCurrency: (v: number | string | null | undefined) => string;
  formatDate: (v: string | null | undefined) => string;
  page?: number;
  pageSize?: number;
  total?: number;
  sort: { field: string; direction: 'asc' | 'desc' };
  statusFilter?: string | null;
}>();

defineEmits<{
  (e: 'refresh'): void;
  (e: 'update-draft', orderId: string | number, value: string): void;
  (e: 'save-status', orderId: string | number, value: string): void;
  (e: 'view-details', order: Record<string, any>): void;
  (e: 'change-page', page: number): void;
  (e: 'change-sort', payload: { field: string; direction: 'asc' | 'desc' }): void;
  (e: 'change-status-filter', status: string | null): void;
}>();

const columns = [
  { key: 'preview', label: 'ออเดอร์', sortable: false },
  { key: 'customer', label: 'ลูกค้า', sortable: false },
  { key: 'status', label: 'สถานะ', sortable: false },
  { key: 'total_amount', label: 'ยอด', sortable: true },
  { key: 'updated_at', label: 'อัปเดต', sortable: true },
  { key: 'actions', label: 'รายละเอียด', sortable: false }
];

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

const statusClass = (status: string | null | undefined) => {
  const s = (status ?? '').toLowerCase().trim();
  if (s.includes('ยกเลิก') || s.includes('cancel')) {
    return 'border-red-200 bg-red-50 text-red-700';
  }
  if (s.includes('จัดส่ง') || s.includes('ship')) {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }
  if (s.includes('สำเร็จ') || s.includes('complete') || s.includes('completed')) {
    return 'border-blue-200 bg-blue-50 text-blue-700';
  }
  if (
    s.includes('ชำระเงินแล้ว') ||
    s.includes('ชำระแล้ว') ||
    s.includes('paid') ||
    s.includes('success')
  ) {
    return 'border-green-200 bg-green-50 text-green-700';
  }
  return 'border-slate-200 bg-slate-100 text-slate-600';
};

const statusOptionItems = computed(() =>
  (props.statusOptions ?? []).map((status) => ({
    label: status,
    value: status,
    colorClass: statusClass(status)
  }))
);
</script>

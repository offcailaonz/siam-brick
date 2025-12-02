<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div v-if="error" class="border-b border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {{ error }}
    </div>
    <div class="overflow-x-auto">
      <div v-if="$slots['filter-bar']" class="px-3 pt-2">
        <slot name="filter-bar" />
      </div>
      <table class="min-w-full text-sm text-slate-700">
        <thead>
          <tr class="bg-slate-50 text-left text-slate-500">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-3 py-2 font-semibold"
              :class="{
                'cursor-pointer select-none': col.sortable,
                'text-center w-[64px]': col.key === 'select'
              }"
              @click="col.sortable ? toggleSort(col.key) : undefined"
            >
              <div class="inline-flex items-center gap-1">
                <slot :name="`head-${col.key}`" :col="col">
                  <span>{{ col.label }}</span>
                </slot>
                <svg
                  v-if="col.sortable"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="text-slate-400"
                >
                  <path
                    :class="[
                      'transition-colors',
                      sort.field === col.key && sort.direction === 'asc' ? 'text-emerald-600' : 'text-slate-300'
                    ]"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4l-4 5h8l-4-5Z"
                  />
                  <path
                    :class="[
                      'transition-colors',
                      sort.field === col.key && sort.direction === 'desc' ? 'text-amber-600' : 'text-slate-300'
                    ]"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 20l4-5H8l4 5Z"
                  />
                </svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-3 py-4 text-center text-slate-500">กำลังโหลด...</td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :colspan="columns.length" class="px-3 py-4 text-center text-slate-500">ไม่มีข้อมูล</td>
          </tr>
          <tr
            v-else
            v-for="row in rows"
            :key="String(row[rowKey] ?? JSON.stringify(row))"
            :class="['border-t border-slate-100 hover:bg-slate-50', rowClassValue(row)]"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-3 py-2 align-top"
              :class="{
                'text-center align-middle w-[64px]': col.key === 'select'
              }"
            >
              <slot :name="`cell-${col.key}`" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600"
    >
      <div>
        แสดง
        <span class="font-semibold text-slate-800">
          {{ rows.length ? startRow : 0 }}-{{ rows.length ? endRow : 0 }}
        </span>
        จาก
        <span class="font-semibold text-slate-800">{{ total }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page <= 1 || loading"
          @click="changePage(page - 1)"
        >
          ก่อนหน้า
        </button>
        <span class="text-slate-700">หน้า {{ page }} / {{ totalPages }}</span>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page >= totalPages || loading"
          @click="changePage(page + 1)"
        >
          ถัดไป
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Column = { key: string; label: string; sortable?: boolean };

const props = defineProps<{
  columns: Column[];
  rows: Array<Record<string, any>>;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  sort: { field: string; direction: 'asc' | 'desc' };
  rowKey?: string;
  rowClass?: (row: Record<string, any>) => string | undefined | null;
}>();

const emit = defineEmits<{
  (e: 'change-page', page: number): void;
  (e: 'change-sort', payload: { field: string; direction: 'asc' | 'desc' }): void;
}>();

const rowKey = computed(() => props.rowKey ?? 'id');
const totalPages = computed(() => Math.max(1, Math.ceil((props.total || 0) / props.pageSize)));
const startRow = computed(() => (props.page - 1) * props.pageSize + 1);
const endRow = computed(() => Math.min(props.page * props.pageSize, props.total));
const rowClassValue = (row: Record<string, any>) => (props.rowClass ? props.rowClass(row) || '' : '');

const changePage = (page: number) => {
  const target = Math.min(Math.max(1, page), totalPages.value);
  emit('change-page', target);
};

const toggleSort = (field: string) => {
  const isSameField = props.sort.field === field;
  const currentDirection = isSameField ? props.sort.direction : null;
  const nextDirection = currentDirection === 'asc' ? 'desc' : currentDirection === 'desc' ? null : 'asc';
  emit('change-sort', { field, direction: nextDirection ?? 'asc', reset: nextDirection === null });
};
</script>

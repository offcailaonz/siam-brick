<template>
  <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm space-y-3">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">ผู้ใช้ในระบบ</p>
        <p class="text-xs text-slate-500">จัดการ role และลบผู้ใช้ (เฉพาะแอดมิน)</p>
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
      :rows="roleRows"
      :loading="loading"
      :error="error"
      :page="page ?? 1"
      :page-size="pageSize ?? (roleRows.length || 20)"
      :total="total ?? roleRows.length"
      :sort="currentSort"
      row-key="user_id"
      @change-page="$emit('change-page', $event)"
      @change-sort="$emit('change-sort', $event)"
    >
      <template #cell-email="{ row }">
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-slate-900">{{ row.email || row.user_id }}</span>
          <span class="text-[11px] text-slate-500">{{ row.user_id }}</span>
        </div>
      </template>
      <template #cell-role="{ row }">
        <select
          class="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :value="row.role"
          @change="$emit('update-role', row.user_id, ($event.target as HTMLSelectElement).value)"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </template>
      <template #cell-created_at="{ row }">
        <span class="text-xs text-slate-500">{{ formatDate(row.created_at) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] font-semibold text-rose-700 shadow-sm hover:bg-rose-50 disabled:opacity-60"
          @click="$emit('delete', row.user_id)"
        >
          ลบ
        </button>
      </template>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataTable from '~/components/backoffice/DataTable.vue';

const props = defineProps<{
  roles: Array<{ user_id: string; email?: string | null; role: string; created_at?: string | null }>;
  loading: boolean;
  error: string | null;
  page?: number;
  pageSize?: number;
  total?: number;
  sort?: { field: string; direction: 'asc' | 'desc' };
}>();

defineEmits<{
  (e: 'refresh'): void;
  (e: 'update-role', userId: string, role: string): void;
  (e: 'delete', userId: string): void;
  (e: 'change-page', page: number): void;
  (e: 'change-sort', payload: { field: string; direction: 'asc' | 'desc' }): void;
}>();

const columns = [
  { key: 'email', label: 'อีเมล/ผู้ใช้', sortable: false },
  { key: 'role', label: 'Role', sortable: false },
  { key: 'created_at', label: 'สร้างเมื่อ', sortable: false },
  { key: 'actions', label: 'จัดการ', sortable: false }
];

const currentSort = computed(() => props.sort ?? { field: 'created_at', direction: 'desc' });

const roleRows = computed(() =>
  (props.roles ?? []).map((r) => ({
    ...r
  }))
);

const formatDate = (value: string | null | undefined) => {
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
</script>

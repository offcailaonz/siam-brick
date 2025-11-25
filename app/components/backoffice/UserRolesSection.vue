<template>
  <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
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

    <p v-if="error" class="mt-2 text-xs text-rose-600">ไม่สามารถโหลดผู้ใช้: {{ error }}</p>

    <div v-else class="mt-3 space-y-2 max-h-[420px] overflow-auto pr-1" v-auto-animate>
      <div v-if="loading" class="text-sm text-slate-500 px-1">กำลังโหลด...</div>
      <div v-else-if="roles.length === 0" class="text-sm text-slate-500 px-1">ยังไม่มีผู้ใช้</div>
      <div
        v-else
        v-for="user in roles"
        :key="user.user_id"
        class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
      >
        <div class="flex items-center justify-between gap-2">
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ user.email || user.user_id }}</p>
            <p class="text-xs text-slate-500">{{ user.user_id }}</p>
          </div>
          <div class="flex items-center gap-2">
            <select
              class="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              :value="user.role"
              @change="$emit('update-role', user.user_id, ($event.target as HTMLSelectElement).value)"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] font-semibold text-rose-700 shadow-sm hover:bg-rose-50 disabled:opacity-60"
              @click="$emit('delete', user.user_id)"
            >
              ลบ
            </button>
          </div>
        </div>
        <p class="mt-1 text-[11px] text-slate-500">สร้างเมื่อ {{ formatDate(user.created_at) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  roles: Array<{ user_id: string; email?: string | null; role: string; created_at?: string | null }>;
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'refresh'): void;
  (e: 'update-role', userId: string, role: string): void;
  (e: 'delete', userId: string): void;
}>();

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

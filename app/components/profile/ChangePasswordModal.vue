<template>
  <BaseModal :open="open" title="เปลี่ยนรหัสผ่าน" @close="$emit('close')">
    <form class="space-y-3" @submit.prevent="$emit('submit')">
      <div class="grid gap-3 md:grid-cols-2">
        <div class="space-y-1">
          <label
            class="text-xs font-semibold text-slate-600"
            for="current-password-modal"
            >รหัสผ่านเดิม</label
          >
          <input
            id="current-password-modal"
            v-model="model.current"
            type="password"
            required
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div class="space-y-1">
          <label
            class="text-xs font-semibold text-slate-600"
            for="new-password-modal"
            >รหัสผ่านใหม่</label
          >
          <input
            id="new-password-modal"
            v-model="model.next"
            type="password"
            minlength="6"
            required
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
        </div>
        <div class="space-y-1 md:col-span-2">
          <label
            class="text-xs font-semibold text-slate-600"
            for="confirm-password-modal"
            >ยืนยันรหัสผ่านใหม่</label
          >
          <input
            id="confirm-password-modal"
            v-model="model.confirm"
            type="password"
            minlength="6"
            required
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
      <p v-else-if="success" class="text-xs text-emerald-600">{{ success }}</p>

      <div class="flex flex-wrap items-center gap-2 justify-between">
        <button
          type="button"
          class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          :disabled="saving"
          @click="$emit('reset')"
        >
          เคลียร์
        </button>
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
          :disabled="saving"
        >
          {{ saving ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '~/components/ui/BaseModal.vue';

defineProps<{
  open: boolean;
  model: { current: string; next: string; confirm: string };
  saving: boolean;
  error: string | null;
  success: string | null;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'submit'): void;
  (e: 'reset'): void;
}>();
</script>

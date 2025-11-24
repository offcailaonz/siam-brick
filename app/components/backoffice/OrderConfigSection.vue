<template>
  <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-900">Order config</p>
        <p class="text-xs text-slate-500">
          ปรับราคาเริ่มต้นและระยะเวลาจองรายการที่หน้า checkout
        </p>
      </div>
      <span class="text-[11px] font-semibold text-slate-500">
        เก็บข้อมูล {{ holdMinutes }} นาที
      </span>
    </div>
    <form class="mt-4 space-y-3" @submit.prevent="$emit('save')">
      <div>
        <label class="text-[11px] font-semibold text-slate-500" for="config-price">ราคาเริ่มต้น (THB)</label>
        <input
          id="config-price"
          type="number"
          min="0"
          class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :value="price"
          @input="$emit('update:price', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
      <div>
        <label class="text-[11px] font-semibold text-slate-500" for="config-hold">เวลาเก็บออเดอร์ (นาที)</label>
        <input
          id="config-hold"
          type="number"
          min="1"
          class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :value="holdMinutes"
          @input="$emit('update:holdMinutes', Number(($event.target as HTMLInputElement).value))"
        />
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="saving"
        >
          <span v-if="saving">กำลังบันทึก…</span>
          <span v-else>บันทึก config</span>
        </button>
        <p v-if="savedMessage" class="text-xs text-emerald-600">
          {{ savedMessage }}
        </p>
        <p v-else class="text-xs text-slate-500">
          อัปเดตล่าสุด {{ lastUpdatedAt ? formatDate(lastUpdatedAt) : '-' }}
        </p>
      </div>
      <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  price: number;
  holdMinutes: number;
  lastUpdatedAt: string | null;
  saving: boolean;
  savedMessage: string | null;
  error: string | null;
  formatDate: (value: string | null | undefined) => string;
}>();

defineEmits<{
  (e: 'update:price', value: number): void;
  (e: 'update:holdMinutes', value: number): void;
  (e: 'save'): void;
}>();
</script>

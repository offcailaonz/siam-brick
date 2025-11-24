<template>
  <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">สต็อกวัสดุ</p>
        <p class="text-xs text-slate-500">ดูยอดคงเหลือและรายการที่ใกล้หมด</p>
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
    <p v-if="error" class="mt-2 text-xs text-rose-600">โหลดสต็อกไม่สำเร็จ: {{ error }}</p>
    <div v-else class="mt-3 space-y-2 max-h-[340px] overflow-auto pr-1">
      <div v-if="loading" class="text-sm text-slate-500 px-1">กำลังโหลด...</div>
      <div v-else-if="items.length === 0" class="text-sm text-slate-500 px-1">ยังไม่มีสต็อก</div>
      <div
        v-else
        v-for="item in items"
        :key="item.id || item.sku"
        class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
      >
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-slate-900">{{ item.name || item.sku }}</span>
          <span class="text-xs text-slate-500">{{ item.part_num || item.sku || 'ไม่ระบุรหัส' }}</span>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold text-slate-900">
            {{ item.on_hand ?? 0 }} ชิ้น
          </p>
          <p class="text-[11px]" :class="item.on_hand <= (item.reorder_point ?? 0) ? 'text-amber-600' : 'text-slate-500'">
            จุดสั่งซื้อ {{ item.reorder_point ?? 0 }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<Record<string, any>>;
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'refresh'): void;
}>();
</script>

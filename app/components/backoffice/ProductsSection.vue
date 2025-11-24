<template>
  <section class="rounded-xl border border-indigo-100 bg-white px-4 py-4 shadow-sm">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">สินค้า/คอนเทนต์</p>
        <p class="text-xs text-slate-500">รายการสินค้าที่แสดงบนหน้าเว็บ</p>
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
    <p v-if="error" class="mt-2 text-xs text-rose-600">โหลดสินค้าไม่สำเร็จ: {{ error }}</p>
    <div v-else class="mt-3 space-y-2 max-h-[420px] overflow-auto pr-1">
      <div v-if="loading" class="text-sm text-slate-500 px-1">กำลังโหลด...</div>
      <div v-else-if="products.length === 0" class="text-sm text-slate-500 px-1">ยังไม่มีสินค้า</div>
      <div
        v-else
        v-for="product in products"
        :key="product.id"
        class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
      >
        <div class="flex items-center justify-between gap-2">
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ product.name }}</p>
            <p class="text-xs text-slate-500">{{ product.slug || product.type || 'สินค้า' }}</p>
          </div>
          <span
            class="badge"
            :class="product.active === false ? 'badge-grey' : 'badge-green'"
          >
            {{ product.active === false ? 'ปิด' : 'ขายอยู่' }}
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          ราคา {{ product.price != null ? formatCurrency(product.price) : '—' }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  products: Array<Record<string, any>>;
  loading: boolean;
  error: string | null;
  formatCurrency: (v: number | string | null | undefined) => string;
}>();

defineEmits<{
  (e: 'refresh'): void;
}>();
</script>

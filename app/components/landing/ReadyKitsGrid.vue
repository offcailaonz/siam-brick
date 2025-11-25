<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div class="mb-8 flex flex-col gap-3 text-center">
      <h2 class="text-3xl font-bold text-white">
        ลายพร้อมสร้างที่จัดชุดให้ครบ
      </h2>
    </div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" v-auto-animate>
      <template v-if="loading">
        <article v-for="n in 6" :key="n" class="rounded-2xl border border-white bg-white p-5 shadow-sm">
          <div class="h-40 w-full rounded-xl bg-slate-200 animate-pulse" />
          <div class="mt-4 space-y-2">
            <div class="h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
            <div class="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
            <div class="h-3 w-1/3 rounded bg-slate-100 animate-pulse" />
          </div>
          <div class="mt-4 flex gap-3">
            <div class="h-9 flex-1 rounded-full bg-slate-200 animate-pulse" />
            <div class="h-9 flex-1 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </article>
      </template>
      <template v-else>
        <article
          v-for="kit in paginatedKits"
          :key="kit.id || kit.slug || kit.name"
          class="rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <img
            :src="kit.image"
            :alt="kit.name"
            class="h-50 w-full rounded-xl object-cover"
            loading="lazy"
          />
          <div class="mt-4 space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900">{{ kit.name }}</h3>
              <span class="text-xs font-semibold uppercase text-amber-600">{{ kit.tag }}</span>
            </div>
            <p class="text-sm text-slate-500">
              {{ kit.size }} · {{ kit.studs }} studs · ระดับ {{ kit.difficulty }}
            </p>
            <div class="flex items-center gap-3 text-sm">
              <span class="font-semibold text-slate-900">฿{{ kit.priceKit }}</span>
              <span class="text-xs text-slate-500">ชุดคำสั่ง ฿{{ kit.priceInstructions }}</span>
            </div>
          </div>
          <div class="mt-4 flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              @click="handleOrder(kit)"
            >
              สั่งชุดเต็ม
            </button>
            <button
              type="button"
              class="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900"
              @click="handleDownload(kit)"
            >
              ดาวน์โหลดคำสั่ง
            </button>
          </div>
        </article>
      </template>
    </div>
    <div v-if="!loading && totalPages > 1" class="mt-8 flex items-center justify-center gap-4 text-sm font-semibold">
      <button
        type="button"
        class="rounded-full bg-yellow-400 hover:bg-yellow-500 border border-slate-300 px-4 py-2 text-slate-600 disabled:opacity-40"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        ก่อนหน้า
      </button>
      <span class="text-white">หน้า {{ currentPage }} / {{ totalPages }}</span>
      <button
        type="button"
        class="rounded-full bg-yellow-400 hover:bg-yellow-500 border border-slate-300 px-4 py-2 text-slate-600 disabled:opacity-40"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        ถัดไป
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, withDefaults } from 'vue';

type KitItem = {
  id?: string | number;
  slug?: string;
  name: string;
  tag: string;
  size: string;
  studs: number;
  difficulty: string;
  priceKit: string | number;
  priceInstructions: string | number;
  image: string;
};

const props = withDefaults(
  defineProps<{
    kits: Array<KitItem>;
    pageSize?: number;
    loading?: boolean;
  }>(),
  {
    pageSize: 3,
    loading: false
  }
);

const emit = defineEmits<{
  (e: 'order', kit: KitItem): void;
  (e: 'download', kit: KitItem): void;
}>();

const currentPage = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(props.kits.length / props.pageSize)));
const paginatedKits = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return props.kits.slice(start, start + props.pageSize);
});

const handleOrder = (kit: KitItem) => {
  emit('order', kit);
};

const handleDownload = (kit: KitItem) => {
  emit('download', kit);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1;
};

watch(
  () => props.kits.length,
  () => {
    currentPage.value = 1;
  }
);
</script>

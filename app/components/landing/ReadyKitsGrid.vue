<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div class="mb-8 flex flex-col gap-3 text-center">
      <h2 class="text-3xl font-bold text-white">
        ลายพร้อมสร้างที่จัดชุดให้ครบ
      </h2>
    </div>
    <div class="grid gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4" v-auto-animate>
      <template v-if="loading">
        <article
          v-for="n in 6"
          :key="n"
          class="rounded-2xl border border-white bg-white p-5 shadow-sm"
        >
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
          class="rounded-3xl bg-white shadow-xl border border-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <div class="h-full flex flex-col">
            <div class="relative overflow-hidden rounded-t-3xl bg-slate-100">
              <button type="button" class="group block w-full cursor-pointer" @click="openPreview(kit)">
                <div class="aspect-square overflow-hidden">
                  <img
                    :src="kit.image"
                    :alt="kit.name"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <span class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/15 transition"></span>
              </button>
              <span
                class="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase text-white shadow"
              >
                {{ kit.tag || 'พร้อมสร้าง' }}
              </span>
            </div>

            <div class="flex-1 space-y-3 rounded-b-3xl border-t border-slate-100 bg-white px-4 pb-4 pt-3">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-lg font-bold text-slate-900 leading-tight">
                  {{ kit.name }}
                </h3>
                <span
                  class="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-100"
                >
                  ฿{{ kit.priceKit }}
                </span>
              </div>
              <p class="text-xs text-slate-500">
                {{ kit.size }} · {{ kit.studs }} studs · ระดับ {{ kit.difficulty }}
              </p>
              <div class="mt-3 flex gap-3">
                <button
                  type="button"
                  class="flex-1 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
                  @click="handleOrder(kit)"
                >
                  สั่งชุดเต็ม
                </button>
                <!-- <button
                  type="button"
                  class="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-50 transition"
                  @click="handleDownload(kit)"
                >
                  ดาวน์โหลดคำสั่ง
                </button> -->
              </div>
            </div>
          </div>
        </article>
      </template>
    </div>
    <div
      v-if="!loading && totalPages > 1"
      class="mt-8 flex items-center justify-center gap-4 text-sm font-semibold"
    >
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
  <BaseModal
    :open="!!previewKit"
    :title="previewKit?.name"
    max-width-class="max-w-4xl"
    @close="closePreview"
  >
    <div class="space-y-2">
      <p class="text-xs text-slate-500">
        {{ previewKit?.size }} · {{ previewKit?.studs }} studs · ระดับ
        {{ previewKit?.difficulty }}
      </p>
      <div
        class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      >
        <img
          v-if="previewKit"
          :src="previewKit.image"
          :alt="previewKit.name"
          class="w-full max-h-[70vh] object-contain"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch, withDefaults } from 'vue';
import BaseModal from '~/components/ui/BaseModal.vue';

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
    pageSize: 4,
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

const previewKit = ref<KitItem | null>(null);
const openPreview = (kit: KitItem) => {
  previewKit.value = kit;
};
const closePreview = () => {
  previewKit.value = null;
};

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

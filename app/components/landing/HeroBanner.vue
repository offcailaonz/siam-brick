<template>
  <section
    class="bg-cover bg-center"
    :style="{
      backgroundImage: `linear-gradient(rgb(0 0 0 / 15%), rgb(0 0 0 / 59%)), url(${data.heroImage})`
    }"
  >
    <div
      class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center"
    >
      <div class="flex-1 space-y-6">
        <p
          class="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200"
        >
          Siam Brick
        </p>
        <h1 class="text-4xl font-bold leading-snug drop-shadow text-white">
          {{ data.headline }}
        </h1>
        <p class="text-lg text-emerald-50 ">
          {{ data.subtext }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/brick"
            class="rounded-full bg-white/90 px-6 py-3 text-base  font-semibold text-emerald-900 shadow hover:bg-white"
          >
            สร้างตัวต่อรูปภาพของคุณ
          </NuxtLink>
          <button
            type="button"
            class="rounded-full border border-white/60 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
          >
            ดูแกลเลอรีลายยอดนิยม
          </button>
        </div>
        <div class="flex flex-wrap gap-6 text-sm text-white/80">
          <div v-for="metric in data.metrics" :key="metric.label">
            <p class="text-2xl font-bold text-white">{{ metric.value }}</p>
            <p>{{ metric.label }}</p>
          </div>
        </div>
      </div>
      <div
        class="flex-1 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-10 text-center shadow-2xl"
      >
        <div
          class="rounded-[2rem] border border-white/60 bg-white/70 p-2 text-slate-600 shadow-inner"
        >
          <img
            :src="data.previewImage"
            alt="Hero preview"
            class="h-full w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    headline: string;
    subtext: string;
    metrics: Array<{ label: string; value: string }>;
    heroImage: string;
    previewImage: string;
  };
}>();
</script>

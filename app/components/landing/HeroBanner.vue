<template>
  <section class="bg-cover bg-center brick-background">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center"
    >
      <div class="flex-1 space-y-6">
        <!-- <p
          class="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200"
        >
          Siam Brick
        </p> -->
        <h1
          class="font-jersey text-5xl leading-snug drop-shadow text-white text-outline-black"
        >
          {{ data.headline }}
        </h1>
        <p class="text-lg text-emerald-50 ">
          {{ data.subtext }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/brick"
            class="rounded-full bg-yellow-400 hover:bg-yellow-500 px-6 py-3 text-3xl  font-semibold text-white shadow hover:bg-yellow-500 text-outline-black"
          >
            สร้างเลย !!
          </NuxtLink>
          <button
            type="button"
            class="rounded-full border border-yellow-400 px-6 py-3 text-3xl font-semibold text-white hover:bg-white/10 text-outline-black"
            @click="$emit('view-gallery')"
          >
            แกลเลอรียอดฮิต
          </button>
        </div>
        <div class="flex flex-wrap gap-6 text-sm text-white/80">
          <div v-for="metric in data.metrics" :key="metric.label">
            <p class="text-2xl font-bold text-white">{{ metric.value }}</p>
            <p>{{ metric.label }}</p>
          </div>
        </div>
      </div>
      <div class="flex-1 text-center shadow-2xl">
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
defineEmits(['view-gallery']);

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

<style>
.text-outline-black {
    text-shadow:
      -2px -2px 0 #000,
       2px -2px 0 #000,
      -2px  2px 0 #000,
       2px  2px 0 #000;
  }
</style>

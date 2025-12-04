<template>
  <section class="bg-cover bg-center brick-background">
    <div
      class="mx-auto flex max-w-6xl flex-col-reverse gap-8 px-6 py-16 lg:flex-row lg:items-center"
    >
      <div class="flex-1 text-center lg:text-left">
        <!-- <p
          class="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200"
        >
          Siam Brick
        </p> -->
        <h1
          class="font-jersey text-4xl sm:text-5xl leading-tight sm:leading-snug drop-shadow text-white text-outline-black"
        >
          เปลี่ยนรูปของคุณ
        </h1>
        <h1
          class="font-jersey text-4xl sm:text-5xl leading-tight sm:leading-snug drop-shadow text-white text-outline-black mt-0"
        >
          ให้พิเศษไม่เหมือนใคร
        </h1>

        <p class="hidden sm:block text-lg text-emerald-50 mt-6">
          {{ data.subtext }}
        </p>
        <div class="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
          <NuxtLink
            to="/brick"
            class="rounded-full w-[48%] sm:w-[40%] text-center bg-yellow-400 hover:bg-yellow-500 px-4 py-2.5 sm:px-6 sm:py-3 text-xl sm:text-3xl font-semibold text-white shadow hover:bg-yellow-500 text-outline-black"
          >
            สร้างเลย
          </NuxtLink>
          <button
            type="button"
            class="rounded-full w-[48%] sm:w-[40%] border border-yellow-400 px-4 py-2.5 sm:px-6 sm:py-3 text-xl sm:text-3xl font-semibold text-white hover:bg-white/10 text-outline-black"
            @click="$emit('view-gallery')"
          >
            แกลลอรี่
          </button>
        </div>
        <!-- <div class="flex flex-wrap gap-6 text-sm text-white/80" v-auto-animate>
          <div v-for="metric in data.metrics" :key="metric.label">
            <p class="text-2xl font-bold text-white">{{ metric.value }}</p>
            <p>{{ metric.label }}</p>
          </div>
        </div> -->
      </div>
      <div class="flex-1 text-center shadow-2xl">
        <div
          class="rounded-[2rem] border border-yellow bg-yellow p-2 text-slate-600 shadow-inner"
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

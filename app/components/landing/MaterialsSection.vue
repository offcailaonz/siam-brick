<template>
  <section>
    <div class="mx-auto max-w-6xl px-6">
      <div class="mb-8 text-center">
        <h2 class="text-white text-3xl font-bold">มาตรฐานวัสดุและการจัดส่ง</h2>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="material in materials"
          :key="material.title"
          class="rounded-2xl border border-slate-200 bg-slate-900/90 p-6 text-white"
        >
          <h3 class="text-xl font-semibold">{{ material.title }}</h3>
          <p class="mt-2 text-sm text-white/80">{{ material.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  materials: Array<{ title: string; description: string }>;
}>();
</script>

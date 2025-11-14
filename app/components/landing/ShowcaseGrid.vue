<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div class="mb-8 flex flex-col gap-3 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Showcase</p>
      <h2 class="text-3xl font-bold">ลูกค้ากว่า 12,000 โปรเจกต์ไว้ใจเรา</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="item in showcase"
        :key="item.name"
        class="rounded-2xl border border-white bg-white p-5 shadow-sm"
      >
        <img
          :src="item.image"
          :alt="item.name"
          class="h-40 w-full rounded-xl object-cover"
        />
        <h3 class="mt-4 text-lg font-semibold text-slate-900">{{ item.name }}</h3>
        <p class="text-sm text-slate-500">{{ item.story }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  showcase: Array<{ name: string; story: string; image: string }>;
}>();
</script>

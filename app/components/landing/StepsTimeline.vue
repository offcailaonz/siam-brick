<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div class="mb-8 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Flow การใช้งาน</p>
      <h2 class="text-3xl font-bold">ทุกอย่างเกิดขึ้นใน 3 ขั้นตอน</h2>
    </div>
    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="(step, index) in steps"
        :key="step.title"
        class="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
      >
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-lg font-bold text-pink-600">
          {{ index + 1 }}
        </span>
        <h3 class="mt-4 text-xl font-semibold text-slate-900">{{ step.title }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ step.description }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
    steps: Array<{ title: string; description: string }>;
}>();
</script>

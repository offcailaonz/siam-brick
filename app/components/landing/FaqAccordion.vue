<template>
  <section class="py-16">
    <div class="mx-auto max-w-4xl px-6">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold">คำถามที่พบบ่อย</h2>
      </div>
      <div class="space-y-4">
        <details
          v-for="faq in faqs"
          :key="faq.question"
          class="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
        >
          <summary class="cursor-pointer text-lg font-semibold text-slate-900">
            {{ faq.question }}
          </summary>
          <p class="mt-2 text-sm text-slate-600">{{ faq.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  faqs: Array<{ question: string; answer: string }>;
}>();
</script>

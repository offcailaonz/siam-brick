<template>
  <section class="mx-auto max-w-6xl px-6 py-16">
    <div class="mb-8 flex flex-col gap-3 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Ready-to-build</p>
      <h2 class="text-3xl font-bold">ลายพร้อมสร้างที่จัดชุดให้ครบ</h2>
      <p class="text-slate-600">เลือกแบบที่ชอบแล้วกดสั่งได้ทันที ทั้งชุดเต็มหรือเฉพาะคำสั่ง</p>
    </div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="kit in kits"
        :key="kit.name"
        class="rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <img
          :src="kit.image"
          :alt="kit.name"
          class="h-40 w-full rounded-xl object-cover"
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
            <span class="text-slate-400">หรือ ฿{{ kit.priceInstructions }} / คำสั่ง</span>
          </div>
        </div>
        <div class="mt-4 flex gap-3">
          <button
            type="button"
            class="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            สั่งชุดเต็ม
          </button>
          <button
            type="button"
            class="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            ดาวน์โหลดคำสั่ง
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  kits: Array<{
    name: string;
    tag: string;
    size: string;
    studs: number;
    difficulty: string;
    priceKit: string;
    priceInstructions: string;
    image: string;
  }>;
}>();
</script>

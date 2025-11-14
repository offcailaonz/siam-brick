<template>
  <section class="bg-white py-16">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
      <article class="rounded-3xl border border-slate-200 bg-slate-900/90 p-8 text-white shadow-lg">
        <p class="text-sm uppercase tracking-[0.3em] text-pink-200">สร้างของคุณเอง</p>
        <h3 class="mt-2 text-2xl font-semibold">อัปโหลดรูป แล้วเราแนะนำทุกชิ้นส่วนให้</h3>
        <p class="mt-3 text-sm text-white/80">
          ระบบจะคำนวณจำนวน studs, plate, baseplate และค่าใช้จ่ายโดยประมาณ พร้อมดาวน์โหลด PDF ตัวอย่าง
        </p>
        <NuxtLink
          to="/brick"
          class="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900"
        >
          เริ่มสร้างตอนนี้
        </NuxtLink>
      </article>
      <article class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <p class="text-sm uppercase tracking-[0.3em] text-slate-500">เลือกจากแกลเลอรี</p>
        <h3 class="mt-2 text-2xl font-semibold text-slate-900">ลาย curated พร้อมส่ง</h3>
        <p class="mt-3 text-sm text-slate-600">
          เราคัดลายยอดนิยม พร้อมจัดชุดอุปกรณ์ให้เรียบร้อย เลือกขนาดและงบประมาณที่ต้องการได้เลย
        </p>
        <button
          type="button"
          class="mt-6 inline-flex items-center justify-center rounded-full border border-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-900"
        >
          ดูแคตตาล็อกทั้งหมด
        </button>
      </article>
    </div>
  </section>
</template>

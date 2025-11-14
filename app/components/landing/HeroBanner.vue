<template>
  <section class="bg-pink-100/90">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center">
      <div class="flex-1 space-y-6">
        <p class="text-xs font-semibold uppercase tracking-[0.4em] text-pink-600">Siam Brick</p>
        <h1 class="text-4xl font-bold leading-snug text-slate-900">
          สร้างตัวต่อรูปภาพของคุณได้ภายในไม่กี่นาที
        </h1>
        <p class="text-lg text-slate-700">
          อัปโหลดรูป ระบบ Brick Art Remix จะสร้างโมเสกและรายการอุปกรณ์ให้อัตโนมัติ ทดลองดาวน์โหลด PDF
          ตัวอย่างฟรีก่อนปลดล็อกชุดเต็ม
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/brick"
            class="rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow hover:bg-slate-800"
          >
            สร้างตัวต่อรูปภาพของคุณ
          </NuxtLink>
          <button
            type="button"
            class="rounded-full border border-slate-900/40 px-6 py-3 text-base font-semibold text-slate-900 hover:bg-white/40"
          >
            ดูแกลเลอรีลายยอดนิยม
          </button>
        </div>
        <div class="flex flex-wrap gap-6 text-sm text-slate-700">
          <div>
            <p class="text-2xl font-bold text-slate-900">12k+</p>
            <p>ไฟล์โมเสกที่สร้างสำเร็จ</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">4.9/5</p>
            <p>คะแนนรีวิวยืนยัน</p>
          </div>
        </div>
      </div>
      <div class="flex-1 rounded-3xl border border-dashed border-white/60 bg-white/60 p-10 text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-pink-500">Preview</p>
        <div class="mt-6 space-y-3 text-slate-600">
          <div class="h-48 rounded-2xl bg-gradient-to-br from-pink-200 via-white to-pink-100"></div>
          <p>พื้นที่ภาพตัวอย่าง — ใส่ banner จริงภายหลัง</p>
        </div>
      </div>
    </div>
  </section>
</template>

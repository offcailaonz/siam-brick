<template>
  <section class="bg-slate-900 py-16 text-white">
    <div class="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center">
      <div class="flex-1 space-y-4">
        <p class="text-sm uppercase tracking-[0.3em] text-amber-400">Coming Soon</p>
        <h2 class="text-3xl font-bold">แปลงภาพเป็นโมเดล 3 มิติ</h2>
        <p class="text-sm text-white/80">
          เรากำลังพัฒนาเครื่องมือที่แปลงภาพถ่ายให้กลายเป็นโมเดล brick 3 มิติ พร้อมจำหน่ายชุดอุปกรณ์ครบเซต
          กดติดตามเพื่อเป็นคนแรกที่ได้ทดลองใช้
        </p>
        <div class="flex flex-wrap gap-3">
          <input
            type="email"
            placeholder="อีเมลของคุณ"
            class="flex-1 rounded-full border border-white/40 bg-transparent px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none"
          />
          <button
            type="button"
            class="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900"
          >
            แจ้งเตือนฉัน
          </button>
        </div>
      </div>
      <div
        class="flex-1 rounded-3xl border border-white/30 bg-gradient-to-tr from-amber-400 via-pink-400 to-emerald-400 p-6 text-center text-slate-900"
      >
        <p class="text-xs uppercase tracking-[0.3em]">Mock visual</p>
        <div class="mt-4 h-64 rounded-2xl bg-white/60"></div>
        <p class="mt-3 text-sm">
          พื้นที่สำหรับภาพตัวอย่าง (คนขี่ไดโนเสาร์ → โมเดล brick) จะใส่ให้เมื่อมีไฟล์จริง
        </p>
      </div>
    </div>
  </section>
</template>

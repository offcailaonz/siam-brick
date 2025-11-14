<template>
  <section class="brick-background py-16 text-white">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center"
    >
      <div class="flex-1 space-y-4">
        <p class="text-sm uppercase tracking-[0.3em] text-amber-400">
          Coming Soon
        </p>
        <h2 class="text-3xl font-bold">แปลงภาพเป็นโมเดล 3 มิติ</h2>
        <p class="text-sm text-white/80">
          เรากำลังพัฒนาเครื่องมือที่แปลงภาพถ่ายให้กลายเป็นโมเดล brick 3 มิติ
          พร้อมจำหน่ายชุดอุปกรณ์ครบเซต กดติดตามเพื่อเป็นคนแรกที่ได้ทดลองใช้
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
      <div class="h-64 rounded-2xl bg-white/60 p-3">
        <div class="flex h-full gap-3">
          <!-- รูปต้นฉบับ -->
          <figure
            class="flex-1 overflow-hidden rounded-xl border border-slate-200/70 bg-white/80"
          >
            <img
              :src="`/mockup-api-data/images/3d/before.png`"
              alt="ภาพต้นฉบับ"
              class="h-full w-full object-cover"
            />
            <figcaption class="px-2 py-1 text-xs font-medium text-slate-700">
              ภาพต้นฉบับ
            </figcaption>
          </figure>

          <!-- รูปโมเดล brick 3 มิติ -->
          <figure
            class="flex-1 overflow-hidden rounded-xl border border-slate-200/70 bg-white/80"
          >
            <img
              :src="`/mockup-api-data/images/3d/after.png`"
              alt="ภาพโมเดล brick 3 มิติ"
              class="h-full w-full object-cover"
            />
            <figcaption class="px-2 py-1 text-xs font-medium text-slate-700">
              โมเดล Brick 3 มิติ
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

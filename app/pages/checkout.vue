<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-68px-68px)] mx-auto my-auto flex max-w-5xl flex-col px-4 py-10 lg:py-14 text-slate-800"
    >
      <section class="rounded-2xl border border-slate-200 bg-white/90 shadow-sm overflow-hidden">
        <div class="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Checkout
          </p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900">
            เข้าสู่ขั้นตอนชำระเงิน
          </h1>
          <p class="mt-2 text-sm text-slate-600">
            เมื่อตั้งค่าทุก Step เสร็จแล้ว สามารถกดปุ่ม Checkout จากหน้าสร้างโมเสกเพื่อมาที่หน้านี้
            เพื่อส่งข้อมูลสั่งซื้อและเตรียมลิงก์ชำระเงิน
          </p>
        </div>

        <div class="grid gap-6 px-5 py-6 lg:grid-cols-[1.6fr,1fr]">
          <div class="space-y-4">
            <div v-if="finalPreview" class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">ตัวอย่างงานของคุณ</p>
                  <p class="text-sm text-slate-600">ภาพ Step 3 ล่าสุด (รวมการแก้ไขแล้ว)</p>
                </div>
                <span class="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">Preview</span>
              </div>
              <div class="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img :src="finalPreview" alt="Final preview" class="w-full max-h-[420px] object-contain bg-white" />
              </div>
              <p class="mt-2 text-xs text-slate-500">
                หากต้องการแก้ไขเพิ่มเติม โปรดกลับไปที่ Step 3 แล้วสร้างใหม่ จากนั้นค่อยกลับมาชำระเงิน
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  1
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-slate-900">
                    ตรวจสอบไฟล์จาก Step 3 ให้สมบูรณ์
                  </p>
                  <p class="text-sm text-slate-600">
                    ใช้ตัวอย่าง PDF และรายการสีที่ระบบสร้างเพื่อยืนยันว่าต้องการสั่งซื้อชุดเต็มหรือเฉพาะไฟล์คำสั่ง
                    (ปรับแก้ภาพให้เรียบร้อยก่อนกด Checkout)
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  2
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-slate-900">
                    เลือกแพ็กเกจที่ต้องการ
                  </p>
                  <p class="text-sm text-slate-600">
                    - ชุดเต็ม (ฐาน + ตัวต่อครบตาม Bill of Materials)<br>
                    - เฉพาะไฟล์ PDF คำสั่งประกอบความละเอียดสูง
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  3
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-slate-900">
                    ยืนยันการชำระเงินและจัดส่ง
                  </p>
                  <p class="text-sm text-slate-600">
                    ระบบกำลังเชื่อมต่อช่องทางจ่ายออนไลน์ ระหว่างนี้ทีมงานจะส่งลิงก์ชำระหรือใบโอนให้ตามข้อมูลติดต่อที่คุณระบุ
                    พร้อมแจ้งระยะเวลาจัดส่งหลังยืนยันออเดอร์
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside class="space-y-4">
            <div class="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 shadow-inner">
              <p class="text-sm font-semibold text-amber-900">
                สิ่งที่ช่วยให้ปิดออเดอร์เร็วขึ้น
              </p>
              <ul class="mt-3 space-y-2 text-sm text-amber-900/90">
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  จำนวนแผ่นฐาน/สัดส่วน studs จาก Step 3 และชื่อสีที่ใช้
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  ต้องการสั่งชุดเต็มหรือเฉพาะไฟล์ PDF
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  ช่องทางติดต่อที่สะดวก (อีเมล/LINE/โทร)
                </li>
                <li class="flex gap-2">
                  <span class="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                  ที่อยู่จัดส่ง/จังหวัด (สำหรับคำนวณค่าขนส่ง)
                </li>
              </ul>
              <p class="mt-3 rounded-lg border border-amber-100 bg-white px-3 py-2 text-xs text-amber-800">
                ระบบเก็บข้อมูลการสั่งซื้อและชำระเงินจริงจะถูกเชื่อมต่อเข้ามาภายหลัง ช่วงนี้สามารถใช้หน้านี้เป็นขั้นตอนอ้างอิงและแจ้งรายละเอียดกับทีมงานได้
              </p>
              <div class="mt-4 flex flex-wrap gap-3 items-center">
                <NuxtLink
                  to="/brick"
                  class="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-50"
                >
                  กลับไปแก้ไขภาพ
                </NuxtLink>
                <template v-if="user">
                  <div class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
                    <span class="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      {{ user.email?.charAt(0)?.toUpperCase() || 'U' }}
                    </span>
                    <span>เข้าสู่ระบบแล้ว · {{ user.email }}</span>
                  </div>
                </template>
                <button
                  v-else
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
                  @click="openAuthModal"
                >
                  เข้าสู่ระบบ/บันทึกงาน
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.146 11.354a.5.5 0 0 1 0-.708L8.793 8 6.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0"/>
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { openAuthModal, user } = useAuthFlow();
const finalPreview = useState<string | null>('brick-final-step3-preview', () => null);

onMounted(() => {
  // fallback for hard refresh: try sessionStorage (ไม่ใช้ cookie)
  try {
    if (!finalPreview.value) {
      const stored =
        sessionStorage.getItem('brick-step3-final-preview') ??
        localStorage.getItem('brick-step3-final-preview');
      if (stored) {
        finalPreview.value = stored;
      }
    }
  } catch (error) {
    console.warn('ไม่สามารถอ่านภาพจาก sessionStorage/localStorage ได้', error);
  }
});
</script>
<style lang="scss">
@mixin brick-bg($color, $hue: 0deg) {
  $brick-peg-size: 15px;
  $brick-wall-thickness: 6px;
  $brick-square: $brick-peg-size + $brick-wall-thickness * 2;

  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;

    background-color: $color;
    background-image:
      radial-gradient($color $brick-peg-size/2, transparent $brick-peg-size/2+1px),
      radial-gradient(rgba(#fff, .4) $brick-peg-size/2, transparent $brick-peg-size/2+1px),
      radial-gradient(rgba(#000, .18) $brick-peg-size/2, transparent $brick-peg-size/2+$brick-wall-thickness/2),
      radial-gradient(rgba(#000, .18) $brick-peg-size/2, transparent $brick-peg-size/2+$brick-wall-thickness/2);

    background-size: $brick-square $brick-square;
    background-position:
      0px 0px,
      -0.5px -0.5px,
      0px 0px,
      $brick-wall-thickness/2 $brick-wall-thickness/2;

    background-repeat: repeat;

    filter: hue-rotate($hue);
  }
}

.brick-bg--content {
  @include brick-bg(#1E3A8A, 0deg);
}
</style>

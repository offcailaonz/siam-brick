<template>
  <div class="brick-bg--content">
    <main class="min-h-[calc(100vh-64px-100px)] mx-auto max-w-3xl space-y-6 px-4 py-16 text-slate-800 text-white">
      <h1 class="text-3xl font-bold">นโยบายความเป็นส่วนตัว</h1>
      <p>อัปเดตล่าสุด {{ new Date().toLocaleDateString('th-TH') }}</p>
      <section>
        <h2 class="text-xl font-semibold">ข้อมูลที่เราเก็บ</h2>
        <p>
          รูปที่อัปโหลด, การตั้งค่าโครงการ, การติดต่อ และข้อมูลการชำระเงิน
          (ผ่านผู้ประมวลผลภายนอก)
        </p>
      </section>
      <section>
        <h2 class="text-xl font-semibold">การใช้ข้อมูล</h2>
        <p>
          ใช้เพื่อสร้างโมเสก คำนวณวัสดุ ส่งอุปกรณ์ และแจ้งเตือนการอัปเดตบริการ
        </p>
      </section>
      <section>
        <h2 class="text-xl font-semibold">การแชร์ข้อมูล</h2>
        <p>
          แชร์เฉพาะกับผู้ให้บริการจัดส่งและการชำระเงินที่จำเป็นต่อการให้บริการ
        </p>
      </section>
      <section>
        <h2 class="text-xl font-semibold">สิทธิ์ของผู้ใช้</h2>
        <ul class="list-disc pl-6">
          <li>ขอดาวน์โหลด/ลบรูปและรายการคำสั่ง</li>
          <li>ปิดบัญชีและลบข้อมูลได้ทุกเมื่อ</li>
          <li>เลือกยกเลิกการรับข่าวสารได้</li>
        </ul>
      </section>
    </main>
  </div>
</template>
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

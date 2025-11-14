<template>
  <div class="brick-bg--content">
    <main
      class="min-h-[calc(100vh-64px-68px)] mx-auto max-w-3xl space-y-6 px-4 py-16 text-slate-800 text-white"
    >
      <h1 class="text-3xl font-bold">ข้อตกลงการใช้บริการ</h1>
      <p>กรุณาอ่านก่อนใช้ Generate Brick Pixel</p>
      <section>
        <h2 class="text-xl font-semibold">การใช้งาน</h2>
        <p>
          ผู้ใช้ตกลงใช้งานเพื่อสร้างโมเสกส่วนบุคคล
          ไม่เผยแพร่เนื้อหาที่ละเมิดลิขสิทธิ์หรือผิดกฎหมาย
        </p>
      </section>
      <section>
        <h2 class="text-xl font-semibold">การชำระเงินและการคืนเงิน</h2>
        <p>
          ค่าบริการทุกส่วนรวมภาษีแล้ว หากสินค้าเสียหายติดต่อภายใน 7
          วันเพื่อขอเปลี่ยนหรือคืนเงิน
        </p>
      </section>
      <section>
        <h2 class="text-xl font-semibold">ทรัพย์สินทางปัญญา</h2>
        <p>
          โค้ดและเครื่องมือทั้งหมดเป็นกรรมสิทธิ์ของ Siam Brick
          ส่วนรูปที่ผู้ใช้อัปโหลดยังคงเป็นของผู้ใช้
        </p>
      </section>
      <section>
        <h2 class="text-xl font-semibold">การแก้ไขเงื่อนไข</h2>
        <p>ข้อตกลงอาจเปลี่ยนแปลงได้ เราจะประกาศผ่านหน้าเว็บและอีเมล (ถ้ามี)</p>
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

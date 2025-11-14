<template>
  <main class="mx-auto max-w-3xl space-y-6 px-4 py-16 text-slate-800">
    <h1 class="text-3xl font-bold">นโยบายความเป็นส่วนตัว</h1>
    <p>อัปเดตล่าสุด {{ new Date().toLocaleDateString('th-TH') }}</p>
    <section>
      <h2 class="text-xl font-semibold">ข้อมูลที่เราเก็บ</h2>
      <p>รูปที่อัปโหลด, การตั้งค่าโครงการ, การติดต่อ และข้อมูลการชำระเงิน (ผ่านผู้ประมวลผลภายนอก)</p>
    </section>
    <section>
      <h2 class="text-xl font-semibold">การใช้ข้อมูล</h2>
      <p>ใช้เพื่อสร้างโมเสก คำนวณวัสดุ ส่งอุปกรณ์ และแจ้งเตือนการอัปเดตบริการ</p>
    </section>
    <section>
      <h2 class="text-xl font-semibold">การแชร์ข้อมูล</h2>
      <p>แชร์เฉพาะกับผู้ให้บริการจัดส่งและการชำระเงินที่จำเป็นต่อการให้บริการ</p>
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
</template>

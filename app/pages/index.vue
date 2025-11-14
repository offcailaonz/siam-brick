<template>
  <main class="bg-slate-50 text-slate-900">
    <LandingHeroBanner />
    <LandingReadyKitsGrid :kits="readyKits" />
    <LandingSplitCtaSection />
    <LandingStepsTimeline :steps="steps" />
    <LandingMaterialsSection :materials="materials" />
    <LandingShowcaseGrid :showcase="showcase" />
    <LandingFaqAccordion :faqs="faqs" />
    <LandingComingSoonSection />
  </main>
</template>

<script setup lang="ts">
import LandingHeroBanner from '~/components/landing/HeroBanner.vue';
import LandingReadyKitsGrid from '~/components/landing/ReadyKitsGrid.vue';
import LandingSplitCtaSection from '~/components/landing/SplitCtaSection.vue';
import LandingStepsTimeline from '~/components/landing/StepsTimeline.vue';
import LandingMaterialsSection from '~/components/landing/MaterialsSection.vue';
import LandingShowcaseGrid from '~/components/landing/ShowcaseGrid.vue';
import LandingFaqAccordion from '~/components/landing/FaqAccordion.vue';
import LandingComingSoonSection from '~/components/landing/ComingSoonSection.vue';

const readyKits = [
  {
    name: 'Tom & Jerry Portrait',
    tag: 'ขายดี',
    size: '96 × 96 px (36 plates)',
    studs: 9216,
    difficulty: 'Intermediate',
    priceKit: '5,900',
    priceInstructions: '690',
  },
  {
    name: 'City Skyline',
    tag: 'ใหม่',
    size: '128 × 96 px (48 plates)',
    studs: 12288,
    difficulty: 'Advanced',
    priceKit: '7,400',
    priceInstructions: '790',
  },
  {
    name: 'Minimal Pet Poster',
    tag: 'แนะนำ',
    size: '64 × 64 px (16 plates)',
    studs: 4096,
    difficulty: 'Beginner',
    priceKit: '3,200',
    priceInstructions: '590',
  },
];

const steps = [
  {
    title: 'อัปโหลดรูป & ปรับขนาด',
    description: 'ระบบจะประมวลผลและคำนวณจำนวน studs, plate, baseplate ให้อัตโนมัติ',
  },
  {
    title: 'รับ PDF ตัวอย่าง',
    description: 'ดาวน์โหลด 3–4 หน้าแรกฟรี ส่วนที่เหลือเบลอจนกว่าจะปลดล็อกชุดเต็ม',
  },
  {
    title: 'ปลดล็อก & จัดส่ง',
    description: 'เมื่อชำระเงิน เราจะปลดล็อก PDF เต็มและจัดชุดอุปกรณ์พร้อมส่งถึงบ้าน',
  },
];

const materials = [
  {
    title: 'คัดเกรดอุปกรณ์',
    description: 'เลือกใช้อุปกรณ์ที่เข้ากันได้กับฐานและ plate อย่างแม่นยำ พร้อมสำรอง 5% เผื่อประกอบผิด',
  },
  {
    title: 'แพ็กอย่างมืออาชีพ',
    description: 'แยกซองตามสีและตำแหน่ง plate พร้อม QR code ดาวน์โหลดไฟล์ซ้ำได้ทุกเมื่อ',
  },
  {
    title: 'ทีมสนับสนุน',
    description: 'มีทีมตอบคำถามเรื่องการประกอบและการเคลมชิ้นส่วนภายใน 24 ชม.',
  },
];

const showcase = [
  { name: 'K. Mint – Portrait Series', story: '“ระบบเลือกสีให้ครบ จ่ายเงินแล้วส่งชุดมาไวมาก”' },
  { name: 'คุณปริม – Gift for Dad', story: '“ดาวน์โหลดตัวอย่างดูก่อนแล้วตัดสินใจ ซื้อชุดเต็มคุ้มจริง”' },
  { name: 'ทีมงาน Studio X', story: '“ใช้ในโปรเจกต์นิทรรศการใหญ่แบบไม่มีสะดุด”' },
];

const faqs = [
  {
    question: 'ต้องใช้เวลาประมวลผลนานไหม?',
    answer: 'โดยทั่วไปไม่เกิน 1 นาทีสำหรับภาพ 128×128. ขั้นตอนดาวน์โหลดตัวอย่างใช้เวลาเพียงไม่กี่วินาที',
  },
  {
    question: 'ถ้าชำระเงินแล้วจะได้อะไร?',
    answer: 'คุณจะปลดล็อก PDF เต็มทุกหน้าในทันที และเราเริ่มจัดชุดอุปกรณ์ + เอกสารพิมพ์จริงส่งถึงบ้าน',
  },
  {
    question: 'เปลี่ยนขนาดภายหลังได้หรือไม่?',
    answer: 'ปรับขนาดได้ตลอดก่อนชำระเงิน ระบบจะคำนวณรายการวัสดุใหม่ให้อัตโนมัติ',
  },
];
</script>

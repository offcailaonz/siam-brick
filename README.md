# Siam Brick – MVP Overview

> Brick Art Remix: เครื่องมือแปลงภาพเป็นโมเสกตัวต่อ พร้อม storefront สำหรับขายชุดประกอบและคำสั่งพิมพ์

## 1. Vision
- ผู้ใช้ **อัปโหลดรูป → ระบบสร้างโมเสก + คำนวณวัสดุให้อัตโนมัติ** → สามารถลองดาวน์โหลด PDF ตัวอย่าง 3–4 หน้า (ที่เหลือเบลอ)
- เมื่อชำระเงิน ระบบปลดล็อก **PDF เต็ม, สั่งแพ็กอุปกรณ์ทั้งหมด, จัดส่งเอกสารจริง**
- Landing page โปรโมตทั้ง generator และลายสำเร็จ พร้อมส่วน Coming Soon สำหรับโมเดล 3D

## 2. Landing Page Structure
1. **Hero Banner** – ภาพโมเสก, headline “สร้างตัวต่อรูปภาพของคุณ”, CTA `เริ่มสร้าง` (→ `/brick`) + `ดูแกลเลอรี`
2. **Ready-to-Build Catalog** – ลาย curated (เช่น Tom & Jerry) พร้อมราคา, stud count, ปุ่ม `สั่งชุดเต็ม`/`ซื้อคำสั่ง`
3. **Customize vs Shop** – สองคอลัมน์เปรียบเทียบ “สร้างรูปของคุณ” vs “เลือกจากแกลเลอรี”
4. **How It Works**
   - Step 1: อัปโหลดและปรับแต่ง → ระบบสร้างโมเสก + Bill of Materials ให้อัตโนมัติ
   - Step 2: เลือกแพ็กเกจ (ชุดเต็ม / คำสั่ง) ตามรายการที่ระบบแนะนำ
   - Step 3: ชำระเงิน → ปลดล็อก PDF เต็ม + เริ่มจัดส่งอุปกรณ์
5. **Materials & Quality** – เล่ามาตรฐาน brick, การแพ็ก, ตัวเลือกฐาน
6. **Showcase / Testimonials** – before/after + รีวิวยืนยันว่า “ระบบจัดชุดให้ครบ”
7. **FAQ & Support** – เวลาในการผลิต, จำนวน stud สูงสุด, นโยบายคืนเงิน ฯลฯ
8. **Coming Soon: 3D Brick Model** – ใช้ภาพ mock (คนขี่ไดโนเสาร์ → โมเดล brick) พร้อม CTA `แจ้งเตือนเมื่อเปิดให้ใช้งาน`

## 3. Generator (`/brick`)
- Step 1–4 UI (อัปโหลด → ปรับโทน → ตัวอย่าง → ดาวน์โหลด)
- Step 4 แสดงปุ่ม `ดาวน์โหลดตัวอย่าง PDF` (3–4 หน้าแรกชัด, ที่เหลือเบลอ) และ CTA `ปลดล็อกชุดเต็ม`
- High-quality color toggle (ปิด/เปิดการรวมสีที่ใช้ ≤ 10 studs)
- PDF export เป็น A4 + watermark ขวาบน
- หลังชำระเงิน (อนาคต) ผู้ใช้ที่ล็อกอินจะกดดาวน์โหลด PDF เต็ม และทีม fulfillment จะจัดส่ง brick kit + เอกสาร

## 4. Data Model (Draft)
```ts
type Product = {
  slug: string;
  name: string;
  thumbnail: string;
  size: { width: number; height: number; plates: number };
  studs: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  priceKit: number;
  priceInstructions: number;
  tags: string[];
  inStock: boolean;
};
```

## 5. Roadmap
- **MVP Landing**: hero, catalog, split CTA, steps, materials, showcase, FAQ, coming-soon section.
- **Generator Enhancements**: partial PDF preview overlay, CTA → checkout, logging events.
- **Future (Post-MVP)**:
  - Authentication & dashboard (ปลดล็อกไฟล์หลังชำระ, order history)
  - Checkout / payment integration
  - Automated fulfillment handoff (packing list, shipping labels)
  - 3D Model generator (coming-soon lead capture)

## 6. Development
- Install deps: `yarn install`
- Dev server: `yarn dev` (http://localhost:3000)
- Production build: `yarn build` then `yarn preview`

> หมายเหตุ: คำว่า “Brick” ถูกใช้แทนทั้งหมดเพื่อหลีกเลี่ยงประเด็นลิขสิทธิ์

---

## ภาพรวมสำหรับทีมพัฒนา (ภาษาไทย)
1. **โครงสร้างโปรเจกต์**
   - `/app/pages/index.vue` = Landing page (กำลัง refactor)
   - `/app/pages/brick.vue` = Brick Art Remix generator ที่ย้ายมาจากเว็บเดิม
   - `/app/components/BrickArtRemix/**` = core UI + logic (เส้นทาง import ปรับแล้ว)
   - `/app/lib/brickArtRemix/**` = อัลกอริทึม, สี, PDF helper

2. **Flow ปัจจุบัน**
   - ผู้ใช้กด CTA → `/brick` → ทำ Step 1-4 → ดาวน์โหลดตัวอย่าง PDF 3–4 หน้า
   - ยังไม่มี checkout/auth; ปุ่ม “ปลดล็อกชุดเต็ม” เป็น placeholder สำหรับอนาคต
   - ค่าคงที่ `SPARSE_COLOR_THRESHOLD = 10` ใช้กำหนดการรวมสีที่ใช้ไม่เกิน 10 studs (ปิดด้วย toggle)

3. **งานที่จะทำถัดไป**
   - Landing Component: Hero, Ready Kits, Split CTA, Steps, Materials, Showcase, FAQ, Coming Soon
   - Step 4 UI: เพิ่ม overlay “ตัวอย่าง PDF / ปลดล็อกหลังชำระเงิน”
   - เตรียม routing หรือ layout สำหรับ dashboard/auth (ยังไม่เริ่ม)
   - เพิ่ม event logging (เช่น คลิก CTA, ดาวน์โหลดตัวอย่าง)

4. **การพัฒนา**
   - `yarn install` → `yarn dev`
   - ตรวจวัด branding: ห้ามใช้คำว่า “Lego” ใน source (เช็คด้วย `rg -ni "lego"`)
   - ให้น้ำหนักกับ responsive design และ performance

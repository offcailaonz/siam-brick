# Siam Brick – MVP Overview

> Generate Brick Pixel: เครื่องมือแปลงภาพเป็นโมเสกตัวต่อ พร้อม storefront สำหรับขายชุดประกอบและคำสั่งพิมพ์

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
8. **Interactive Preview** – ใต้ hero มี BrickArtRemixApp (Step 1–3) ให้ทดลองปรับค่าทันที, พร้อมรูป default + crop สาธิต และ redirect ไปหน้า `/brick` เมื่อต้องการอัปโหลดไฟล์จริง
9. **Coming Soon: 3D Brick Model** – ใช้ภาพ mock (คนขี่ไดโนเสาร์ → โมเดล brick) พร้อม CTA `แจ้งเตือนเมื่อเปิดให้ใช้งาน`

## 3. Generator (`/brick`)
- Step 1–4 UI (อัปโหลด → ปรับโทน → ตัวอย่าง → ดาวน์โหลด) / Landing preview ปิด Step 4 ด้วย props
- Props ใหม่ใน `BrickArtRemixApp`:
  - `initialResolution`, `initialCropInteraction`, `defaultImageSrc` สำหรับ seed UI
  - `showStep4`, `redirectOnUpload` ใช้ซ่อน Step 4 และเปลี่ยน flow บน landing
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
- **Future 2 (Experimental)**:
  - เบลอหน้าที่เหลือใน PDF preview ให้เนียนขึ้น + เพิ่ม watermark แบบ brand
  - ทดสอบ prototype แปลงภาพเป็นโมเดล 3D (coming soon section)

## 6. Development
- Install deps: `yarn install`
- Dev server: `yarn dev` (http://localhost:3000)
- Production build: `yarn build` then `yarn preview`

> หมายเหตุ: คำว่า “Brick” ถูกใช้แทนทั้งหมดเพื่อหลีกเลี่ยงประเด็นลิขสิทธิ์

## 7. Mock API & Assets
- ดาต้าในหน้า Landing ถูก mock ผ่านไฟล์ `app/mockup-api-data/index.ts` และรูป placeholder ใน `public/mockup-api-data/images/**`
- เมื่อ backend พร้อม เพียงเปลี่ยนให้ component ไปเรียก API จริงหรือใช้ Nuxt server route โดยคง schema ใกล้เคียง
- Demo generator ส่ง props: รูป default (`defaultImageSrc`), ตำแหน่ง crop (`initialCropInteraction`), resolution เริ่มต้น และ redirect path

---

## ภาพรวมสำหรับทีมพัฒนา (ภาษาไทย)
1. **โครงสร้างโปรเจกต์**
- `/app/pages/index.vue` = Landing page (compose ด้วย component ย่อย, แสดง preview generator)
- `/app/pages/brick.vue` = Brick Art Remix generator เต็มรูปแบบ
- `/app/components/BrickArtRemix/**` = core UI + logic (รองรับ props สำหรับ seed data)
- `/app/lib/brickArtRemix/**` = อัลกอริทึม, สี, PDF helper
- `/app/mockup-api-data/**` + `/public/mockup-api-data/images/**` = mock data/API responses + placeholder ภาพ

2. **Flow ปัจจุบัน**
   - ผู้ใช้กด CTA → `/` auto preview (Step 1–3) → ถ้ากดเลือกไฟล์จะถูกพาไป `/brick` เพื่อทำงานเต็ม
   - หน้า `/brick` (เต็ม) ยังคง Step 1–4 → ดาวน์โหลดตัวอย่าง PDF 3–4 หน้า → ปลดล็อกหลังซื้อ (ยังไม่เชื่อม payment)
   - ค่าคงที่ `SPARSE_COLOR_THRESHOLD = 10` ใช้กำหนดการรวมสีที่ใช้ไม่เกิน 10 studs (ปิดด้วย toggle)

3. **งานที่จะทำถัดไป**
   - ต่อ backend API แทน mock (`app/mockup-api-data`)
   - Step 4 UI: overlay “ตัวอย่าง PDF / ปลดล็อกหลังชำระเงิน” + payment integration
   - Dashboard/Auth flow สำหรับปลดล็อก PDF + tracking orders
   - Event logging (CTA, ดาวน์โหลดตัวอย่าง, redirect `/brick`)

4. **การพัฒนา**
   - `yarn install` → `yarn dev`
   - ตรวจวัด branding: ห้ามใช้คำว่า “Lego” ใน source (เช็คด้วย `rg -ni "lego"`)
   - ให้น้ำหนักกับ responsive design และ performance

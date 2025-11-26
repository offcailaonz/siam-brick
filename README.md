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
- ฟลูสเต็ป: Step 1 (อัปโหลด/ครอป) → Step 2 (วิเคราะห์และแก้ไขภาพ + ปรับโทนสี/คอนทราสต์) → Step 3 (ภาพอิฐจริง) → Step 4 (ดาวน์โหลด/ส่งออก)
- **แก้ไขภาพทำใน Step 2 เท่านั้น**: คลิกปุ่ม “แก้ไขภาพด้วย Paintbrush/Eraser/Dropper” จะเปิด modal (Teleport ไป `body`, z-index สูง) พร้อมภาพอิฐล่าสุด
  - แก้สีทับภาพล่าสุดได้ทันที (ใช้ภาพล่าสุดเป็นพื้นหลังใน modal)
  - Eraser อ้างอิงสี “ภาพต้นฉบับจาก Step 2” ที่ quantize ครั้งแรก เพื่อคืนค่าสีได้ถูกต้อง แม้เคยเซฟไปแล้ว
  - Dropper/Color dropdown อัปเดตสีปัจจุบัน, ปุ่มเครื่องมือมี highlight, cursor ตามเครื่องมือ (brush, eraser=not-allowed, dropper=copy)
  - Preview modal ดีบาวซ์เพื่อความลื่น แต่แสดงผลบน canvas ทันที
- **Step 3 ไม่รองรับการวาด/ลบ** แล้ว เหลือเฉพาะการปรับโทน/คอนทราสต์ก่อนเข้าขั้นตอนอิฐ
- Props ใน `BrickArtRemixApp` ที่ใช้บน landing:
  - `initialResolution`, `initialCropInteraction`, `defaultImageSrc` สำหรับ seed UI
  - `showStep4`, `redirectOnUpload` ใช้ซ่อน Step 4 และเปลี่ยน flow บน landing
- Step 4: `ดาวน์โหลดตัวอย่าง PDF` (3–4 หน้าแรกชัด, ที่เหลือเบลอ) + CTA `ปลดล็อกชุดเต็ม`
- High-quality color toggle (ปิด/เปิดการรวมสีที่ใช้ ≤ 10 studs)
- PDF export เป็น A4 + watermark ขวาบน; อนาคตล็อกอิน + จ่ายเงินแล้วดาวน์โหลดไฟล์เต็มได้

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

### การตั้งค่าและรันโปรเจกต์แบบละเอียด
1) เตรียม environment
```bash
cp .env.example .env
# แก้ค่าให้ตรงกับโปรเจกต์ Supabase ของคุณ
SUPABASE_URL="https://<your-project>.supabase.co"
SUPABASE_KEY="<anon-or-service-role-key>"
```
> ในรีโปนี้มี `.env` ตัวอย่างพร้อมค่า anon key ของโปรเจกต์เดโม่ (`jozjqbioezokkztqlgdv`) ใช้งานได้ทันทีสำหรับ dev

2) ติดตั้งและรัน
```bash
yarn install
yarn dev --hostname 127.0.0.1 --port 3000
```
เปิดเบราว์เซอร์ที่ `http://127.0.0.1:3000`

3) บัญชีทดสอบ (Supabase Auth)
- อีเมล: `admin@siam-brick.com`
- รหัสผ่าน: `123456`
> ใช้ล็อกอินใน Backoffice (`/backoffice`) และทดสอบ flow auth

### Troubleshooting Auth (Supabase)
- ถ้า Network ขึ้น `token?grant_type=password` แล้วได้ 400 `invalid_credentials` → อีเมล/รหัสไม่ตรง หรือบัญชียังไม่ถูกสร้าง/ยืนยันอีเมล
- เช็กว่า `.env` โหลดจริง (รัน `echo $SUPABASE_URL` ก่อน `yarn dev` หรือดูใน DevTools Network header `apikey`)
- ทดสอบด้วย cURL เพื่อแยกปัญหาหน้าเว็บ:
```bash
curl -i "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  --data '{"email":"admin@siam-brick.com","password":"123456"}'
```
- ถ้าได้ 200 พร้อม access_token แปลว่า backend ปกติ → กลับไปตรวจฟอร์มและข้อมูลล็อกอินที่ใส่
- ถ้าอยู่หลัง proxy/VPN หรือมี extension บล็อก request ให้ลอง incognito/ปิด extension

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

## 9. Backoffice, Roles & Pricing (อัปเดตล่าสุด)
- เมนู: Orders / Products / Users / รูปแบบ/ราคา (admin-only ด้วย middleware `admin-only`)
- Roles: ตาราง `user_roles` กำหนด role (`user`/`admin`) — ต้องมีแถว admin ถึงจะเข้า `/backoffice` ได้  
  ```sql
  insert into public.user_roles (user_id,email,role)
  values ('<auth.users.id>', 'admin@siam-brick.com', 'admin')
  on conflict (user_id) do update set role='admin';
  ```
- Products: upsert ไปตาราง `products` (metadata: tag, studs, difficulty, size, image) ผ่านฟอร์ม/โมดัล generator (BrickArtRemixApp) → “ใช้ผลลัพธ์นี้” เติมภาพ/ขนาด/studs → บันทึกครั้งเดียว
- รูปแบบ/ราคา (Format prices):
  - ตาราง `format_prices` เก็บขนาด (normalize ด้านสั้น x ด้านยาว) + width/height + price
  - UI แสดง columns: ด้าน A/B, ฐาน 16x16, ฐาน 32x32, studs, มุม, ที่แขวน, ขอบ (รวมสั้น+ยาว), ราคาทุน (คำนวณจาก part prices), ราคาขาย, กำไร/กำไร %, จัดการ
  - ปุ่ม “บันทึกราคาขนาด” ส่ง payload รวม (ลดจำนวน API call)
  - RLS/สิทธิแนะนำ: select/insert/update/delete ให้ role admin/authenticated ตามที่ใช้ใน Backoffice
- ต้นทุนเพิ่มเติม (Extra costs):
  - ตาราง `extra_costs` (id serial, name text, amount numeric) ใช้บวกเพิ่มในราคาทุนทุกขนาด
  - โมดัล “ราคาต้นทุนเพิ่มเติม” เพิ่ม/ลบรายการ แล้วกดบันทึกจะ upsert+ลบรายการที่หายไป ให้โหลดกลับมาเมื่อเปิดหน้า
  - แสดงยอดรวมต้นทุนเพิ่มข้างปุ่มในหัวตาราง (คำนวณจากรายการล่าสุด)
  - ตัวอย่าง DDL:  
    ```sql
    create table if not exists public.extra_costs (
      id serial primary key,
      name text not null,
      amount numeric not null default 0,
      created_at timestamptz default now()
    );
    grant select, insert, update, delete on public.extra_costs to authenticated;
    ```
- ราคาชิ้นส่วน (Part prices):
  - ตาราง `part_prices` (part_key primary key, price numeric)
  - UI แสดงชื่อชิ้นส่วนเป็น header และมี input แถวเดียว → ปุ่ม “บันทึกราคาชิ้นส่วน” ยิงครั้งเดียวด้วย payload รวม (ลด API call ซ้ำ)
  - คีย์ที่ใช้: `plate-16`, `plate-32`, `frame-edge`, `frame-corner`, `hanger`, `stud-pack`
  - ตัวอย่าง seed:
    ```sql
    insert into public.part_prices(part_key, price) values
      ('plate-16',16.13), ('plate-32',16.13),
      ('frame-edge',4.61), ('frame-corner',4.94),
      ('hanger',3.30), ('stud-pack',0.09)
    on conflict (part_key) do update set price = excluded.price;
    ```

## 10. Ready Kits & Checkout (ล่าสุด)
- Landing `ReadyKitsGrid` ดึงสินค้า active จาก Supabase (fallback mock) และแสดง preview/fullscreen; ปุ่ม “สั่งชุดเต็ม” ส่งต่อไป `/checkout?product=<slug|id>`
- Checkout รองรับโหมด Ready Kit:
  - ใช้ภาพ/ขนาด/studs จากสินค้าเป็น preview (แก้รูปไม่ได้)
  - สร้างออเดอร์ครั้งเดียวเมื่อกดชำระเงิน พร้อม metadata `{ product_id, product_slug, ... }`
  - Breakdowns ใช้ `getFrameAndBase(width,height)` แสดง ฐาน 32/16, studs, มุม, ที่แขวน, ขอบสั้น/ยาว
  - ที่อยู่จัดส่งเป็นโมดัล; ลด API call ที่ `order_shipping` (เก็บ snapshot ใน metadata แทน)

## 11. API / Tables ที่ใช้งาน
- `products` (active=true สำหรับ landing)
- `user_roles` (role admin สำหรับ Backoffice)
- `format_prices` (width/height/size/price, normalize ด้านสั้น x ด้านยาว)
- `part_prices` (part_key, price)
- `orders`, `order_shipping` (ใช้อัปเดตสินค้าหรือ ready kit ผ่าน checkout)

# siam-brick

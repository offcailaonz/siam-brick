# Database Schema Overview (Siam Brick)

> สรุปโครงสร้างฐานข้อมูลสำหรับระบบออเดอร์ / fulfillment

## orders
- `id` (bigint, PK, identity)
- `user_id` (uuid, FK → auth.users)
- `status` (text, default `รอชำระเงิน`)
- `preview_url` (text) – ลิงก์ภาพ preview
- `source` (text) – ที่มาของออเดอร์ เช่น `checkout`, `checkout:linked`
- `total_amount` (numeric) – มูลค่าออเดอร์
- `payment_ref` (text) – อ้างอิงการจ่าย
- `payment_method` (text)
- `payment_confirmed_at` (timestamptz)
- `cancellation_reason` (text)
- `fulfilled_at` (timestamptz)
- `is_locked_for_edits` (bool, default false)
- `idempotency_key` (text)
- `expires_at` (timestamptz) – ใช้ลบออเดอร์/asset ชั่วคราวเมื่อหมดอายุ
- `metadata` (jsonb, default `{}`)
- `crop_interaction` (jsonb) – interaction state จากหน้า generator
- `original_image` (text)
- `created_at` / `updated_at` (timestamptz, default now)

## order_shipping
- `order_id` (bigint, PK, FK → orders.id, cascade) – หนึ่งออเดอร์มีหนึ่ง record
- `recipient_name`, `phone`
- `province`, `district`, `subdistrict`, `postcode`
- `shipping_provider`, `tracking_number`
- `is_temp` (bool, default true) – ใช้ทำความสะอาดข้อมูลจัดส่งชั่วคราว
- `label` (text) – ชื่อเรียกที่อยู่
- `address_line` (text)
- `created_at`, `updated_at` (timestamptz)

## order_items (BOM / Line Items)
- `id` (bigint, PK)
- `order_id` (bigint, FK → orders.id, cascade)
- `sku`, `name`
- `quantity` (int, default 1)
- `unit_cost` (numeric, default 0) – เก็บต้นทุน/ราคาต่อชิ้น
- `package_id` (text) – ใช้จับกลุ่มเป็นแพ็ก
- `material_group` (text) – กลุ่มวัสดุ/สี
- `notes` (text)
- `created_at` (timestamptz)

## order_status_logs
- `id` (bigint, PK)
- `order_id` (bigint, FK → orders.id, cascade)
- `status` (text, not null)
- `changed_by` (uuid, FK → auth.users.id) – ผู้เปลี่ยนสถานะ
- `note` (text)
- `created_at` (timestamptz, default now)

## order_config
- `id` (serial, PK)
- `default_price` (numeric, default 999) – ราคาเริ่มต้นที่ Backoffice ตั้งค่า
- `hold_minutes` (int, default 60) – เวลาจองออเดอร์
- `price_note` (text)
- `last_updated_at` (timestamptz, default now)

## user_addresses (ที่อยู่จัดส่งของผู้ใช้)
- `id` (bigint, PK)
- `user_id` (uuid, FK → auth.users.id)
- `label` (text) – ชื่อเรียก เช่น บ้าน/ออฟฟิศ
- `recipient_name` (text) – ชื่อ-นามสกุลผู้รับ
- `phone` (text) – เบอร์ติดต่อ
- `address_line` (text)
- `province`, `district`, `subdistrict`, `postcode` (text)
- `is_default` (bool, default false)
- `created_at`, `updated_at` (timestamptz)

## ความสัมพันธ์หลัก
- orders 1:N order_items
- orders 1:1 order_shipping
- orders 1:N order_status_logs
- orders.user_id → auth.users.id

## หมายเหตุการใช้งาน
- ใช้ `expires_at` + `is_temp` เพื่อลบออเดอร์/ที่อยู่/asset ชั่วคราว
- `metadata` รองรับข้อมูลเสริม เช่น cleanup flags, channel, fraud signals
- `idempotency_key` ช่วยป้องกันการสร้างออเดอร์ซ้ำเมื่อ retry payment/webhook

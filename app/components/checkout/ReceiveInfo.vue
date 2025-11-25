<template>
  <div
    class="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 shadow-inner space-y-3"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold text-amber-900">สินค้าที่จะได้รับ</p>
        <p class="text-[11px] text-amber-700">
          คำนวณจากขนาด {{ resolution.width || 0 }} ×
          {{ resolution.height || 0 }} px
        </p>
      </div>
    </div>
    <div class="grid gap-2 sm:grid-cols-2 text-sm text-amber-900/90">
      <div
        class="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 flex items-center justify-between"
      >
        <span>ฐาน 32x32</span>
        <span class="font-semibold">{{ breakdown.base32 }} ชิ้น</span>
      </div>
      <div
        class="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 flex items-center justify-between"
      >
        <span>ฐาน 16x16</span>
        <span class="font-semibold">{{ breakdown.base16 }} ชิ้น</span>
      </div>
      <div
        class="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 flex items-center justify-between"
      >
        <span>มุมกรอบภาพ</span>
        <span class="font-semibold">{{ breakdown.corners }} ชิ้น</span>
      </div>
      <div
        class="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 flex items-center justify-between"
      >
        <span>ที่แขวนกรอบภาพ</span>
        <span class="font-semibold">{{ breakdown.clips }} ชิ้น</span>
      </div>
      <div
        class="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 flex items-center justify-between"
      >
        <span>ชิ้นส่วนกรอบภาพด้านสั้น</span>
        <span class="font-semibold">{{ breakdown.sideShort }} ชิ้น</span>
      </div>
      <div
        class="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 flex items-center justify-between"
      >
        <span>ชิ้นส่วนกรอบภาพด้านยาว</span>
        <span class="font-semibold">{{ breakdown.sideLong }} ชิ้น</span>
      </div>
      <div
        class="sm:col-span-2 rounded-lg border border-amber-100 bg-white px-3 py-2 flex items-center justify-between"
      >
        <span class="text-amber-800 font-semibold">จำนวนตัวต่อสำหรับประกอบภาพรวมทุกสี</span>
        <span class="font-semibold text-amber-800">
          ≈ {{ formatNumber(breakdown.studs) }} ชิ้น
          <span class="text-[11px] text-amber-600"> ( แต่ละสีจะเผื่อไปให้ 2–5% )</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  breakdown: {
    corners: number;
    clips: number;
    sideShort: number;
    sideLong: number;
    base32: number;
    base16: number;
    studs: number;
  };
  resolution: { width: number; height: number };
}>();

const formatNumber = (value: number) => new Intl.NumberFormat('th-TH').format(value || 0);
</script>

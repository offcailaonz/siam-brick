<template>
  <section class="space-y-8">
    <header class="space-y-2 text-center">
      <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Lego Art Remix</p>
      <h1 class="text-3xl font-semibold text-slate-900">
        แยก logic เก่าออกเป็น component เพื่อใช้งานใน Nuxt
      </h1>
      <p class="text-base text-slate-600">
        เลือกชุด Lego Art ที่มีอยู่ แล้วอัปโหลดภาพเพื่อเริ่มเตรียม workflow ใหม่ใน Vue.
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 class="text-xl font-semibold text-slate-900">เลือกชุด Lego Art</h2>
        <p class="text-sm text-slate-500">ข้อมูลทั้งหมดมาจาก stud map ดั้งเดิม</p>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            v-for="(entry, id) in studMapEntries"
            :key="id"
            :class="[
              'rounded-xl border px-4 py-3 text-left transition',
              selectedSetId === id
                ? 'border-indigo-500 bg-indigo-50/80 text-indigo-900 shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            ]"
            @click="selectedSetId = id"
          >
            <p class="text-sm font-medium">{{ entry.name }}</p>
            <p class="text-xs text-slate-500">{{ entry.officialName }}</p>
            <p class="mt-2 text-xs font-semibold text-slate-400">
              {{ formatNumber(totalStudCount(entry.studMap)) }} ชิ้น / {{ entry.sortedStuds.length }} สี
            </p>
          </button>
        </div>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 class="text-xl font-semibold text-slate-900">อัปโหลดรูปเพื่อทดลอง pipeline</h2>
        <p class="text-sm text-slate-500">ตอนนี้ component นี้ยังทำเฉพาะส่วนนำเข้า/normalization</p>

        <div class="mt-4 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange" />
          <button class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow" @click="triggerFilePicker">
            เลือกไฟล์ภาพ
          </button>
          <p class="text-xs text-slate-500">รองรับไฟล์ JPG/PNG สูงสุด ~10MB</p>
          <p v-if="uploadError" class="text-sm text-rose-600">{{ uploadError }}</p>
        </div>

        <div v-if="isProcessing" class="mt-4 flex items-center gap-3 text-sm text-slate-500">
          <span class="h-3 w-3 animate-ping rounded-full bg-indigo-500"></span>
          กำลังประมวลผลภาพ...
        </div>

        <div v-if="uploadedImage" class="mt-4 space-y-2 text-sm text-slate-600">
          <p>แสดงตัวอย่าง (ปรับขนาดอัตโนมัติเป็น 512px เพื่อเตรียม Step ถัดไป)</p>
          <canvas ref="previewCanvas" class="w-full rounded-xl border border-slate-200 bg-black/5"></canvas>
          <p v-if="imageDimensions" class="text-xs text-slate-400">
            ขนาดเดิม {{ imageDimensions.width }} × {{ imageDimensions.height }} px
          </p>
        </div>
      </article>
    </div>

    <article v-if="selectedSet" class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">พาเลตสีของ {{ selectedSet.name }}</h2>
          <p class="text-sm text-slate-500">
            รวมทั้งหมด {{ formatNumber(totalStudCount(selectedSet.studMap)) }} ชิ้น — เตรียม data ให้อยู่ใน reactive state แล้ว
          </p>
        </div>
        <span class="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600">
          {{ selectedSet.sortedStuds.length }} สี
        </span>
      </header>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <div class="space-y-3">
          <div
            v-for="hex in selectedSet.sortedStuds"
            :key="hex"
            class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2"
          >
            <div class="flex items-center gap-3">
              <span class="h-8 w-8 rounded-full border border-slate-200" :style="{ backgroundColor: hex }"></span>
              <div>
                <p class="text-sm font-medium text-slate-800">{{ hex }}</p>
                <p class="text-xs text-slate-500">{{ colorName(hex) ?? 'ไม่มีชื่อในฐานข้อมูล' }}</p>
              </div>
            </div>
            <p class="text-sm font-semibold text-slate-600">× {{ formatNumber(selectedSet.studMap[hex] ?? 0) }}</p>
          </div>
        </div>
        <div class="space-y-4 text-sm text-slate-600">
          <p>
            Component นี้ดึงข้อมูล stud และสีมาอยู่ใน world ของ Vue แล้ว: สามารถนำไปผูกกับ slider, canvas หรือ workflow Step 1-4 ต่อได้.
          </p>
          <ul class="list-disc space-y-2 pl-6">
            <li>สามารถเข้าถึง data ผ่าน composable/state โดยไม่ต้องยุ่งกับ global script</li>
            <li>ฟังก์ชันจากไฟล์ <code>algo.ts</code> พร้อมใช้งาน (เช่น <code>getPixelArrayFromCanvas</code>)</li>
            <li>ภาพที่อัปโหลดถูก normalize (ลบ alpha) แล้วรอขั้นตอน quantization</li>
          </ul>
          <p class="text-xs text-slate-400">
            TODO: ต่อกับขั้น runStep1/runStep2 เดิม, เพิ่มการเลือก quantization algorithm, และผูก depth worker ผ่าน Web Worker module
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { studMaps, type StudMapId } from '~/lib/legoArtRemix/studMaps';
import type { StudMapEntry } from '~/lib/legoArtRemix/types';
import { getPixelArrayFromCanvas, drawPixelsOnCanvas } from '~/lib/legoArtRemix/algo';
import { HEX_TO_COLOR_NAME } from '~/lib/legoArtRemix/bricklinkColors';

const studMapEntries = reactive(studMaps);
const availableSetIds = Object.keys(studMapEntries) as StudMapId[];
const selectedSetId = ref<StudMapId>(availableSetIds[0]);
const selectedSet = computed<StudMapEntry | null>(() => studMapEntries[selectedSetId.value] ?? null);

const fileInputRef = ref<HTMLInputElement | null>(null);
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const uploadedImage = ref<string | null>(null);
const imageDimensions = ref<{ width: number; height: number } | null>(null);
const uploadError = ref<string | null>(null);
const isProcessing = ref(false);

const SERIALIZE_EDGE_LENGTH = 512;

const totalStudCount = (studMap: Record<string, number>) =>
  Object.values(studMap).reduce((sum, count) => sum + count, 0);

const formatNumber = (value: number) => new Intl.NumberFormat('th-TH').format(value);

const colorName = (hex: string) => HEX_TO_COLOR_NAME[hex.toLowerCase()];

const triggerFilePicker = () => {
  uploadError.value = null;
  fileInputRef.value?.click();
};

const normalizeCanvasPixels = (canvas: HTMLCanvasElement) => {
  const pixels = getPixelArrayFromCanvas(canvas);
  for (let i = 3; i < pixels.length; i += 4) {
    pixels[i] = 255;
  }
  drawPixelsOnCanvas(pixels, canvas);
};

const drawImagePreview = (src: string) => {
  const canvas = previewCanvas.value;
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const img = new Image();
  img.onload = () => {
    const aspectRatio = img.width === 0 ? 1 : img.height / img.width;
    canvas.width = SERIALIZE_EDGE_LENGTH;
    canvas.height = Math.max(Math.round(SERIALIZE_EDGE_LENGTH * aspectRatio), 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    normalizeCanvasPixels(canvas);
    uploadedImage.value = canvas.toDataURL('image/png', 0.92);
    imageDimensions.value = { width: img.width, height: img.height };
    isProcessing.value = false;
  };
  img.onerror = () => {
    uploadError.value = 'ไม่สามารถเปิดไฟล์ภาพนี้ได้';
    isProcessing.value = false;
  };
  img.src = src;
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น';
    return;
  }
  isProcessing.value = true;
  uploadError.value = null;
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (typeof result === 'string') {
      drawImagePreview(result);
    } else {
      uploadError.value = 'ไม่สามารถอ่านไฟล์ได้';
      isProcessing.value = false;
    }
  };
  reader.onerror = () => {
    uploadError.value = 'เกิดข้อผิดพลาดระหว่างอ่านไฟล์';
    isProcessing.value = false;
  };
  reader.readAsDataURL(file);
};
</script>

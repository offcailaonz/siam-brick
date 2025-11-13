<template>
  <section class="space-y-8">
    <header class="space-y-2 text-center">
      <p class="text-sm uppercase tracking-[0.3em] text-slate-500">
        Lego Art Remix
      </p>
      <h1 class="text-3xl font-semibold text-slate-900">
        แยก logic เก่าออกเป็น component เพื่อใช้งานใน Nuxt
      </h1>
      <p class="text-base text-slate-600">
        เลือกชุด Lego Art ที่มีอยู่ แล้วอัปโหลดภาพเพื่อเริ่มเตรียม workflow
        ใหม่ใน Vue.
      </p>
    </header>

    <!-- <div class="grid gap-6 lg:grid-cols-2"> -->
    <div>
      <!-- <article class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
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
      </article> -->

      <article
        class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
      >
        <h2 class="text-xl font-semibold text-slate-900">
          อัปโหลดรูปเพื่อทดลอง pipeline
        </h2>
        <p class="text-sm text-slate-500">
          ตอนนี้ component นี้ยังทำเฉพาะส่วนนำเข้า/normalization
        </p>

        <div
          class="mt-4 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileChange"
          />
          <button
            class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
            @click="triggerFilePicker"
          >
            เลือกไฟล์ภาพ
          </button>
          <p class="text-xs text-slate-500">รองรับไฟล์ JPG/PNG สูงสุด ~10MB</p>
          <p v-if="uploadError" class="text-sm text-rose-600">
            {{ uploadError }}
          </p>
        </div>

        <div
          v-if="isProcessing"
          class="mt-4 flex items-center gap-3 text-sm text-slate-500"
        >
          <span class="h-3 w-3 animate-ping rounded-full bg-indigo-500"></span>
          กำลังประมวลผลภาพ...
        </div>

        <div
          v-show="uploadedImage"
          class="mt-4 space-y-2 text-sm text-slate-600"
        >
          <p>
            แสดงตัวอย่าง (ปรับขนาดอัตโนมัติเป็น 512px เพื่อเตรียม Step ถัดไป)
          </p>
          <canvas
            ref="step1Canvas"
            class="w-full rounded-xl border border-slate-200 bg-black/5"
          ></canvas>
          <p v-if="imageDimensions" class="text-xs text-slate-400">
            ขนาดเดิม {{ imageDimensions.width }} ×
            {{ imageDimensions.height }} px
          </p>
        </div>
      </article>
    </div>

    <!-- <article v-if="selectedSet" class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
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
            <li>ภาพที่อัปโหลดถูก normalize พร้อมขั้นตอน Step 1-2 สำหรับปรับโทนและขนาดแล้ว</li>
          </ul>
          <p class="text-xs text-slate-400">
            Roadmap ถัดไป: ต่อเข้ากับอัลกอริทึม Step 3/4, แสดงตาราง stud จริง และเพิ่มตัวสร้าง PDF/BrickLink export
          </p>
        </div>
      </div>
    </article> -->

    <section
      v-if="step1Ready"
      class="space-y-6 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
    >
      <header class="space-y-2">
        <h2 class="text-2xl font-semibold text-slate-900">
          ขั้นตอนที่ 1–2: เตรียมภาพและปรับแต่ง
        </h2>
        <p class="text-slate-600">
          เมื่ออัปโหลดภาพแล้ว ระบบจะ normalize ให้อัตโนมัติ
          จากนั้นคุณสามารถตั้งค่าความละเอียดและปรับโทนก่อนเข้าสู่ขั้น
          quantization
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-2">
        <article
          class="space-y-4 rounded-xl border border-slate-100 bg-white/80 p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Step 1 – Normalized Preview
              </h3>
              <p class="text-sm text-slate-500">
                แปลงเป็น {{ SERIALIZE_EDGE_LENGTH }} ×
                {{ SERIALIZE_EDGE_LENGTH }} px พร้อมลบค่า alpha
              </p>
            </div>
            <span
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >Step 1</span
            >
          </div>
          <img
            v-if="uploadedImage"
            :src="uploadedImage"
            alt="Step 1 Preview"
            class="w-full rounded-xl border border-slate-200"
          />
          <p v-if="imageDimensions" class="text-xs text-slate-500">
            ขนาดต้นฉบับ {{ imageDimensions.width }} ×
            {{ imageDimensions.height }} px
          </p>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-sm text-slate-600"
              >ความกว้าง (stud)
              <input
                type="number"
                :min="RESOLUTION_MIN"
                :max="RESOLUTION_MAX"
                :step="RESOLUTION_STEP"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                :value="targetResolution.width"
                @input="handleResolutionInput('width', $event)"
              />
            </label>
            <label class="text-sm text-slate-600"
              >ความสูง (stud)
              <input
                type="number"
                :min="RESOLUTION_MIN"
                :max="RESOLUTION_MAX"
                :step="RESOLUTION_STEP"
                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                :value="targetResolution.height"
                @input="handleResolutionInput('height', $event)"
              />
            </label>
          </div>
          <p class="text-xs text-slate-500">
            ระบบจะครอปภาพให้อัตโนมัติด้วยอัตราส่วน
            {{ targetResolution.width }} :
            {{ targetResolution.height }} ก่อนนำไปสร้างโมเสก
          </p>
        </article>

        <article
          class="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Step 2 – ปรับโทนภาพ
              </h3>
              <p class="text-sm text-slate-500">
                ตั้งค่า Hue / Saturation / Brightness / Contrast ก่อนนำไปแม็พสี
                Lego
              </p>
            </div>
            <span
              class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800"
              >Step 2</span
            >
          </div>

          <div class="space-y-4">
            <div class="grid gap-3 md:grid-cols-3">
              <label class="text-sm text-slate-600"
                >Hue (°)
                <input
                  type="range"
                  min="-180"
                  max="180"
                  :value="hsvControls.hue"
                  class="mt-1 w-full"
                  @input="handleHsvInput('hue', $event)"
                />
                <span class="text-xs text-slate-500"
                  >{{ hsvControls.hue }}°</span
                >
              </label>
              <label class="text-sm text-slate-600"
                >Saturation (%)
                <input
                  type="range"
                  min="-100"
                  max="100"
                  :value="hsvControls.saturation"
                  class="mt-1 w-full"
                  @input="handleHsvInput('saturation', $event)"
                />
                <span class="text-xs text-slate-500"
                  >{{ hsvControls.saturation }}%</span
                >
              </label>
              <label class="text-sm text-slate-600"
                >Value (%)
                <input
                  type="range"
                  min="-100"
                  max="100"
                  :value="hsvControls.value"
                  class="mt-1 w-full"
                  @input="handleHsvInput('value', $event)"
                />
                <span class="text-xs text-slate-500"
                  >{{ hsvControls.value }}%</span
                >
              </label>
            </div>
            <div class="grid gap-3 md:grid-cols-2">
              <label class="text-sm text-slate-600"
                >Brightness
                <input
                  type="range"
                  min="-128"
                  max="128"
                  :value="hsvControls.brightness"
                  class="mt-1 w-full"
                  @input="handleHsvInput('brightness', $event)"
                />
                <span
                  class="text-xs text-slate-500"
                  >{{ hsvControls.brightness }}</span
                >
              </label>
              <label class="text-sm text-slate-600"
                >Contrast
                <input
                  type="range"
                  min="-128"
                  max="128"
                  :value="hsvControls.contrast"
                  class="mt-1 w-full"
                  @input="handleHsvInput('contrast', $event)"
                />
                <span
                  class="text-xs text-slate-500"
                  >{{ hsvControls.contrast }}</span
                >
              </label>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span
              v-if="isStep2Processing"
              class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-slate-600 shadow-inner"
            >
              <span
                class="h-2 w-2 animate-ping rounded-full bg-indigo-500"
              ></span>
              กำลังอัปเดตพรีวิว...
            </span>
            <span
              v-else-if="step2Ready"
              class="rounded-full bg-emerald-100 px-3 py-1 text-emerald-600"
              >พร้อมใช้งาน</span
            >
            <button
              class="ml-auto rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
              type="button"
              @click="scheduleStep2Processing(0)"
            >
              สร้างพรีวิวอีกครั้ง
            </button>
          </div>

          <p v-if="step2Error" class="text-sm text-rose-600">
            {{ step2Error }}
          </p>

          <canvas ref="step2Canvas" class="hidden"></canvas>
          <canvas
            v-show="step2Ready"
            ref="step2UpscaledCanvas"
            class="w-full rounded-xl border border-indigo-200"
            style="image-rendering: pixelated; width: 100%; height: auto"
          ></canvas>
          <p v-if="step2Ready" class="text-xs text-slate-500">
            ความละเอียดปัจจุบัน {{ targetResolution.width }} ×
            {{ targetResolution.height }} stud (อัตราขยาย ×{{ SCALING_FACTOR }})
          </p>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { studMaps, type StudMapId } from '~/lib/legoArtRemix/studMaps';
import type { StudMapEntry } from '~/lib/legoArtRemix/types';
import {
  getPixelArrayFromCanvas,
  drawPixelsOnCanvas,
  applyHSVAdjustment,
  applyBrightnessAdjustment,
  applyContrastAdjustment
} from '~/lib/legoArtRemix/algo';
import { HEX_TO_COLOR_NAME } from '~/lib/legoArtRemix/bricklinkColors';

const studMapEntries = reactive(studMaps);
const availableSetIds = Object.keys(studMapEntries) as StudMapId[];
const selectedSetId = ref<StudMapId>(availableSetIds[0]);
const selectedSet = computed<StudMapEntry | null>(() => studMapEntries[selectedSetId.value] ?? null);

const fileInputRef = ref<HTMLInputElement | null>(null);
const step1Canvas = ref<HTMLCanvasElement | null>(null);
const step2Canvas = ref<HTMLCanvasElement | null>(null);
const step2UpscaledCanvas = ref<HTMLCanvasElement | null>(null);
const uploadedImage = ref<string | null>(null);
const imageDimensions = ref<{ width: number; height: number } | null>(null);
const uploadError = ref<string | null>(null);
const isProcessing = ref(false);
const isStep2Processing = ref(false);
const step2Error = ref<string | null>(null);
const step1Ready = ref(false);
const step2Ready = ref(false);

const SERIALIZE_EDGE_LENGTH = 512;
const RESOLUTION_MIN = 32;
const RESOLUTION_MAX = 128;
const RESOLUTION_STEP = 8;
const SCALING_FACTOR = 30;

const totalStudCount = (studMap: Record<string, number>) =>
  Object.values(studMap).reduce((sum, count) => sum + count, 0);

const formatNumber = (value: number) => new Intl.NumberFormat('th-TH').format(value);

const colorName = (hex: string) => HEX_TO_COLOR_NAME[hex.toLowerCase()];

const targetResolution = reactive({
  width: 64,
  height: 64
});

const hsvControls = reactive({
  hue: 0,
  saturation: 0,
  value: 0,
  brightness: 0,
  contrast: 0
});

const clampResolutionValue = (value: number) => {
  const rounded = Math.round(value / RESOLUTION_STEP) * RESOLUTION_STEP;
  return Math.min(Math.max(rounded || RESOLUTION_MIN, RESOLUTION_MIN), RESOLUTION_MAX);
};

const handleResolutionInput = (axis: 'width' | 'height', event: Event) => {
  const numericValue = Number((event.target as HTMLInputElement).value);
  if (!Number.isNaN(numericValue)) {
    targetResolution[axis] = numericValue;
  }
};

const handleHsvInput = (key: keyof typeof hsvControls, event: Event) => {
  const numericValue = Number((event.target as HTMLInputElement).value);
  if (!Number.isNaN(numericValue)) {
    hsvControls[key] = numericValue;
  }
};

const computeCropRectangle = (canvasWidth: number, canvasHeight: number, targetWidth: number, targetHeight: number) => {
  if (canvasWidth === 0 || canvasHeight === 0 || targetWidth === 0 || targetHeight === 0) {
    return { sx: 0, sy: 0, sWidth: canvasWidth, sHeight: canvasHeight };
  }
  const desiredAspect = targetWidth / targetHeight;
  const canvasAspect = canvasWidth / canvasHeight;
  let sWidth = canvasWidth;
  let sHeight = canvasHeight;

  if (canvasAspect > desiredAspect) {
    sHeight = canvasHeight;
    sWidth = sHeight * desiredAspect;
  } else {
    sWidth = canvasWidth;
    sHeight = sWidth / desiredAspect;
  }

  const sx = Math.max((canvasWidth - sWidth) / 2, 0);
  const sy = Math.max((canvasHeight - sHeight) / 2, 0);

  return { sx, sy, sWidth, sHeight };
};

const triggerFilePicker = () => {
  uploadError.value = null;
  fileInputRef.value?.click();
};

const resetWorkflowState = () => {
  step1Ready.value = false;
  step2Ready.value = false;
  step2Error.value = null;
  isStep2Processing.value = false;
};

const normalizeCanvasPixels = (canvas: HTMLCanvasElement) => {
  const pixels = getPixelArrayFromCanvas(canvas);
  for (let i = 3; i < pixels.length; i += 4) {
    pixels[i] = 255;
  }
  drawPixelsOnCanvas(pixels, canvas);
};

const drawImagePreview = (src: string) => {
  const canvas = step1Canvas.value;
  if (!canvas) {
    uploadError.value = 'ไม่สามารถสร้าง canvas แสดงตัวอย่างได้';
    isProcessing.value = false;
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    uploadError.value = 'เบราว์เซอร์ไม่รองรับ canvas';
    isProcessing.value = false;
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
    step1Ready.value = true;
    step2Ready.value = false;
    nextTick().then(() => scheduleStep2Processing(10));
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
  resetWorkflowState();
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

let step2Timeout: ReturnType<typeof setTimeout> | null = null;

const scheduleStep2Processing = (delay = 120) => {
  if (!step1Ready.value) {
    return;
  }
  if (step2Timeout) {
    clearTimeout(step2Timeout);
  }
  step2Ready.value = false;
  step2Timeout = setTimeout(async () => {
    await nextTick();
    runStep2Pipeline();
  }, delay);
};

const runStep2Pipeline = () => {
  const sourceCanvas = step1Canvas.value;
  const outputCanvas = step2Canvas.value;
  if (!sourceCanvas || !outputCanvas) {
    return;
  }
  isStep2Processing.value = true;
  step2Error.value = null;
  try {
    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = targetResolution.width;
    bufferCanvas.height = targetResolution.height;
    const bufferContext = bufferCanvas.getContext('2d');
    if (!bufferContext) {
      throw new Error('เบราว์เซอร์ไม่รองรับการประมวลผล canvas');
    }
    bufferContext.imageSmoothingEnabled = false;
    const { sx, sy, sWidth, sHeight } = computeCropRectangle(
      sourceCanvas.width,
      sourceCanvas.height,
      targetResolution.width,
      targetResolution.height
    );
    bufferContext.drawImage(
      sourceCanvas,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      bufferCanvas.width,
      bufferCanvas.height
    );
    let pixelArray = getPixelArrayFromCanvas(bufferCanvas);
    pixelArray = applyHSVAdjustment(pixelArray, hsvControls.hue, hsvControls.saturation / 100, hsvControls.value / 100);
    pixelArray = applyBrightnessAdjustment(pixelArray, hsvControls.brightness);
    pixelArray = applyContrastAdjustment(pixelArray, hsvControls.contrast);
    outputCanvas.width = bufferCanvas.width;
    outputCanvas.height = bufferCanvas.height;
    drawPixelsOnCanvas(pixelArray, outputCanvas);
    const upscaledCanvas = step2UpscaledCanvas.value;
    if (upscaledCanvas) {
      upscaledCanvas.width = targetResolution.width * SCALING_FACTOR;
      upscaledCanvas.height = targetResolution.height * SCALING_FACTOR;
      const upscaledContext = upscaledCanvas.getContext('2d');
      if (upscaledContext) {
        upscaledContext.imageSmoothingEnabled = false;
        upscaledContext.clearRect(0, 0, upscaledCanvas.width, upscaledCanvas.height);
        upscaledContext.drawImage(
          outputCanvas,
          0,
          0,
          outputCanvas.width,
          outputCanvas.height,
          0,
          0,
          upscaledCanvas.width,
          upscaledCanvas.height
        );
        step2Ready.value = true;
      }
    }
  } catch (error) {
    step2Error.value = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดขณะสร้าง Step 2';
  } finally {
    isStep2Processing.value = false;
  }
};

watch(
  () => [targetResolution.width, targetResolution.height],
  ([width, height]) => {
    const clampedWidth = clampResolutionValue(width);
    const clampedHeight = clampResolutionValue(height);
    if (clampedWidth !== width) {
      targetResolution.width = clampedWidth;
    }
    if (clampedHeight !== height) {
      targetResolution.height = clampedHeight;
    }
    scheduleStep2Processing();
  }
);

watch(
  () => [hsvControls.hue, hsvControls.saturation, hsvControls.value, hsvControls.brightness, hsvControls.contrast],
  () => {
    scheduleStep2Processing();
  }
);
</script>

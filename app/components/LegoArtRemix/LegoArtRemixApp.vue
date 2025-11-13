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

    <!-- <div class="grid gap-6 lg:grid-cols-2">
      <article
        class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
      >
        <h2 class="text-xl font-semibold text-slate-900">เลือกชุด Lego Art</h2>
        <p class="text-sm text-slate-500">
          ข้อมูลทั้งหมดมาจาก stud map ดั้งเดิม
        </p>
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
              {{ formatNumber(totalStudCount(entry.studMap)) }} ชิ้น /
              {{ entry.sortedStuds.length }} สี
            </p>
          </button>
        </div>
      </article>

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
    </div> -->

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

      <div class="grid gap-6 lg:grid-cols-3">
        <article
          class="space-y-4 rounded-xl border border-slate-100 bg-white/80 p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Step 1 – เตรียมและครอปภาพ
              </h3>
              <p class="text-sm text-slate-500">
                แปลงเป็น {{ SERIALIZE_EDGE_LENGTH }} ×
                {{ SERIALIZE_EDGE_LENGTH }} px
              </p>
            </div>
            <span
              style="min-width: 64px;"
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >Step 1</span
            >
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileChange"
          />
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
              type="button"
              @click="triggerFilePicker"
            >
              เลือกไฟล์ภาพ
            </button>
            <p class="text-xs text-slate-500">
              รองรับไฟล์ JPG/PNG สูงสุด ~10MB (ประมวลผลบน browser เท่านั้น)
            </p>
          </div>
          <p v-if="uploadError" class="text-sm text-rose-600">
            {{ uploadError }}
          </p>

          <div v-show="uploadedImage" class="space-y-2 text-sm text-slate-600">
            <p>
              พรีวิวหลัง normalize ({{ SERIALIZE_EDGE_LENGTH }} ×
              {{ SERIALIZE_EDGE_LENGTH }} px)
            </p>
            <div
              ref="cropPreviewContainer"
              class="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-black/5"
            >
              <canvas ref="step1Canvas" class="w-full"></canvas>
              <div
                v-show="step1Ready"
                class="absolute cursor-move rounded-lg border-2 border-white/90 bg-white/5"
                :style="cropOverlayStyle"
                @pointerdown.prevent="beginCropInteraction($event, 'move')"
              >
                <div
                  class="pointer-events-none absolute inset-0 rounded-md"
                  style="box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35)"
                ></div>
                <div
                  class="pointer-events-auto absolute top-1/2 -left-3 h-4 w-4 -translate-y-1/2 rounded-full border border-white bg-indigo-500 cursor-ew-resize"
                  @pointerdown.stop.prevent="beginCropInteraction($event, 'resize-left')"
                ></div>
                <div
                  class="pointer-events-auto absolute top-1/2 -right-3 h-4 w-4 -translate-y-1/2 rounded-full border border-white bg-indigo-500 cursor-ew-resize"
                  @pointerdown.stop.prevent="beginCropInteraction($event, 'resize-right')"
                ></div>
              </div>
            </div>
            <p v-if="imageDimensions" class="text-xs text-slate-500">
              ขนาดต้นฉบับ {{ imageDimensions.width }} ×
              {{ imageDimensions.height }} px
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-sm text-slate-600"
              >ความกว้าง (stud)
              <input
                type="range"
                :min="RESOLUTION_MIN"
                :max="RESOLUTION_MAX"
                :step="RESOLUTION_STEP"
                class="mt-2 w-full"
                :value="targetResolution.width"
                @input="handleResolutionInput('width', $event)"
              />
              <span class="text-xs text-slate-500"
                >{{ targetResolution.width }} stud</span
              >
            </label>
            <label class="text-sm text-slate-600"
              >ความสูง (stud)
              <input
                type="range"
                :min="RESOLUTION_MIN"
                :max="RESOLUTION_MAX"
                :step="RESOLUTION_STEP"
                class="mt-2 w-full"
                :value="targetResolution.height"
                @input="handleResolutionInput('height', $event)"
              />
              <span class="text-xs text-slate-500"
                >{{ targetResolution.height }} stud</span
              >
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
              style="min-width: 64px;"
              class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800"
              >Step 2</span
            >
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
        </article>

        <article
          class="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Step 3 – ลดสีให้ตรงกับชุด Lego
              </h3>
              <p class="text-sm text-slate-500">
                ใช้พาเลตสีทั้งหมดของ BrickLink เพื่อลดจำนวนสีและเตรียมข้อมูล stud (ไม่จำกัดสต็อก)
              </p>
            </div>
            <span
              style="min-width: 64px;"
              class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
              >Step 3</span
            >
          </div>
          <p class="text-sm text-rose-600" v-if="step3Error">
            {{ step3Error }}
          </p>

          <div class="space-y-3">
            <canvas ref="step3Canvas" class="hidden"></canvas>
            <canvas
              ref="step3UpscaledCanvas"
              class="w-full rounded-xl border border-emerald-200"
              style="image-rendering: pixelated; width: 100%; height: auto"
              v-show="step3Ready"
            ></canvas>
            <p class="text-xs text-slate-500" v-if="step3Ready">
              ความละเอียด {{ targetResolution.width }} ×
              {{ targetResolution.height }} stud | Quantization error:
              {{ step3QuantizationError?.toFixed(3) ?? '0.000' }}
            </p>
            <p v-else class="text-xs text-slate-500">
              สร้าง Step 2 ให้เสร็จและเลือกชุด Lego เพื่อคำนวณผลลดสี
            </p>

            <div
              v-if="step3Ready"
              class="space-y-2 text-sm text-slate-600 max-h-48 overflow-y-auto"
            >
              <p class="font-semibold text-slate-800">
                สีที่ใช้ ({{ step3StudUsage.length }})
              </p>
              <div class="grid gap-2 sm:grid-cols-2">
                <div
                  v-for="usage in step3StudUsage"
                  :key="usage.hex"
                  class="flex items-center justify-between rounded-lg border border-white/40 bg-white/60 px-3 py-2"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="h-5 w-5 rounded-full border border-slate-200"
                      :style="{ backgroundColor: usage.hex }"
                    ></span>
                    <span
                      class="text-xs font-semibold text-slate-700"
                      >{{ usage.hex }}</span
                    >
                  </div>
                  <span class="text-xs text-slate-500"
                    >× {{ usage.count }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { studMaps, type StudMapId } from '~/lib/legoArtRemix/studMaps';
import {
  getPixelArrayFromCanvas,
  drawPixelsOnCanvas,
  applyHSVAdjustment,
  applyBrightnessAdjustment,
  applyContrastAdjustment,
  alignPixelsToStudMap,
  getAverageQuantizationError,
  getUsedPixelsStudMap,
  drawStudImageOnCanvas
} from '~/lib/legoArtRemix/algo';
import {
  HEX_TO_COLOR_NAME,
  PIXEL_TYPE_OPTIONS,
  ALL_BRICKLINK_SOLID_COLORS
} from '~/lib/legoArtRemix/bricklinkColors';

const studMapEntries = reactive(studMaps);
const availableSetIds = Object.keys(studMapEntries) as StudMapId[];
const selectedSetId = ref<StudMapId>(availableSetIds[0]);

const fileInputRef = ref<HTMLInputElement | null>(null);
const cropPreviewContainer = ref<HTMLDivElement | null>(null);
const step1Canvas = ref<HTMLCanvasElement | null>(null);
const step2Canvas = ref<HTMLCanvasElement | null>(null);
const step2UpscaledCanvas = ref<HTMLCanvasElement | null>(null);
const step3Canvas = ref<HTMLCanvasElement | null>(null);
const step3UpscaledCanvas = ref<HTMLCanvasElement | null>(null);
const uploadedImage = ref<string | null>(null);
const imageDimensions = ref<{ width: number; height: number } | null>(null);
const uploadError = ref<string | null>(null);
const isProcessing = ref(false);
const isStep2Processing = ref(false);
const step2Error = ref<string | null>(null);
const step1Ready = ref(false);
const step2Ready = ref(false);
const step3Ready = ref(false);
const step3Error = ref<string | null>(null);
const step3QuantizationError = ref<number | null>(null);
const step3StudUsage = ref<Array<{ hex: string; count: number }>>([]);
const step2PixelData = ref<Uint8ClampedArray | null>(null);

const SERIALIZE_EDGE_LENGTH = 512;
const RESOLUTION_MIN = 32;
const RESOLUTION_MAX = 128;
const RESOLUTION_STEP = 16;
const SCALING_FACTOR = 30;

const totalStudCount = (studMap: Record<string, number>) =>
  Object.values(studMap).reduce((sum, count) => sum + count, 0);

const formatNumber = (value: number) => new Intl.NumberFormat('th-TH').format(value);

const colorName = (hex: string) => HEX_TO_COLOR_NAME[hex.toLowerCase()];

const MIN_CROP_FRACTION = Math.max(RESOLUTION_MIN / SERIALIZE_EDGE_LENGTH, 0.05);

const pivotRgbToLinear = (value: number) => {
  const channel = value / 255;
  return channel > 0.04045 ? Math.pow((channel + 0.055) / 1.055, 2.4) : channel / 12.92;
};

const rgbToLab = (rgb: number[]) => {
  const [r, g, b] = rgb.map((channel) => pivotRgbToLinear(channel));
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  const refX = 0.95047;
  const refY = 1.0;
  const refZ = 1.08883;

  const fx = x / refX;
  const fy = y / refY;
  const fz = z / refZ;

  const epsilon = 216 / 24389;
  const kappa = 24389 / 27;

  const pivot = (t: number) => (t > epsilon ? Math.pow(t, 1 / 3) : (kappa * t + 16) / 116);

  const fxCube = pivot(fx);
  const fyCube = pivot(fy);
  const fzCube = pivot(fz);

  const L = 116 * fyCube - 16;
  const a = 500 * (fxCube - fyCube);
  const bLab = 200 * (fyCube - fzCube);
  return [L, a, bLab];
};

const ciede2000ColorDistance = (rgb1: number[] | Uint8ClampedArray, rgb2: number[] | Uint8ClampedArray) => {
  const lab1 = rgbToLab(Array.from(rgb1.slice(0, 3)));
  const lab2 = rgbToLab(Array.from(rgb2.slice(0, 3)));

  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const avgLp = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;

  const h1p = Math.atan2(b1, a1p) + (Math.atan2(b1, a1p) < 0 ? 2 * Math.PI : 0);
  const h2p = Math.atan2(b2, a2p) + (Math.atan2(b2, a2p) < 0 ? 2 * Math.PI : 0);

  let deltahp = h2p - h1p;
  if (C1p * C2p === 0) {
    deltahp = 0;
  } else if (Math.abs(h2p - h1p) > Math.PI) {
    deltahp += h2p <= h1p ? 2 * Math.PI : -2 * Math.PI;
  }

  const deltaLp = L2 - L1;
  const deltaCp = C2p - C1p;
  const deltaHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deltahp / 2);

  let avgHp = h1p + h2p;
  if (C1p * C2p === 0) {
    avgHp = h1p + h2p;
  } else if (Math.abs(h1p - h2p) > Math.PI) {
    avgHp += 2 * Math.PI * (h1p + h2p < 2 * Math.PI ? 0 : -1);
  }
  avgHp /= 2;

  const T =
    1 -
    0.17 * Math.cos(avgHp - Math.PI / 6) +
    0.24 * Math.cos(2 * avgHp) +
    0.32 * Math.cos(3 * avgHp + Math.PI / 30) -
    0.2 * Math.cos(4 * avgHp - (63 * Math.PI) / 180);

  const deltaTheta = (30 * Math.PI) / 180 * Math.exp(-Math.pow((avgHp * 180) / Math.PI - 275, 2) / 3600);
  const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const Sl = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;
  const Rt = -Math.sin(2 * deltaTheta) * Rc;

  const deltaE = Math.sqrt(
    Math.pow(deltaLp / Sl, 2) +
      Math.pow(deltaCp / Sc, 2) +
      Math.pow(deltaHp / Sh, 2) +
      Rt * (deltaCp / Sc) * (deltaHp / Sh)
  );
  return deltaE;
};

const targetResolution = reactive({
  width: 64,
  height: 64
});

const cropRect = reactive({
  left: 0,
  top: 0,
  width: 1,
  height: 1
});

const cropOverlayStyle = computed(() => ({
  width: `${cropRect.width * 100}%`,
  height: `${cropRect.height * 100}%`,
  left: `${cropRect.left * 100}%`,
  top: `${cropRect.top * 100}%`,
  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)'
}));

type CropInteractionType = 'move' | 'resize-left' | 'resize-right';

const cropInteraction = reactive({
  active: false,
  type: null as CropInteractionType | null,
  startX: 0,
  startY: 0,
  containerWidth: 1,
  containerHeight: 1,
  rectSnapshot: {
    left: 0,
    top: 0,
    width: 1,
    height: 1
  }
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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getCanvasDimensions = () => {
  const width = step1Canvas.value?.width ?? SERIALIZE_EDGE_LENGTH;
  const height = step1Canvas.value?.height ?? SERIALIZE_EDGE_LENGTH;
  return { canvasWidth: width, canvasHeight: height };
};

const getAspectRatio = () => {
  const width = Math.max(targetResolution.width, 1);
  const height = Math.max(targetResolution.height, 1);
  return width / height;
};

const syncCropRectToAspect = () => {
  const aspect = getAspectRatio();
  let width = clamp(cropRect.width, MIN_CROP_FRACTION, 1);
  const { canvasWidth, canvasHeight } = getCanvasDimensions();
  let height = (width * canvasWidth) / (aspect * canvasHeight || 1);
  if (height > 1) {
    height = 1;
    width = Math.min((height * aspect * canvasHeight) / (canvasWidth || 1), 1);
  }
  const centerX = cropRect.left + cropRect.width / 2;
  const centerY = cropRect.top + cropRect.height / 2;
  cropRect.width = width;
  cropRect.height = Math.max(height, MIN_CROP_FRACTION);
  cropRect.left = clamp(centerX - cropRect.width / 2, 0, 1 - cropRect.width);
  cropRect.top = clamp(centerY - cropRect.height / 2, 0, 1 - cropRect.height);
};

const beginCropInteraction = (event: PointerEvent, type: CropInteractionType) => {
  if (!step1Ready.value) {
    return;
  }
  const container = cropPreviewContainer.value;
  if (!container) {
    return;
  }
  event.preventDefault();
  const bounds = container.getBoundingClientRect();
  cropInteraction.active = true;
  cropInteraction.type = type;
  cropInteraction.startX = event.clientX;
  cropInteraction.startY = event.clientY;
  cropInteraction.containerWidth = bounds.width || 1;
  cropInteraction.containerHeight = bounds.height || 1;
  cropInteraction.rectSnapshot = { ...cropRect };
  window.addEventListener('pointermove', handleCropPointerMove);
  window.addEventListener('pointerup', endCropInteraction);
};

const handleCropPointerMove = (event: PointerEvent) => {
  if (!cropInteraction.active || cropInteraction.type == null) {
    return;
  }
  const deltaX = (event.clientX - cropInteraction.startX) / cropInteraction.containerWidth;
  const deltaY = (event.clientY - cropInteraction.startY) / cropInteraction.containerHeight;
  const aspect = getAspectRatio();
  const { canvasWidth, canvasHeight } = getCanvasDimensions();

  if (cropInteraction.type === 'move') {
    const newLeft = clamp(cropInteraction.rectSnapshot.left + deltaX, 0, 1 - cropInteraction.rectSnapshot.width);
    const newTop = clamp(cropInteraction.rectSnapshot.top + deltaY, 0, 1 - cropInteraction.rectSnapshot.height);
    cropRect.left = newLeft;
    cropRect.top = newTop;
    cropRect.width = cropInteraction.rectSnapshot.width;
    cropRect.height = cropInteraction.rectSnapshot.height;
  } else {
    const leftEdge = cropInteraction.rectSnapshot.left;
    const rightEdge = cropInteraction.rectSnapshot.left + cropInteraction.rectSnapshot.width;
    const centerY = cropInteraction.rectSnapshot.top + cropInteraction.rectSnapshot.height / 2;
    let width =
      cropInteraction.type === 'resize-right'
        ? cropInteraction.rectSnapshot.width + deltaX
        : cropInteraction.rectSnapshot.width - deltaX;
    width = clamp(width, MIN_CROP_FRACTION, 1);
    let height = (width * canvasWidth) / (aspect * canvasHeight || 1);
    if (height > 1) {
      height = 1;
      width = Math.min((height * aspect * canvasHeight) / (canvasWidth || 1), 1);
    }
    if (cropInteraction.type === 'resize-right') {
      cropRect.left = clamp(leftEdge, 0, 1 - width);
    } else {
      cropRect.left = clamp(rightEdge - width, 0, 1 - width);
    }
    cropRect.width = width;
    cropRect.height = height;
    cropRect.top = clamp(centerY - height / 2, 0, 1 - height);
  }
  scheduleStep2Processing(80);
};

const endCropInteraction = () => {
  if (!cropInteraction.active) {
    return;
  }
  cropInteraction.active = false;
  cropInteraction.type = null;
  window.removeEventListener('pointermove', handleCropPointerMove);
  window.removeEventListener('pointerup', endCropInteraction);
};

onBeforeUnmount(() => {
  endCropInteraction();
});

const triggerFilePicker = () => {
  uploadError.value = null;
  fileInputRef.value?.click();
};

const resetWorkflowState = () => {
  step1Ready.value = false;
  step2Ready.value = false;
  step3Ready.value = false;
  step2Error.value = null;
  step3Error.value = null;
  isStep2Processing.value = false;
  step3QuantizationError.value = null;
  step3StudUsage.value = [];
  step2PixelData.value = null;
  cropRect.left = 0;
  cropRect.top = 0;
  cropRect.width = 1;
  cropRect.height = 1;
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
    cropRect.left = 0;
    cropRect.top = 0;
    cropRect.width = 1;
    cropRect.height = 1;
    syncCropRectToAspect();
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
  step3Ready.value = false;
  step3Error.value = null;
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
    const sx = Math.round(cropRect.left * sourceCanvas.width);
    const sy = Math.round(cropRect.top * sourceCanvas.height);
    const sWidth = Math.round(cropRect.width * sourceCanvas.width);
    const sHeight = Math.round(cropRect.height * sourceCanvas.height);
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
    step2PixelData.value = Uint8ClampedArray.from(pixelArray);
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
    runStep3Pipeline();
  } catch (error) {
    step2Error.value = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดขณะสร้าง Step 2';
  } finally {
    isStep2Processing.value = false;
  }
};

const runStep3Pipeline = () => {
  if (!step2Ready.value || step2PixelData.value == null) {
    step3Ready.value = false;
    return;
  }
  const baseStudMap = ALL_BRICKLINK_SOLID_COLORS.reduce((acc, color) => {
    acc[color.hex] = Number.MAX_SAFE_INTEGER;
    return acc;
  }, {} as Record<string, number>);
  try {
    const originalPixels = Array.from(step2PixelData.value);
    const alignedPixels = alignPixelsToStudMap(originalPixels, baseStudMap, ciede2000ColorDistance);
    const quantPixels = Uint8ClampedArray.from(alignedPixels);

    const step3BaseCanvas = step3Canvas.value;
    const step3Upscaled = step3UpscaledCanvas.value;
    if (!step3BaseCanvas || !step3Upscaled) {
      throw new Error('ไม่พบ canvas สำหรับแสดงผล Step 3');
    }
    step3BaseCanvas.width = targetResolution.width;
    step3BaseCanvas.height = targetResolution.height;
    drawPixelsOnCanvas(quantPixels, step3BaseCanvas);

    drawStudImageOnCanvas(
      quantPixels,
      targetResolution.width,
      SCALING_FACTOR,
      step3Upscaled,
      PIXEL_TYPE_OPTIONS[0].number
    );

    step3QuantizationError.value = getAverageQuantizationError(
      Array.from(step2PixelData.value),
      alignedPixels,
      ciede2000ColorDistance
    );
    const usageMap = getUsedPixelsStudMap(quantPixels);
    step3StudUsage.value = Object.entries(usageMap)
      .map(([hex, count]) => ({ hex, count }))
      .sort((a, b) => b.count - a.count);

    step3Error.value = null;
    step3Ready.value = true;
  } catch (err) {
    step3Ready.value = false;
    step3Error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดใน Step 3';
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
    syncCropRectToAspect();
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

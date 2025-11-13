<template>
  <section>
    <section
      class="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
    >
      <div v-if="isPreviewFrameLoading" class="loading-bar" aria-live="polite">
        <div class="loading-bar__track">
          <div class="loading-bar__fill"></div>
        </div>
      </div>
      <div v-else style="height: 14px;"></div>

      <div class="grid gap-6 lg:grid-cols-3">
        <article class=" rounded-xl border border-slate-100 bg-white/80 p-4">
          <div v-show="uploadedImage" class="text-sm text-slate-600 mb-4">
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
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Step 1 – เตรียมและครอปภาพ
              </h3>
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
          <div class="gap-3 mt-4">
            <button
              class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
              type="button"
              @click="triggerFilePicker"
            >
              เลือกไฟล์ภาพ
            </button>
            <p class="text-xs text-slate-500 mt-2">
              * รองรับไฟล์ JPG/PNG สูงสุด ~10MB
            </p>
          </div>
          <p v-if="uploadError" class="text-sm text-rose-600">
            {{ uploadError }}
          </p>

          <div class="grid gap-3 sm:grid-cols-2 mt-4">
            <label class="text-sm text-slate-600"
              >ความกว้าง
              <input
                type="range"
                :min="RESOLUTION_MIN"
                :max="RESOLUTION_MAX"
                :step="RESOLUTION_STEP"
                class="mt-2 w-full"
                :value="targetResolution.width"
                :disabled="isPreviewFrameLoading"
                @input="handleResolutionInput('width', $event)"
              />
              <span class="text-xs text-slate-500"
                >{{ targetResolution.width }} pixel</span
              >
            </label>
            <label class="text-sm text-slate-600"
              >ความสูง
              <input
                type="range"
                :min="RESOLUTION_MIN"
                :max="RESOLUTION_MAX"
                :step="RESOLUTION_STEP"
                class="mt-2 w-full"
                :value="targetResolution.height"
                :disabled="isPreviewFrameLoading"
                @input="handleResolutionInput('height', $event)"
              />
              <span class="text-xs text-slate-500"
                >{{ targetResolution.height }} pixel</span
              >
            </label>
          </div>
        </article>

        <article
          class="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4"
        >
          <!-- <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span
              v-if="isStep2Processing"
              class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-slate-600 shadow-inner"
            >
              <span
                class="h-2 w-2 animate-ping rounded-full bg-indigo-500"
              ></span>
              กำลังอัปเดตพรีวิว...
            </span>
          </div> -->

          <p v-if="step2Error" class="text-sm text-rose-600">
            {{ step2Error }}
          </p>

          <canvas ref="step2Canvas" class="hidden"></canvas>
          <canvas
            v-show="step2Ready"
            ref="step2UpscaledCanvas"
            class="w-full rounded-xl border border-indigo-200 mb-4"
            style="image-rendering: pixelated; width: 100%; height: auto"
          ></canvas>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Step 2 – ปรับโทนภาพ
              </h3>
            </div>
            <span
              style="min-width: 64px;"
              class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800"
              >Step 2</span
            >
          </div>
          <p v-if="step2Ready" class="text-xs text-slate-500">
            ความละเอียดปัจจุบัน {{ targetResolution.width }} ×
            {{ targetResolution.height }} Pixel (อัตราขยาย ×{{ SCALING_FACTOR}})
          </p>

          <div class="mt-4">
            <div class="grid gap-3 md:grid-cols-3">
              <label class="text-sm text-slate-600"
                >Hue (°)
                <input
                  type="range"
                  min="-180"
                  max="180"
                  :value="hsvControls.hue"
                  class="mt-1 w-full"
                  :disabled="isPreviewFrameLoading"
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
                  :disabled="isPreviewFrameLoading"
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
                  :disabled="isPreviewFrameLoading"
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
                  :disabled="isPreviewFrameLoading"
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
                  :disabled="isPreviewFrameLoading"
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
          class="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
        >
          <!-- <label class="text-sm text-slate-600"
            >ชนิด stud ที่ต้องการ
            <select
              class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              v-model="selectedPixelType"
              :disabled="isPreviewFrameLoading"
            >
              <option
                v-for="option in PIXEL_TYPE_OPTIONS"
                :key="option.number"
                :value="option.number"
              >
                {{ option.name }}
              </option>
            </select>
          </label> -->

          <div>
            <canvas ref="step3Canvas" class="hidden"></canvas>
            <canvas
              ref="step3UpscaledCanvas"
              class="w-full rounded-xl border border-emerald-200 mb-4"
              style="image-rendering: pixelated; width: 100%; height: auto"
              v-show="step3Ready"
            ></canvas>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  Step 3 – ตัวอย่างภาพตัวต่อ
                </h3>
              </div>
              <span
                style="min-width: 64px;"
                class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                >Step 3</span
              >
            </div>
            <p
              class="text-xs text-slate-500"
              v-if="step3Ready && !isStep2Processing"
            >
              ความละเอียด {{ targetResolution.width }} ×
              {{ targetResolution.height }} Pixel | Quantization error:
              {{ step3QuantizationError?.toFixed(3) ?? '0.000' }}
            </p>
            <p
              v-else-if="step3Ready && isStep2Processing"
              class="text-xs text-indigo-500"
            >
              กำลังอัปเดตผลลัพธ์…
            </p>
            <p v-else class="text-xs text-slate-500">
              สร้าง Step 2 ให้เสร็จก่อนจึงจะแสดงตัวอย่าง Step 3 ได้
            </p>

            <div
              v-if="step3Ready"
              class="text-sm text-slate-600 max-h-48 overflow-y-auto"
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
                    <div class="flex flex-col leading-tight">
                      <span class="text-xs font-semibold text-slate-700">
                        {{ usage.name ?? usage.hex }}
                      </span>
                      <span class="text-[10px] uppercase text-slate-400">
                        {{ usage.hex }}
                      </span>
                    </div>
                  </div>
                  <span class="text-xs text-slate-500"
                    >× {{ usage.count }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <p class="text-sm text-rose-600" v-if="step3Error">
            {{ step3Error }}
          </p>
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
const step3StudUsage = ref<Array<{ hex: string; name?: string; count: number }>>([]);
const step2PixelData = ref<Uint8ClampedArray | null>(null);

const SERIALIZE_EDGE_LENGTH = 512;
const RESOLUTION_MIN = 32;
const RESOLUTION_MAX = 128;
const RESOLUTION_STEP = 16;
const SCALING_FACTOR = 30;

const totalStudCount = (studMap: Record<string, number>) =>
  Object.values(studMap).reduce((sum, count) => sum + count, 0);

const formatNumber = (value: number) => new Intl.NumberFormat('th-TH').format(value);

const colorName = (hex: string) => HEX_TO_COLOR_NAME[hex.toLowerCase()] ?? HEX_TO_COLOR_NAME[hex];

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
const selectedPixelType = ref(PIXEL_TYPE_OPTIONS[0].number);
const isPreviewFrameLoading = computed(
  () =>
    step1Ready.value &&
    (isStep2Processing.value || (step2Ready.value && !step3Ready.value && !step3Error.value))
);

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
  // อย่าประมวลผลระหว่างลาก เพื่อลดอาการค้าง
};

const endCropInteraction = () => {
  if (!cropInteraction.active) {
    return;
  }
  cropInteraction.active = false;
  cropInteraction.type = null;
  window.removeEventListener('pointermove', handleCropPointerMove);
  window.removeEventListener('pointerup', endCropInteraction);
  scheduleStep2Processing(80);
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
  isStep2Processing.value = true;
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
      selectedPixelType.value
    );

    step3QuantizationError.value = getAverageQuantizationError(
      Array.from(step2PixelData.value),
      alignedPixels,
      ciede2000ColorDistance
    );
    const usageMap = getUsedPixelsStudMap(quantPixels);
    step3StudUsage.value = Object.entries(usageMap)
      .map(([hex, count]) => ({ hex, count, name: colorName(hex) ?? hex }))
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

watch(selectedPixelType, () => {
  if (step2Ready.value) {
    runStep3Pipeline();
  }
});
</script>

<style scoped>
.preview-frame {
  position: relative;
  border-radius: 0.75rem;
  border: 2px solid rgba(15, 23, 42, 0.15);
  padding: 0.5rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease;
}
.loading-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0.5rem;
}
.loading-bar__track {
  position: relative;
  flex: 1;
  height: 6px;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.15);
  overflow: hidden;
}
.loading-bar__fill {
  position: absolute;
  inset: 0;
  width: 40%;
  background: #4338ca;
  border-radius: inherit;
  animation: loading-bar-slide 1s linear infinite;
}
.loading-bar__text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4338ca;
}

@keyframes loading-bar-slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
</style>

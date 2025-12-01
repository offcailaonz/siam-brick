<template>
  <section>
    <section
      class="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
    >
      <div class="text-end">
        <button
          v-if="props.showGenerateAction && step3Ready"
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-emerald-700"
          @click="emitGenerated"
        >
          {{ props.generateLabel }}
        </button>
      </div>
      <article
        v-if="props.showStep4"
        class="rounded-xl border border-amber-100 bg-amber-50/70 p-4 lg:col-span-3"
      >
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">
              ชำระเงินเพื่อรับอุปกรณ์ครบเซต
            </h3>
            <p class="text-xs text-slate-600">
              ขนาด {{ targetResolution.width }} ×
              {{ targetResolution.height }} pixel
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <div class="my-auto ml-auto text-right">
              <p
                v-if="formatPriceLoading"
                class="text-sm font-semibold text-amber-700 inline-flex items-center gap-2"
              >
                <span
                  class="h-2 w-2 animate-ping rounded-full bg-amber-500"
                ></span>
                กำลังคำนวณ...
              </p>
              <p
                v-else-if="formatPrice != null"
                class="text-2xl font-black text-amber-700 leading-tight"
              >
                {{ formatCurrency(formatPrice) }}
              </p>
              <p
                v-else-if="formatPriceError"
                class="text-sm font-semibold text-rose-600"
              >
                {{ formatPriceError }}
              </p>
              <p v-else class="text-sm font-semibold text-slate-600"></p>
            </div>
            <button
              class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
              :disabled="!step3Ready || isStep2Processing || isCreatingCheckoutOrder"
              @click="goToCheckout"
            >
              <span v-if="isCreatingCheckoutOrder">กำลังสร้างออเดอร์...</span>
              <span v-else>ชำระเงิน เพื่อรับชุดเต็ม</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.75.75 0 0 1 .75-.75h10.638L9.23 4.09a.75.75 0 1 1 1.04-1.08l4.25 4.1a.75.75 0 0 1 0 1.08l-4.25 4.1a.75.75 0 0 1-1.04-1.08l3.158-3.16H1.75A.75.75 0 0 1 1 8"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>
      <div class="grid gap-6 lg:grid-cols-3 mt-3">
        <article class=" rounded-xl border border-slate-100 bg-white/80 p-4">
          <div class="text-sm text-slate-600 mb-4">
            <div class="preview-square border border-slate-200 bg-black">
              <div ref="cropPreviewContainer" class="preview-media-container">
                <canvas ref="step1Canvas" class="preview-media"></canvas>
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
            </div>
            <!-- <p v-if="imageDimensions" class="text-xs text-slate-500">
              ขนาดต้นฉบับ {{ imageDimensions.width }} ×
              {{ imageDimensions.height }} px
            </p> -->
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
          <p class="text-xs text-slate-500">
            * รองรับไฟล์ JPG/PNG สูงสุด ~10MB
          </p>
          <div class="gap-3 mt-3">
            <button
              class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
              type="button"
              @click="triggerFilePicker"
            >
              เลือกไฟล์ภาพ
            </button>
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
                @pointerdown="handleResolutionPointerDown($event)"
                @pointerup="handleControlPointerUp"
                @pointercancel="handleControlPointerUp"
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
                @pointerdown="handleResolutionPointerDown($event)"
                @pointerup="handleControlPointerUp"
                @pointercancel="handleControlPointerUp"
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
          <div class="preview-square border border-indigo-200 mb-4">
            <canvas
              v-show="step2Ready"
              ref="step2UpscaledCanvas"
              class="preview-media"
              :style="{
                imageRendering: 'pixelated'
              }"
            ></canvas>
          </div>
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
          <p class="text-xs text-slate-500">
            ความละเอียดปัจจุบัน {{ targetResolution.width }} ×
            {{ targetResolution.height }} Pixel (อัตราขยาย ×{{ SCALING_FACTOR}})
          </p>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <button
              :disabled="!step2Ready"
              type="button"
              class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
              @click="openEditModal"
            >
              แก้ไขสี
            </button>
            <button
              v-if="hasPixelRemap"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
              @click="clearPixelColorRemap"
            >
              ล้างการ remap สี
            </button>
            <button
              v-if="hasStep2Edits"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              @click="resetStep2Edits"
            >
              ล้างการแก้ไขกลับต้นฉบับ
            </button>
          </div>
          <p v-if="hasPixelRemap" class="text-xs text-indigo-700 mt-1">
            กำลังใช้การ remap สีหลังจากปรับโทน/แก้สีพิกเซล
          </p>

          <div class="mt-3">
            <div class="grid gap-3 md:grid-cols-3">
              <label class="text-sm text-slate-600"
                >Hue (°)
                <input
                  type="range"
                  min="-180"
                  max="180"
                  :value="hsvControls.hue"
                  class="mt-1 w-full"
                  @pointerdown="handleControlPointerDown"
                  @pointerup="handleControlPointerUp"
                  @pointercancel="handleControlPointerUp"
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
                  @pointerdown="handleControlPointerDown"
                  @pointerup="handleControlPointerUp"
                  @pointercancel="handleControlPointerUp"
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
                  @pointerdown="handleControlPointerDown"
                  @pointerup="handleControlPointerUp"
                  @pointercancel="handleControlPointerUp"
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
                  @pointerdown="handleControlPointerDown"
                  @pointerup="handleControlPointerUp"
                  @pointercancel="handleControlPointerUp"
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
                  @pointerdown="handleControlPointerDown"
                  @pointerup="handleControlPointerUp"
                  @pointercancel="handleControlPointerUp"
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
            <div class="preview-square border border-emerald-200 mb-4">
              <canvas
                ref="step3UpscaledCanvas"
                class="preview-media cursor-zoom-in"
                style="image-rendering: pixelated;"
                v-show="step3Ready && !showApiStep3Preview"
                @click="step3Ready ? openPreviewModal() : null"
              ></canvas>
              <img
                v-if="showApiStep3Preview && apiStep3Preview"
                :src="apiStep3Preview || undefined"
                alt="Step 3 preview from order"
                class="preview-media bg-white object-contain cursor-zoom-in"
                @click="openPreviewModal"
              />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  Step 3 – ตัวอย่างภาพตัวต่อ
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                  >Step 3</span
                >
              </div>
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

            <div class="mt-3">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="!step3Ready || isGeneratingPdf || isStep2Processing"
                @click="handleGenerateInstructions"
              >
                <span v-if="isGeneratingPdf">กำลังสร้างไฟล์…</span>
                <span v-else>ดาวน์โหลดตัวอย่าง</span>
              </button>
            </div>
            <div class="flex mt-3">
              <label class="text-sm text-slate-600">
                สีที่ใช้ {{ step3StudUsage.length }} สี | รวม
                {{ formatNumber(step3StudTotal) }} studs
              </label>
            </div>

            <div
              class="text-sm text-slate-600 overflow-y-auto mt-1"
              style="max-height: 100px; height: 100px;"
            >
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
      <div v-if="isPreviewFrameLoading" class="loading-bar" aria-live="polite">
        <div class="loading-bar__track">
          <div class="loading-bar__fill"></div>
        </div>
      </div>
      <div v-else style="height: 14px;">
        <div v-if="isGeneratingPdf">
          <div class="h-2 w-full rounded-full bg-white/60">
            <div
              class="h-2 rounded-full bg-amber-500 transition-all duration-200"
              :style="{ width: pdfProgressPercent + '%' }"
            ></div>
          </div>
          <p class="text-xs font-medium text-amber-900">
            {{ pdfProgressLabel || 'กำลังเตรียมไฟล์...' }}
          </p>
        </div>

        <!-- <p
          v-else-if="pdfError"
          class="text-sm text-rose-600 mt-3"
          style="height: 36px;"
        >
          {{ pdfError }}
        </p>
        <p
          v-else-if="pdfSuccessMessage"
          class="text-sm text-emerald-600 mt-3"
          style="height: 36px;"
        >
          {{ pdfSuccessMessage }}
        </p> -->
      </div>
    </section>
    <p v-if="checkoutOrderError" class="mt-2 text-sm text-rose-600">
      {{ checkoutOrderError }}
    </p>
  </section>

  <Teleport to="body">
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden z-[10000]"
      >
        <div
          class="flex items-start justify-between border-b border-slate-200 px-5 py-4"
        >
          <div>
            <h3 class="text-lg font-semibold text-slate-900">
              แก้ไขสีด้วย Paintbrush/Eraser/Dropper
            </h3>
            <p class="text-xs text-slate-500">
              ขยายภาพเพื่อแตะเลือกพิกเซลได้ง่ายขึ้น
            </p>
          </div>
          <button
            type="button"
            class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200"
            @click="cancelEditModal"
          >
            ปิด
          </button>
        </div>

        <div class="grid gap-4 px-5 py-4 lg:grid-cols-[2fr,1fr]">
          <div class="border border-slate-200 rounded-xl bg-slate-50/60 p-3">
            <canvas
              ref="modalUpscaledCanvas"
              class="w-full rounded-lg border border-slate-200 bg-white"
              style="image-rendering: pixelated; width: 100%; height: auto; min-height: 280px"
              :style="{ imageRendering: 'pixelated', width: '100%', height: 'auto', minHeight: '280px', cursor: paintCursor }"
              @pointerdown.prevent="handleModalPaintPointerDown"
              @pointermove.prevent="handleModalPaintPointerMove"
              @pointerup="handleModalPaintPointerUp"
              @pointerleave="handleModalPaintPointerUp"
            ></canvas>
            <p class="mt-2 text-[11px] text-slate-500">
              คลิก/ลากเพื่อ remap สี, ใช้ Dropper เพื่อเลือกสีจากภาพ แล้วกด
              “บันทึกการ remap สี” เพื่อใช้กับ Step 2 ก่อนเข้าสู่ Step 3
            </p>
          </div>

          <div class="space-y-3">
            <div
              class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <p class="text-xs font-semibold text-slate-700 mb-2">
                เครื่องมือ
              </p>
              <div class="relative mb-2 flex">
                <button
                  v-for="tool in paintToolOptions"
                  :key="tool.value"
                  :class="[
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm rounded-lg border',
                    selectedPaintTool === tool.value
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-400 shadow-inner'
                      : 'hover:bg-indigo-50 border-transparent'
                  ]"
                  type="button"
                  @click="selectPaintTool(tool.value)"
                >
                  <component :is="tool.icon" class="h-4 w-4" />
                  <span>{{ tool.label }}</span>
                </button>
              </div>

              <div class="relative">
                <button
                  class="inline-flex w-full items-center justify-between rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 shadow-sm"
                  type="button"
                  @click="isColorDropdownOpen = !isColorDropdownOpen"
                >
                  <span class="inline-flex items-center gap-2">
                    <span
                      class="h-4 w-4 rounded-sm border border-slate-200"
                      :style="{ backgroundColor: paintColorHex }"
                    ></span>
                    <span
                      class="max-w-[140px] truncate"
                      >{{ paintColorLabel }}</span
                    >
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  v-if="isColorDropdownOpen"
                  class="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                >
                  <button
                    v-for="color in ALL_BRICKLINK_SOLID_COLORS"
                    :key="color.hex"
                    type="button"
                    class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-indigo-50"
                    @click="selectPaintColor(color.hex)"
                  >
                    <span
                      class="h-4 w-4 rounded-sm border border-slate-200"
                      :style="{ backgroundColor: color.hex }"
                    ></span>
                    <span class="truncate">{{ color.name }}</span>
                  </button>
                </div>
              </div>

              <button
                class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                :disabled="!hasModalPixelRemap"
                @click="clearModalRemap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
                  />
                </svg>
                ล้างการ remap สีใน modal
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                class="inline-flex items-center justify-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
                type="button"
                @click="cancelEditModal"
              >
                ยกเลิก
              </button>
              <button
                class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                type="button"
                @click="confirmEditModal"
              >
                บันทึกการ remap สี
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuthFlow, useRouter, useState, useOrders } from '#imports';
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, withDefaults } from 'vue';
import { studMaps, type StudMapId } from '~/lib/brickArtRemix/studMaps';
import {
  getPixelArrayFromCanvas,
  drawPixelsOnCanvas,
  applyHSVAdjustment,
  applyBrightnessAdjustment,
  applyContrastAdjustment,
  alignPixelsToStudMap,
  getAverageQuantizationError,
  getUsedPixelsStudMap,
  drawStudImageOnCanvas,
  generateInstructionTitlePage,
  generateInstructionPage,
  getSubPixelArray,
  replaceSparseColors
} from '~/lib/brickArtRemix/algo';
import {
  HEX_TO_COLOR_NAME,
  PIXEL_TYPE_OPTIONS,
  ALL_BRICKLINK_SOLID_COLORS
} from '~/lib/brickArtRemix/bricklinkColors';
import {
  DEFAULT_PLATE_WIDTH,
  HIGH_DPI,
  LOW_DPI,
  PDF_MARGIN_MM,
  addWatermark,
  setCanvasDpi,
  sleep,
  DEFAULT_WATERMARK
} from '~/lib/brickArtRemix/pdf';

type CropInteractionState = {
  active: boolean;
  type: 'move' | 'resize-left' | 'resize-right' | null;
  startX: number;
  startY: number;
  containerWidth: number;
  containerHeight: number;
  offsetX: number;
  offsetY: number;
  rectSnapshot: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

type HsvState = {
  hue: number;
  saturation: number;
  value: number;
  brightness: number;
  contrast: number;
};

type BrickWorkflowSession = {
  version: 1;
  hasImage: boolean;
  userId: string;
  resolution: { width: number; height: number };
  crop: { left: number; top: number; width: number; height: number };
  hsv: HsvState;
  pixelType: number;
  highQuality: boolean;
  pixelColorRemap?: PixelColorRemap;
};

type StepImageSnapshot = {
  v: 1;
  userId: string;
  step1: string | null;
  step2: string | null;
  step3Base: string | null;
  step3Preview: string | null;
  baseHash?: string | null;
  srcHash?: string | null;
};

type PixelColorReplacement = [number, number, number, number?];
type PixelColorRemap = Record<string, PixelColorReplacement>;
type FormatPriceMeta = {
  amount: number;
  width?: number | null;
  height?: number | null;
  size?: string | null;
};

const props = withDefaults(
  defineProps<{
    initialResolution?: { width?: number; height?: number };
    showStep4?: boolean;
    redirectOnUpload?: string | null;
    defaultImageSrc?: string | null;
    initialCropInteraction?: CropInteractionState | null;
  enablePersistence?: boolean;
  enablePriceFetch?: boolean;
  editingOrderId?: string | number | null;
  initialFormatPrice?: number | null;
  initialStep2Preview?: string | null;
  initialStep3Preview?: string | null;
  initialStep3Base?: string | null;
  showGenerateAction?: boolean;
  generateLabel?: string;
  }>(),
  {
    showStep4: true,
    redirectOnUpload: null,
    defaultImageSrc: null,
  initialCropInteraction: null,
  enablePersistence: false,
  enablePriceFetch: true,
  editingOrderId: null,
  initialFormatPrice: null,
  initialStep2Preview: null,
  initialStep3Preview: null,
  initialStep3Base: null,
  showGenerateAction: false,
  generateLabel: 'ใช้ผลลัพธ์นี้'
  }
);

const emit = defineEmits<{
  (
    e: 'generated',
    payload: {
      preview: string | null;
      studs: number;
      studUsage: Array<{ hex: string; name?: string; count: number }>;
      resolution: { width: number; height: number };
      formatPrice?: number | null;
      formatPriceMeta?: FormatPriceMeta | null;
    }
  ): void;
  (e: 'preview-modal', payload: { src: string | null }): void;
}>();

const router = useRouter();
const { user, requireAuth } = useAuthFlow();
const { recordPendingPaymentOrder, updateOrderAssets } = useOrders();
const supabase = useSupabaseClient();
const currentUserId = computed(() => user.value?.id ?? 'guest');
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
const modalUpscaledCanvas = ref<HTMLCanvasElement | null>(null);
const uploadedImage = ref<string | null>(null);
const imageDimensions = ref<{ width: number; height: number } | null>(null);
const uploadError = ref<string | null>(null);
const isProcessing = ref(false);
const isStep2Processing = ref(false);
const step2Error = ref<string | null>(null);
const step1Ready = ref(false);
const step2Ready = ref(false);
const step3Ready = ref(false);
const useStep2PixelsAsSource = ref(false);
const paintOverrides = ref<Array<number | null> | null>(null);
const pixelColorRemap = ref<PixelColorRemap>({});
const modalPixelColorRemap = ref<PixelColorRemap | null>(null);
const modalBaseStep2Pixels = ref<Uint8ClampedArray | null>(null);
const modalPreviewPixels = ref<Uint8ClampedArray | null>(null);
const step3QuantPixels = ref<Uint8ClampedArray | null>(null); // current edited image
const step3QuantPixelsBase = ref<Uint8ClampedArray | null>(null); // original quantized image from step 2
const step2PreviewForOrder = useState<string | null>('brick-step2-preview', () => null);
const finalStep3Preview = useState<string | null>('brick-final-step3-preview', () => null);
const originalImageForOrder = useState<string | null>('brick-original-image', () => null);
const cropInteractionForOrder = useState<CropInteractionState | null>('brick-crop-interaction', () => null);
const formatPrice = useState<number | null>('brick-format-price', () => null);
const formatPriceLoading = useState<boolean>('brick-format-price-loading', () => false);
const formatPriceError = useState<string | null>('brick-format-price-error', () => null);
const formatPriceMeta = useState<FormatPriceMeta | null>('brick-format-price-meta', () => null);
const skipInitialPriceFetch = ref<boolean>(Boolean(props.editingOrderId && props.initialFormatPrice != null));
const isCreatingCheckoutOrder = ref(false);
const checkoutOrderError = ref<string | null>(null);
const shouldSkipPersistence = computed(() => Boolean(props.editingOrderId || props.defaultImageSrc));
const initialOrderPreviewApplied = ref(false);
const apiStep3Preview = computed(() => props.initialStep3Preview ?? null);
const showApiStep3Preview = ref<boolean>(Boolean(props.editingOrderId && apiStep3Preview.value && !props.initialStep2Preview));
const pendingRestoredStep3Base = ref<string | null>(null);
const restoredStep3Applied = ref(false);
const persistedStep3BaseHash = ref<string | null>(null);
const persistedStep3SourceHash = ref<string | null>(null);
const lastGeneratedStep3BaseHash = ref<string | null>(null);
const lastGeneratedStep3SourceHash = ref<string | null>(null);
const suspendStep3Persistence = ref(false);
const shouldSkipInitialStep2Run = ref(false);
const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `h${hash >>> 0}`;
};
const hashUint8Array = (arr: Uint8Array | Uint8ClampedArray | null) => {
  if (!arr) return null;
  let hash = 0;
  for (let i = 0; i < arr.length; i++) {
    hash = (hash << 5) - hash + arr[i];
    hash |= 0;
  }
  return `a${hash >>> 0}`;
};
const logStep3 = (message: string, data?: Record<string, any>) => {
  console.log('[Step 3 Preview]', message, data ?? '');
};
const clearStepImagesForUser = () => {
  return;
};
const persistStepImages = (payload: Partial<Omit<StepImageSnapshot, 'v' | 'userId'>>) => {
  return;
};
const persistCropForOrder = () => {
  cropInteractionForOrder.value = {
    active: false,
    type: null,
    startX: 0,
    startY: 0,
    containerWidth: cropInteraction.containerWidth,
    containerHeight: cropInteraction.containerHeight,
    rectSnapshot: {
      left: cropRect.left,
      top: cropRect.top,
      width: cropRect.width,
      height: cropRect.height
    }
  };
};

const persistStep2Preview = (preview: string | null) => {
  step2PreviewForOrder.value = preview;
};
const persistFinalStep3Preview = (preview: string | null, baseDataUrl?: string | null, baseSourceHash?: string | null) => {
  logStep3('persistFinalStep3Preview', {
    hasPreview: Boolean(preview),
    hasBase: Boolean(baseDataUrl),
    baseHash: baseSourceHash ?? lastGeneratedStep3SourceHash.value ?? null
  });
  finalStep3Preview.value = preview;
  lastGeneratedStep3BaseHash.value = baseDataUrl ? hashString(baseDataUrl) : null;
  lastGeneratedStep3SourceHash.value = baseSourceHash ?? null;
  persistedStep3BaseHash.value = lastGeneratedStep3BaseHash.value;
  persistedStep3SourceHash.value = lastGeneratedStep3SourceHash.value;
  persistStepImages({});
};
const loadDataUrlToCanvas = async (
  canvas: HTMLCanvasElement | null,
  dataUrl: string | null,
  width?: number,
  height?: number
): Promise<{ pixels: Uint8ClampedArray; width: number; height: number } | null> => {
  if (!canvas || !dataUrl) {
    return null;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const targetWidth = width ?? img.width;
      const targetHeight = height ?? img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      // ปิด smoothing เพื่อไม่ให้สีปนกันเวลาย่อ/ขยายรูปจาก API
      ctx.imageSmoothingEnabled = false;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve({ pixels: getPixelArrayFromCanvas(canvas), width: img.width, height: img.height });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
};
const restoreFromStepImages = async (snapshot: StepImageSnapshot): Promise<boolean> => {
  if (!snapshot.step1 || !snapshot.step2) {
    return false;
  }
  const step1Result = await loadDataUrlToCanvas(step1Canvas.value, snapshot.step1);
  if (!step1Result) {
    return false;
  }
  initialCropApplied.value = true;
  uploadedImage.value = snapshot.step1;
  originalImageForOrder.value = snapshot.step1 ?? null;
  imageDimensions.value = { width: step1Result.width, height: step1Result.height };
  step1Ready.value = true;

  const step2Result = await loadDataUrlToCanvas(
    step2Canvas.value,
    snapshot.step2,
    targetResolution.width,
    targetResolution.height
  );
  if (!step2Result) {
    return false;
  }
  step2PixelData.value = Uint8ClampedArray.from(step2Result.pixels);
  renderUpscaledPreviewToTarget(step2UpscaledCanvas, step2Result.pixels);
  step2Ready.value = true;
  step2Error.value = null;
  useStep2PixelsAsSource.value = true;
  persistStep2Preview(snapshot.step2);

  const hasStep3Base = Boolean(snapshot.step3Base);
  if (hasStep3Base) {
    const step3Result = await loadDataUrlToCanvas(
      step3Canvas.value,
      snapshot.step3Base,
      targetResolution.width,
      targetResolution.height
    );
    if (!step3Result) {
      return false;
    }
    step3QuantPixels.value = Uint8ClampedArray.from(step3Result.pixels);
    step3QuantPixelsBase.value = Uint8ClampedArray.from(step3Result.pixels);
    drawStudImageOnCanvas(
      step3Result.pixels,
      targetResolution.width,
      SCALING_FACTOR,
      step3UpscaledCanvas.value,
      selectedPixelType.value
    );
    const baseHash = snapshot.baseHash ?? hashString(step3Canvas.value?.toDataURL('image/png', 0.92) ?? snapshot.step3Base);
    const srcHash = snapshot.srcHash ?? hashUint8Array(step3Result.pixels);
    persistFinalStep3Preview(
      snapshot.step3Preview ?? step3UpscaledCanvas.value?.toDataURL('image/png', 0.92) ?? null,
      snapshot.step3Base,
      srcHash ?? undefined
    );
    step3QuantizationError.value = getAverageQuantizationError(
      step2PixelData.value ? Array.from(step2PixelData.value) : Array.from(step3Result.pixels),
      Array.from(step3Result.pixels),
      ciede2000ColorDistance
    );
    const usageMap = getUsedPixelsStudMap(step3Result.pixels);
    step3StudUsage.value = Object.entries(usageMap)
      .map(([hex, count]) => ({ hex, count, name: colorName(hex) ?? hex }))
      .sort((a, b) => b.count - a.count);
    if (!userPaintColorTouched.value && step3StudUsage.value.length > 0) {
      paintColorHex.value = step3StudUsage.value[0].hex;
    }
    step3Error.value = null;
    step3Ready.value = true;
    isProcessing.value = false;
    return true;
  }
  step3Error.value = null;
  step3Ready.value = false;
  runStep3Pipeline();
  return true;
};
let applyingRestoredStep3 = false;
const applyRestoredStep3BaseIfNeeded = () => {
  logStep3('applyRestoredStep3BaseIfNeeded: check', {
    pending: Boolean(pendingRestoredStep3Base.value),
    restoredStep3Applied: restoredStep3Applied.value,
    applyingRestoredStep3
  });
  if (!pendingRestoredStep3Base.value || restoredStep3Applied.value || applyingRestoredStep3) {
    if (suspendStep3Persistence.value) {
      suspendStep3Persistence.value = false;
    }
    return;
  }
  if (!step3Canvas.value || !step3UpscaledCanvas.value) {
    return;
  }
  applyingRestoredStep3 = true;
  const dataUrl = pendingRestoredStep3Base.value;
  const isApiStudPreview = !props.initialStep3Base && props.initialStep3Preview === dataUrl;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    logStep3('applyRestoredStep3BaseIfNeeded: loaded image', {
      isApiStudPreview,
      width: img.width,
      height: img.height
    });
    pendingRestoredStep3Base.value = null;
    restoredStep3Applied.value = true;
    applyingRestoredStep3 = false;
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = targetResolution.width;
    baseCanvas.height = targetResolution.height;
    const ctx = baseCanvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
    // ปิด smoothing เพื่อใช้ค่าพิกเซลดิบจาก API preview ไม่ให้สีปน
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, baseCanvas.width, baseCanvas.height);
    const extractedPixels = new Uint8ClampedArray(ctx.getImageData(0, 0, baseCanvas.width, baseCanvas.height).data);
    const quantPixels =
      isApiStudPreview && !isAlreadyStudPalette(extractedPixels)
        ? quantizeToStudPalette(extractedPixels)
        : extractedPixels;
    step3QuantPixels.value = quantPixels;
    step3QuantPixelsBase.value = Uint8ClampedArray.from(quantPixels);
    drawPixelsOnCanvas(quantPixels, step3Canvas.value);
    if (isApiStudPreview) {
      // ถ้า preview จาก API เป็นภาพ stud อยู่แล้ว ให้ใช้ภาพนี้เป็น upscaled preview โดยตรง ไม่ต้องซ้อน stud รอบสอง
      const upCtx = step3UpscaledCanvas.value.getContext('2d');
      if (upCtx) {
        upCtx.imageSmoothingEnabled = false;
        step3UpscaledCanvas.value.width = img.width;
        step3UpscaledCanvas.value.height = img.height;
        upCtx.clearRect(0, 0, img.width, img.height);
        upCtx.drawImage(img, 0, 0, img.width, img.height);
      }
    } else {
      drawStudImageOnCanvas(
        quantPixels,
        targetResolution.width,
        SCALING_FACTOR,
        step3UpscaledCanvas.value,
        selectedPixelType.value
      );
    }
    const basePixelsForError = step2PixelData.value ? Array.from(step2PixelData.value) : Array.from(quantPixels);
    step3QuantizationError.value = getAverageQuantizationError(
      basePixelsForError,
      Array.from(quantPixels),
      ciede2000ColorDistance
    );
    const usageMap = getUsedPixelsStudMap(quantPixels);
    step3StudUsage.value = Object.entries(usageMap)
      .map(([hex, count]) => ({ hex, count, name: colorName(hex) ?? hex }))
      .sort((a, b) => b.count - a.count);
    if (!userPaintColorTouched.value && step3StudUsage.value.length > 0) {
      paintColorHex.value = step3StudUsage.value[0].hex;
    }
    logStep3('applyRestoredStep3BaseIfNeeded: applied', {
      quantizationError: step3QuantizationError.value,
      colorCount: step3StudUsage.value.length
    });
    persistFinalStep3Preview(
      step3UpscaledCanvas.value.toDataURL('image/png', 0.92),
      baseCanvas.toDataURL('image/png', 0.92)
    );
    step3Ready.value = true;
    step3Error.value = null;
    suspendStep3Persistence.value = false;
  };
  img.onerror = () => {
    applyingRestoredStep3 = false;
    restoredStep3Applied.value = true;
    pendingRestoredStep3Base.value = null;
    suspendStep3Persistence.value = false;
  };
  img.src = dataUrl;
};
const selectedPaintTool = ref<PaintTool>('brush');
const isToolDropdownOpen = ref(false);
const isColorDropdownOpen = ref(false);
const isEditModalOpen = ref(false);
const paintColorHex = ref('#42c0fb');
const userPaintColorTouched = ref(false);
const paintInProgress = ref(false);
const modalPaintInProgress = ref(false);
let pendingStep3AfterPaint = false;
const originalBodyOverflow = ref<string | null>(null);
const step3Error = ref<string | null>(null);
const step3QuantizationError = ref<number | null>(null);
const step3StudUsage = ref<Array<{ hex: string; name?: string; count: number }>>([]);
const step2PixelData = ref<Uint8ClampedArray | null>(null);
const isHighQualityColorMode = ref(false);
const lastUploadedInstructionPreview = ref<string | null>(null);
const lastUploadedPdfMeta = ref<Record<string, any> | null>(null);

const SERIALIZE_EDGE_LENGTH = 512;
const RESOLUTION_MIN = 32;
const RESOLUTION_MAX = 128;
const RESOLUTION_STEP = 32;
const SCALING_FACTOR = 30;
const SPARSE_COLOR_THRESHOLD = 10;
const PDF_FILENAME_BASE = 'Siam-Brick-Instructions';
const PDF_STORAGE_BUCKET = 'order-instructions';
const PREVIEW_CLEAR_PAGE_COUNT = 2; // page 1-2 clear; rest blurred
const APP_WATERMARK = {
  ...DEFAULT_WATERMARK,
  title: 'Generated by siam-brick.com',
  version: 'siam-brick preview'
};
const UNLIMITED_STUD_MAP = ALL_BRICKLINK_SOLID_COLORS.reduce((acc, color) => {
  acc[color.hex] = Number.MAX_SAFE_INTEGER;
  return acc;
}, {} as Record<string, number>);
const STUD_COLOR_SET = new Set(ALL_BRICKLINK_SOLID_COLORS.map((c) => c.hex.toLowerCase()));
type PaintTool = 'brush' | 'eraser' | 'dropper';

const quantizeToStudPalette = (pixels: Uint8ClampedArray) => {
  const aligned = alignPixelsToStudMap(Array.from(pixels), UNLIMITED_STUD_MAP, ciede2000ColorDistance);
  return Uint8ClampedArray.from(aligned);
};
const isAlreadyStudPalette = (pixels: Uint8ClampedArray) => {
  for (let i = 0; i < pixels.length; i += 4) {
    const hex = rgbToHex(pixels[i], pixels[i + 1], pixels[i + 2]).toLowerCase();
    if (!STUD_COLOR_SET.has(hex)) {
      return false;
    }
  }
  return true;
};

const PaintbrushIcon = defineComponent({
  name: 'PaintbrushIcon',
  setup: () =>
    () =>
      h(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', fill: 'currentColor', viewBox: '0 0 16 16' },
        [
          h('path', {
            d: 'M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04z'
          })
        ]
      )
});

const EraserIcon = defineComponent({
  name: 'EraserIcon',
  setup: () =>
    () =>
      h(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', fill: 'currentColor', viewBox: '0 0 16 16' },
        [
          h('path', {
            d: 'M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z'
          })
        ]
      )
});

const DropperIcon = defineComponent({
  name: 'DropperIcon',
  setup: () =>
    () =>
      h(
        'svg',
        { xmlns: 'http://www.w3.org/2000/svg', fill: 'currentColor', viewBox: '0 0 16 16' },
        [
          h('path', {
            d: 'M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z'
          })
        ]
      )
});

const paintToolOptions: Array<{ value: PaintTool; label: string; icon: any }> = [
  { value: 'brush', label: 'Paintbrush', icon: PaintbrushIcon },
  { value: 'eraser', label: 'Eraser', icon: EraserIcon },
  { value: 'dropper', label: 'Dropper', icon: DropperIcon }
];

const paintToolLabel = computed(() => paintToolOptions.find((option) => option.value === selectedPaintTool.value)?.label ?? 'Paintbrush');
const paintColorLabel = computed(() => colorName(paintColorHex.value) ?? paintColorHex.value);
const hasPaintOverrides = computed(() => paintOverrides.value?.some((channel) => channel != null) ?? false);
const paintCursor = computed(() => {
  if (selectedPaintTool.value === 'brush') return 'crosshair';
  if (selectedPaintTool.value === 'eraser') return 'not-allowed';
  return 'copy';
});

const useHighQualityPdf = ref(true);
const isGeneratingPdf = ref(false);
const pdfProgress = ref(0);
const pdfProgressLabel = ref('');
const pdfError = ref<string | null>(null);
const pdfSuccessMessage = ref<string | null>(null);

const pdfProgressPercent = computed(() => Math.round(Math.min(1, Math.max(0, pdfProgress.value)) * 100));

const totalStudCount = (studMap: Record<string, number>) =>
  Object.values(studMap).reduce((sum, count) => sum + count, 0);

const formatNumber = (value: number) => new Intl.NumberFormat('th-TH').format(value);
const formatCurrency = (value: number | string | null | undefined) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(num);
};

const colorName = (hex: string) => HEX_TO_COLOR_NAME[hex.toLowerCase()] ?? HEX_TO_COLOR_NAME[hex];

const instructionColorOrder = computed(() => step3StudUsage.value.map((usage) => usage.hex));
const step3StudTotal = computed(() => step3StudUsage.value.reduce((sum, usage) => sum + usage.count, 0));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return [r, g, b] as const;
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;

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
  width: 32,
  height: 32
});

if (props.initialResolution?.width) {
  targetResolution.width = props.initialResolution.width;
}
if (props.initialResolution?.height) {
  targetResolution.height = props.initialResolution.height;
}

const cropRect = reactive({
  left: 0,
  top: 0,
  width: 1,
  height: 1
});
const persistedCropRect = ref<BrickWorkflowSession['crop'] | null>(null);
const measuredPreviewRect = ref<{ width: number; height: number; offsetX: number; offsetY: number }>({
  width: 0,
  height: 0,
  offsetX: 0,
  offsetY: 0
});

const cropOverlayStyle = computed(() => {
  const rect = measuredPreviewRect.value;
  const width = rect.width || 1;
  const height = rect.height || 1;
  return {
    width: `${cropRect.width * width}px`,
    height: `${cropRect.height * height}px`,
    left: `${rect.offsetX + cropRect.left * width}px`,
    top: `${rect.offsetY + cropRect.top * height}px`,
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)'
  };
});

type CropInteractionType = 'move' | 'resize-left' | 'resize-right';

const cropInteraction = reactive<CropInteractionState>({
  active: false,
  type: null,
  startX: 0,
  startY: 0,
  containerWidth: 1,
  containerHeight: 1,
  offsetX: 0,
  offsetY: 0,
  rectSnapshot: {
    left: 0,
    top: 0,
    width: 1,
    height: 1
  }
});
const initialCropApplied = ref(false);

const hsvControls = reactive({
  hue: 0,
  saturation: 0,
  value: 0,
  brightness: 0,
  contrast: 0
});
const defaultHsv = { hue: 0, saturation: 0, value: 0, brightness: 0, contrast: 0 };
const selectedPixelType = ref(PIXEL_TYPE_OPTIONS[0].number);
const isPreviewFrameLoading = computed(
  () =>
    step1Ready.value &&
    (isStep2Processing.value || (step2Ready.value && !step3Ready.value && !step3Error.value))
);
const isHsvDirty = computed(
  () =>
    hsvControls.hue !== defaultHsv.hue ||
    hsvControls.saturation !== defaultHsv.saturation ||
    hsvControls.value !== defaultHsv.value ||
    hsvControls.brightness !== defaultHsv.brightness ||
    hsvControls.contrast !== defaultHsv.contrast
);
const hasPixelRemap = computed(() => Object.keys(pixelColorRemap.value ?? {}).length > 0);
const hasStep2Edits = computed(() => isHsvDirty.value || hasPaintOverrides.value || hasPixelRemap.value);
const hasModalPixelRemap = computed(() => Object.keys(modalPixelColorRemap.value ?? {}).length > 0);
const ensurePaintOverrideArray = (length: number) => {
  if (!paintOverrides.value || paintOverrides.value.length !== length) {
    paintOverrides.value = new Array(length).fill(null);
  }
};

const applyOverridesToPixels = (base: Uint8ClampedArray, overrides = paintOverrides.value) => {
  if (!overrides || overrides.length !== base.length) {
    return base;
  }
  const merged = Uint8ClampedArray.from(base);
  for (let i = 0; i < overrides.length; i += 4) {
    if (overrides[i] == null || overrides[i + 1] == null || overrides[i + 2] == null) {
      continue;
    }
    merged[i] = overrides[i] as number;
    merged[i + 1] = overrides[i + 1] as number;
    merged[i + 2] = overrides[i + 2] as number;
    merged[i + 3] = 255;
  }
  return merged;
};

const applyPixelColorRemap = (pixels: Uint8ClampedArray, remap: PixelColorRemap | null | undefined) => {
  if (!remap || Object.keys(remap).length === 0) {
    return pixels;
  }
  const output = Uint8ClampedArray.from(pixels);
  for (let i = 0; i < pixels.length; i += 4) {
    const replacement = remap[i.toString()];
    if (!replacement) {
      continue;
    }
    output[i] = replacement[0];
    output[i + 1] = replacement[1];
    output[i + 2] = replacement[2];
    output[i + 3] = replacement[3] ?? pixels[i + 3];
  }
  return output;
};

const getStep2PixelsWithoutRemap = (overrides = paintOverrides.value) => {
  const base = step2PixelData.value;
  if (!base) {
    return null;
  }
  return applyOverridesToPixels(base, overrides);
};

const getStep2PixelsWithOverrides = (overrides = paintOverrides.value, remap = pixelColorRemap.value) => {
  const base = getStep2PixelsWithoutRemap(overrides);
  if (!base) {
    return null;
  }
  return applyPixelColorRemap(base, remap);
};

const renderModalUpscaled = (pixels: Uint8ClampedArray | null) => {
  if (!pixels || !modalUpscaledCanvas.value) {
    return;
  }
  renderUpscaledPreviewToTarget(modalUpscaledCanvas, pixels);
};

const renderModalPreview = () => {
  if (!modalBaseStep2Pixels.value) {
    return;
  }
  const remapped = applyPixelColorRemap(modalBaseStep2Pixels.value, modalPixelColorRemap.value ?? {});
  modalPreviewPixels.value = remapped;
  renderModalUpscaled(remapped);
};
const activeControlPointerIds = new Set<number>();
let deferredStep2Delay = 120;
const hasDeferredStep2Request = ref(false);

const clampResolutionValue = (value: number) => {
  const rounded = Math.round(value / RESOLUTION_STEP) * RESOLUTION_STEP;
  return Math.min(Math.max(rounded || RESOLUTION_MIN, RESOLUTION_MIN), RESOLUTION_MAX);
};

const clampCropRectToBounds = () => {
  const width = Math.min(Math.max(cropRect.width, MIN_CROP_FRACTION), 1);
  const height = Math.min(Math.max(cropRect.height, MIN_CROP_FRACTION), 1);
  cropRect.width = width;
  cropRect.height = height;
  cropRect.left = clamp(cropRect.left, 0, 1 - width);
  cropRect.top = clamp(cropRect.top, 0, 1 - height);
};

const markApiPreviewDirty = () => {
  if (props.editingOrderId && showApiStep3Preview.value) {
    showApiStep3Preview.value = false;
  }
};

const resetStep2Edits = () => {
  hsvControls.hue = defaultHsv.hue;
  hsvControls.saturation = defaultHsv.saturation;
  hsvControls.value = defaultHsv.value;
  hsvControls.brightness = defaultHsv.brightness;
  hsvControls.contrast = defaultHsv.contrast;
  useStep2PixelsAsSource.value = false;
  if (paintOverrides.value) {
    paintOverrides.value.fill(null);
  }
  pixelColorRemap.value = {};
  modalPixelColorRemap.value = null;
  modalPreviewPixels.value = null;
  step2Ready.value = false;
  step3Ready.value = false;
  showApiStep3Preview.value = false;
  finalStep3Preview.value = null;
  if (hasStep2Edits.value) {
    requestStep2Processing(0);
  }
  queuePersistSessionState();
};

const confirmResetEditsForStep1Change = () => {
  if (!hasStep2Edits.value) {
    return true;
  }
  const ok = window.confirm('การเปลี่ยนขนาด/ตำแหน่งครอปจะรีเซ็ตการแก้ไข Step 2/3 ทั้งหมด ต้องการดำเนินการต่อหรือไม่?');
  if (ok) {
    resetStep2Edits();
  }
  return ok;
};

const handleResolutionPointerDown = (event: PointerEvent) => {
  if (!confirmResetEditsForStep1Change()) {
    event.preventDefault();
    return;
  }
  handleControlPointerDown(event);
};

const handleResolutionInput = (axis: 'width' | 'height', event: Event) => {
  markApiPreviewDirty();
  const numericValue = Number((event.target as HTMLInputElement).value);
  if (!Number.isNaN(numericValue)) {
    targetResolution[axis] = numericValue;
  }
};

const handleHsvInput = (key: keyof typeof hsvControls, event: Event) => {
  markApiPreviewDirty();
  const numericValue = Number((event.target as HTMLInputElement).value);
  if (!Number.isNaN(numericValue)) {
    hsvControls[key] = numericValue;
  }
};

const emitGenerated = async () => {
  if (!step3Ready.value) return;
  const preview =
    step3UpscaledCanvas.value?.toDataURL('image/png') ||
    finalStep3Preview.value ||
    apiStep3Preview.value ||
    null;
  const studs = step3StudTotal.value;
  const priceAmount = formatPrice.value != null ? Number(formatPrice.value) : null;
  let instructionPdf: InstructionPdfResult | null = null;
  try {
    instructionPdf = await buildInstructionPdf(useHighQualityPdf.value, {
      download: false,
      returnBlob: true,
      quiet: true,
      noPreviewBlur: true
    });
  } catch (err) {
    console.warn('Generate product PDF failed', err);
  }
  emit('generated', {
    preview,
    studs,
    studUsage: step3StudUsage.value,
    resolution: { width: targetResolution.width, height: targetResolution.height },
    formatPrice: priceAmount,
    formatPriceMeta: formatPriceMeta.value ?? (priceAmount != null ? buildFormatPriceMeta(priceAmount) : null),
    instructionPdf
  });
};

const openPreviewModal = () => {
  const preview =
    step3UpscaledCanvas.value?.toDataURL('image/png') ||
    finalStep3Preview.value ||
    apiStep3Preview.value ||
    null;
  emit('preview-modal', { src: preview });
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const sanitizeCropRect = (rect: Partial<BrickWorkflowSession['crop']> | null) => {
  const left = clamp(rect?.left ?? cropRect.left, 0, 1);
  const top = clamp(rect?.top ?? cropRect.top, 0, 1);
  const width = clamp(rect?.width ?? cropRect.width, MIN_CROP_FRACTION, 1);
  const height = clamp(rect?.height ?? cropRect.height, MIN_CROP_FRACTION, 1);
  return {
    left,
    top,
    width: Math.min(width, 1 - left),
    height: Math.min(height, 1 - top)
  };
};

const buildHsvState = (): HsvState => ({
  hue: hsvControls.hue,
  saturation: hsvControls.saturation,
  value: hsvControls.value,
  brightness: hsvControls.brightness,
  contrast: hsvControls.contrast
});

let persistSessionTimeout: ReturnType<typeof setTimeout> | null = null;

const persistSessionState = () => {
  if (!props.enablePersistence || typeof window === 'undefined') {
    return;
  }
  const payload: BrickWorkflowSession = {
    version: 1,
    hasImage: Boolean(uploadedImage.value),
    userId: currentUserId.value,
    resolution: { width: targetResolution.width, height: targetResolution.height },
    crop: sanitizeCropRect({ ...cropRect }),
    hsv: buildHsvState(),
    pixelType: selectedPixelType.value,
    highQuality: isHighQualityColorMode.value,
    pixelColorRemap: pixelColorRemap.value
  };
  clearStepImagesForUser();
};

const queuePersistSessionState = () => {
  if (!props.enablePersistence || typeof window === 'undefined') {
    return;
  }
  if (persistSessionTimeout) {
    clearTimeout(persistSessionTimeout);
  }
  persistSessionTimeout = setTimeout(() => {
    persistSessionTimeout = null;
    persistSessionState();
  }, 200);
};

const applyPersistedCropIfNeeded = () => {
  if (!persistedCropRect.value || !step1Ready.value) {
    return false;
  }
  const crop = sanitizeCropRect(persistedCropRect.value);
  cropRect.left = crop.left;
  cropRect.top = crop.top;
  cropRect.width = crop.width;
  cropRect.height = crop.height;
  persistedCropRect.value = null;
  syncCropRectToAspect();
  requestStep2Processing(60);
  return true;
};

const restoreFromPersistence = async (): Promise<boolean> => {
  if (!props.enablePersistence || typeof window === 'undefined') {
    return false;
  }
  persistedStep3BaseHash.value = null;
  persistedStep3SourceHash.value = null;
  return false;
};

const finalizeControlPointer = (pointerId?: number) => {
  if (pointerId != null) {
    activeControlPointerIds.delete(pointerId);
  } else {
    activeControlPointerIds.clear();
  }
  if (activeControlPointerIds.size === 0 && hasDeferredStep2Request.value) {
    hasDeferredStep2Request.value = false;
    scheduleStep2Processing(deferredStep2Delay);
  }
};

const handleControlPointerDown = (event: PointerEvent) => {
  activeControlPointerIds.add(event.pointerId);
};

const handleControlPointerUp = (event: PointerEvent) => {
  finalizeControlPointer(event.pointerId);
};

const handleGlobalControlPointerEnd = (event: PointerEvent) => {
  if (activeControlPointerIds.has(event.pointerId)) {
    finalizeControlPointer(event.pointerId);
  }
};

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
  clampCropRectToBounds();
};

const measurePreviewRect = () => {
  const container = cropPreviewContainer.value;
  const canvas = step1Canvas.value;
  if (!container || !canvas) return;
  const containerBounds = container.getBoundingClientRect();
  const canvasBounds = canvas.getBoundingClientRect();
  measuredPreviewRect.value = {
    width: canvasBounds.width,
    height: canvasBounds.height,
    offsetX: canvasBounds.left - containerBounds.left,
    offsetY: canvasBounds.top - containerBounds.top
  };
};

const beginCropInteraction = (event: PointerEvent, type: CropInteractionType) => {
  if (!step1Ready.value) {
    return;
  }
  measurePreviewRect();
  const container = cropPreviewContainer.value;
  if (!container) {
    return;
  }
  if (!confirmResetEditsForStep1Change()) {
    return;
  }
  event.preventDefault();
  const bounds = container.getBoundingClientRect();
  const previewRect = measuredPreviewRect.value;
  if (!previewRect.width || !previewRect.height) {
    return;
  }
  const pointerX = event.clientX - bounds.left - previewRect.offsetX;
  const pointerY = event.clientY - bounds.top - previewRect.offsetY;
  if (pointerX < 0 || pointerY < 0 || pointerX > previewRect.width || pointerY > previewRect.height) {
    return;
  }
  cropInteraction.active = true;
  cropInteraction.type = type;
  cropInteraction.startX = pointerX;
  cropInteraction.startY = pointerY;
  cropInteraction.containerWidth = previewRect.width || 1;
  cropInteraction.containerHeight = previewRect.height || 1;
  cropInteraction.offsetX = previewRect.offsetX;
  cropInteraction.offsetY = previewRect.offsetY;
  cropInteraction.rectSnapshot = { ...cropRect };
  window.addEventListener('pointermove', handleCropPointerMove);
  window.addEventListener('pointerup', endCropInteraction);

  console.log("cropInteraction", cropInteraction);
};

const handleCropPointerMove = (event: PointerEvent) => {
  if (!cropInteraction.active || cropInteraction.type == null) {
    return;
  }
  const container = cropPreviewContainer.value;
  if (!container) return;
  const bounds = container.getBoundingClientRect();
  const pointerX = event.clientX - bounds.left - cropInteraction.offsetX;
  const pointerY = event.clientY - bounds.top - cropInteraction.offsetY;
  const clampedX = clamp(pointerX, 0, cropInteraction.containerWidth);
  const clampedY = clamp(pointerY, 0, cropInteraction.containerHeight);
  const deltaX = (clampedX - cropInteraction.startX) / cropInteraction.containerWidth;
  const deltaY = (clampedY - cropInteraction.startY) / cropInteraction.containerHeight;
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
  clampCropRectToBounds();
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
  markApiPreviewDirty();
  scheduleStep2Processing(80);
};

onBeforeUnmount(() => {
  endCropInteraction();
  lockBodyScroll(false);
});

const triggerFilePicker = () => {
  if (props.redirectOnUpload) {
    router.push(props.redirectOnUpload);
    return;
  }
  uploadError.value = null;
  fileInputRef.value?.click();
};

const applyInitialStep2Preview = async (preview: string | null) => {
  if (!preview) {
    return;
  }
  await nextTick();
  if (!step2Canvas.value || !step2UpscaledCanvas.value) {
    return;
  }
  let result = await loadDataUrlToCanvas(step2Canvas.value, preview);
  if (!result) {
    return;
  }
  let targetWidth = clampResolutionValue(result.width);
  let targetHeight = clampResolutionValue(result.height);
  const looksUpscaled = result.width > RESOLUTION_MAX || result.height > RESOLUTION_MAX;
  if (looksUpscaled) {
    const guessedWidth = Math.round(result.width / SCALING_FACTOR);
    const guessedHeight = Math.round(result.height / SCALING_FACTOR);
    if (
      guessedWidth > 0 &&
      guessedHeight > 0 &&
      guessedWidth <= RESOLUTION_MAX &&
      guessedHeight <= RESOLUTION_MAX
    ) {
      targetWidth = clampResolutionValue(guessedWidth);
      targetHeight = clampResolutionValue(guessedHeight);
    } else {
      const aspect = result.width / Math.max(result.height, 1);
      if (aspect >= 1) {
        targetWidth = clampResolutionValue(RESOLUTION_MAX);
        targetHeight = clampResolutionValue(Math.max(RESOLUTION_MIN, Math.round(targetWidth / Math.max(aspect, 0.01))));
      } else {
        targetHeight = clampResolutionValue(RESOLUTION_MAX);
        targetWidth = clampResolutionValue(Math.max(RESOLUTION_MIN, Math.round(targetHeight * aspect)));
      }
    }
    const resized = await loadDataUrlToCanvas(step2Canvas.value, preview, targetWidth, targetHeight);
    if (!resized) {
      return;
    }
    result = resized;
  }
  targetResolution.width = clampResolutionValue(result.width);
  targetResolution.height = clampResolutionValue(result.height);
  step2PixelData.value = Uint8ClampedArray.from(result.pixels);
  useStep2PixelsAsSource.value = true;
  renderStep2Preview(step2PixelData.value, true);
  step2Ready.value = true;
  step2Error.value = null;
  persistStep2Preview(step2Canvas.value?.toDataURL('image/png', 0.92) ?? preview);
  runStep3Pipeline();
};

onMounted(async () => {
  if (!shouldSkipPersistence.value) {
    const restored = props.enablePersistence ? await restoreFromPersistence() : false;
    if (restored && !props.editingOrderId) {
      return;
    }
  }
  if (props.initialStep3Preview && !initialOrderPreviewApplied.value && !props.initialStep2Preview) {
    finalStep3Preview.value = props.initialStep3Preview;
    initialOrderPreviewApplied.value = true;
    persistFinalStep3Preview(props.initialStep3Preview, props.initialStep3Base ?? undefined);
    if (props.editingOrderId) {
      step3Ready.value = true;
      showApiStep3Preview.value = true;
    }
  }
  if (props.defaultImageSrc) {
    const hasApiStep3 = Boolean(props.initialStep3Preview || props.initialStep3Base);
    if (props.initialStep2Preview) {
      shouldSkipInitialStep2Run.value = true;
    }
    resetWorkflowState({ clearPersistedPreview: !hasApiStep3, preserveRestoredStep3: hasApiStep3 });
    isProcessing.value = true;
    const shouldDeferStep2 = Boolean(props.initialStep2Preview);
    drawImagePreview(props.defaultImageSrc, { skipAutoStep2: shouldDeferStep2 });
    if (shouldDeferStep2) {
      await applyInitialStep2Preview(props.initialStep2Preview);
    }
  } else {
    if (props.initialStep2Preview) {
      shouldSkipInitialStep2Run.value = true;
    }
    applyInitialCrop();
    if (props.initialStep2Preview) {
      await applyInitialStep2Preview(props.initialStep2Preview);
    }
  }
  nextTick().then(() => measurePreviewRect());
  window.addEventListener('resize', measurePreviewRect);
});

watch(currentUserId, async () => {
  if (!props.enablePersistence || shouldSkipPersistence.value) {
    return;
  }
  initialCropApplied.value = false;
  const restored = await restoreFromPersistence();
  if (!restored) {
    resetWorkflowState();
    applyInitialCrop();
  }
});

watch(
  () => step1Ready.value,
  (ready) => {
    if (ready) {
      applyInitialCrop();
      nextTick().then(() => measurePreviewRect());
    }
  }
);

watch(
  () => [cropRect.left, cropRect.top, cropRect.width, cropRect.height],
  () => {
    persistCropForOrder();
  }
);

watch(
  () => props.defaultImageSrc,
  (next) => {
    if (!next) return;
    initialCropApplied.value = false;
    const hasApiStep3 = Boolean(props.initialStep3Preview || props.initialStep3Base);
    if (props.initialStep2Preview) {
      shouldSkipInitialStep2Run.value = true;
    }
    resetWorkflowState({ clearPersistedPreview: !hasApiStep3, preserveRestoredStep3: hasApiStep3 });
    isProcessing.value = true;
    const shouldDeferStep2 = Boolean(props.initialStep2Preview);
    drawImagePreview(next, { skipAutoStep2: shouldDeferStep2 });
    if (shouldDeferStep2) {
      applyInitialStep2Preview(props.initialStep2Preview);
    }
  }
);

watch(
  () => props.initialStep2Preview,
  (next) => {
    if (!next) return;
    applyInitialStep2Preview(next);
  }
);

watch(
  () => props.initialStep3Preview,
  (next) => {
    if (!next || props.initialStep2Preview) return;
    logStep3('initialStep3Preview watcher', {
      hasInitialBase: Boolean(props.initialStep3Base),
      editingOrderId: props.editingOrderId
    });
    finalStep3Preview.value = next;
    initialOrderPreviewApplied.value = true;
    persistFinalStep3Preview(next, props.initialStep3Base ?? undefined);
    if (props.editingOrderId) {
      step3Ready.value = true;
      showApiStep3Preview.value = true;
    }
    applyRestoredStep3BaseIfNeeded();
  },
  { immediate: true }
);

watch(
  () => props.initialStep3Base,
  (next) => {
    if (!next) return;
    logStep3('initialStep3Base watcher', {
      editingOrderId: props.editingOrderId,
      hasPreview: Boolean(props.initialStep3Preview)
    });
    pendingRestoredStep3Base.value = next;
    restoredStep3Applied.value = false;
    suspendStep3Persistence.value = true;
    if (props.editingOrderId && props.initialStep3Preview && !props.initialStep2Preview) {
      showApiStep3Preview.value = true;
    }
    // applyRestoredStep3BaseIfNeeded();
  },
  { immediate: true }
);

const applyInitialCrop = () => {
  if (initialCropApplied.value) {
    return;
  }
  if (applyPersistedCropIfNeeded()) {
    initialCropApplied.value = true;
    return;
  }
  if (!props.initialCropInteraction) {
    return;
  }
  const snapshot = props.initialCropInteraction.rectSnapshot;
  if (snapshot) {
    cropRect.left = snapshot.left ?? cropRect.left;
    cropRect.top = snapshot.top ?? cropRect.top;
    cropRect.width = snapshot.width ?? cropRect.width;
    cropRect.height = snapshot.height ?? cropRect.height;
  }
  Object.assign(cropInteraction, props.initialCropInteraction);
  initialCropApplied.value = true;
  persistCropForOrder();
  if (shouldSkipInitialStep2Run.value) {
    shouldSkipInitialStep2Run.value = false;
    return;
  }
  scheduleStep2Processing(100);
};

const resetWorkflowState = (options: { clearPersistedPreview?: boolean; preserveRestoredStep3?: boolean } = {}) => {
  const { clearPersistedPreview = true, preserveRestoredStep3 = false } = options;
  step1Ready.value = false;
  step2Ready.value = false;
  step3Ready.value = false;
  useStep2PixelsAsSource.value = false;
  initialCropApplied.value = false;
  step2Error.value = null;
  step3Error.value = null;
  isStep2Processing.value = false;
  step3QuantizationError.value = null;
  step3StudUsage.value = [];
  step2PixelData.value = null;
  paintOverrides.value = null;
  pixelColorRemap.value = {};
  modalPixelColorRemap.value = null;
  modalBaseStep2Pixels.value = null;
  modalPreviewPixels.value = null;
  step3QuantPixelsBase.value = null;
  isToolDropdownOpen.value = false;
  isColorDropdownOpen.value = false;
  isEditModalOpen.value = false;
  paintInProgress.value = false;
  modalPaintInProgress.value = false;
  pendingStep3AfterPaint = false;
  userPaintColorTouched.value = false;
  lockBodyScroll(false);
  cropRect.left = 0;
  cropRect.top = 0;
  cropRect.width = 1;
  cropRect.height = 1;
  if (clearPersistedPreview) {
    persistStep2Preview(null);
    persistFinalStep3Preview(null);
    clearStepImagesForUser();
    originalImageForOrder.value = null;
    cropInteractionForOrder.value = null;
  }
  if (!preserveRestoredStep3) {
    pendingRestoredStep3Base.value = null;
    restoredStep3Applied.value = false;
    applyingRestoredStep3 = false;
    persistedStep3BaseHash.value = null;
    persistedStep3SourceHash.value = null;
    lastGeneratedStep3BaseHash.value = null;
    lastGeneratedStep3SourceHash.value = null;
    suspendStep3Persistence.value = false;
  } else {
    suspendStep3Persistence.value = true;
  }
};

const normalizeCanvasPixels = (canvas: HTMLCanvasElement) => {
  const pixels = getPixelArrayFromCanvas(canvas);
  for (let i = 3; i < pixels.length; i += 4) {
    pixels[i] = 255;
  }
  drawPixelsOnCanvas(pixels, canvas);
};

const drawImagePreview = (src: string, options: { skipAutoStep2?: boolean } = {}) => {
  const { skipAutoStep2 = false } = options;
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
    originalImageForOrder.value = uploadedImage.value;
    useStep2PixelsAsSource.value = false;
    const persistPayload: Partial<Omit<StepImageSnapshot, 'v' | 'userId'>> = {
      step1: uploadedImage.value,
      step3Base: null,
      step3Preview: null,
      baseHash: null,
      srcHash: null
    };
    if (!skipAutoStep2) {
      persistPayload.step2 = null;
    }
    persistStepImages(persistPayload);
    imageDimensions.value = { width: img.width, height: img.height };
    step1Ready.value = true;
    step2Ready.value = false;
    cropRect.left = 0;
    cropRect.top = 0;
    cropRect.width = 1;
    cropRect.height = 1;
    syncCropRectToAspect();
    persistCropForOrder();
    applyInitialCrop();
    if (!skipAutoStep2) {
      nextTick().then(() => scheduleStep2Processing(10));
    }
    nextTick().then(() => measurePreviewRect());
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

const buildFormatPriceMeta = (amount: number, width?: number, height?: number): FormatPriceMeta => {
  const w = width ?? targetResolution.width;
  const h = height ?? targetResolution.height;
  const minSide = Math.min(w, h);
  const maxSide = Math.max(w, h);
  return {
    amount,
    width: w,
    height: h,
    size: `${minSide}x${maxSide}`
  };
};

const fetchFormatPrice = async () => {
  if (!step1Ready.value || !props.enablePriceFetch) {
    formatPriceLoading.value = false;
    formatPriceError.value = null;
    if (!props.enablePriceFetch) {
      formatPrice.value = null;
      formatPriceMeta.value = null;
    }
    return;
  }
  if (skipInitialPriceFetch.value && formatPrice.value != null) {
    skipInitialPriceFetch.value = false;
    return;
  }
  skipInitialPriceFetch.value = false;
  formatPriceLoading.value = true;
  formatPriceError.value = null;
  try {
    const lookup = await lookupFormatPrice();
    if (!lookup) {
      formatPrice.value = null;
      formatPriceMeta.value = null;
      return;
    }
    if (lookup.notFound) {
      formatPrice.value = null;
      formatPriceError.value = 'ไม่พบราคาฟอร์แมตนี้';
      formatPriceMeta.value = null;
      return;
    }
    formatPrice.value = lookup.price ?? null;
    formatPriceMeta.value =
      lookup.price != null ? buildFormatPriceMeta(Number(lookup.price), lookup.width, lookup.height) : null;
  } catch (error: any) {
    formatPrice.value = null;
    formatPriceMeta.value = null;
    formatPriceError.value =
      error?.data?.statusMessage || error?.message || 'ไม่สามารถคำนวณราคาได้';
  } finally {
    formatPriceLoading.value = false;
  }
};

let step2Timeout: ReturnType<typeof setTimeout> | null = null;
let formatPriceTimeout: ReturnType<typeof setTimeout> | null = null;

const lookupFormatPrice = async (): Promise<{
  price: number | null;
  size: string;
  width: number;
  height: number;
  notFound?: boolean;
} | null> => {
  if (!step1Ready.value || !props.enablePriceFetch) return null;
  const normalizeSize = (width: number, height: number) => {
    const a = Math.min(width, height);
    const b = Math.max(width, height);
    return { width: a, height: b, size: `${a}x${b}` };
  };
  const { width, height, size } = normalizeSize(targetResolution.width, targetResolution.height);
  const { data, error } = await supabase
    .from('format_prices')
    .select('size, width, height, price')
    .or(`size.eq.${size},and(width.eq.${width},height.eq.${height}),and(width.eq.${height},height.eq.${width})`)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  if (!data) {
    return { price: null, size, width, height, notFound: true };
  }
  return {
    price: data.price ?? null,
    size: data.size ?? size,
    width: data.width ?? width,
    height: data.height ?? height
  };
};

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

const requestStep2Processing = (delay = 120) => {
  if (activeControlPointerIds.size > 0) {
    hasDeferredStep2Request.value = true;
    deferredStep2Delay = delay;
    return;
  }
  scheduleStep2Processing(delay);
};

const renderStep2Preview = (pixels: Uint8ClampedArray, markReady = true) => {
  const outputCanvas = step2Canvas.value;
  const upscaledCanvas = step2UpscaledCanvas.value;
  if (!outputCanvas || !upscaledCanvas) {
    return;
  }
  outputCanvas.width = targetResolution.width;
  outputCanvas.height = targetResolution.height;
  drawPixelsOnCanvas(pixels, outputCanvas);
  const step2DataUrl = outputCanvas.toDataURL('image/png', 0.92);
  persistStepImages({ step2: step2DataUrl });
  persistStep2Preview(step2DataUrl);

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
  }
  if (markReady) {
    step2Ready.value = true;
  }
};

const renderUpscaledPreviewToTarget = (targetCanvasRef: typeof step2UpscaledCanvas, pixels: Uint8ClampedArray) => {
  const targetCanvas = targetCanvasRef.value;
  if (!targetCanvas) {
    return;
  }
  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = targetResolution.width;
  baseCanvas.height = targetResolution.height;
  drawPixelsOnCanvas(pixels, baseCanvas);

  targetCanvas.width = targetResolution.width * SCALING_FACTOR;
  targetCanvas.height = targetResolution.height * SCALING_FACTOR;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  ctx.drawImage(
    baseCanvas,
    0,
    0,
    baseCanvas.width,
    baseCanvas.height,
    0,
    0,
    targetCanvas.width,
    targetCanvas.height
  );
};

const runStep2Pipeline = () => {
  const sourceCanvas = step1Canvas.value;
  const outputCanvas = step2Canvas.value;
  if ((!sourceCanvas || !outputCanvas) && !(useStep2PixelsAsSource.value && step2PixelData.value)) {
    return;
  }
  isStep2Processing.value = true;
  step2Error.value = null;
  try {
    let pixelArray: Uint8ClampedArray | null = null;
    if (useStep2PixelsAsSource.value && step2PixelData.value) {
      pixelArray = Uint8ClampedArray.from(step2PixelData.value);
      pixelArray = applyHSVAdjustment(pixelArray, hsvControls.hue, hsvControls.saturation / 100, hsvControls.value / 100);
      pixelArray = applyBrightnessAdjustment(pixelArray, hsvControls.brightness);
      pixelArray = applyContrastAdjustment(pixelArray, hsvControls.contrast);
    } else {
      const bufferCanvas = document.createElement('canvas');
      bufferCanvas.width = targetResolution.width;
      bufferCanvas.height = targetResolution.height;
      const bufferContext = bufferCanvas.getContext('2d');
      if (!bufferContext) {
        throw new Error('เบราว์เซอร์ไม่รองรับการประมวลผล canvas');
      }
      bufferContext.imageSmoothingEnabled = false;
      const sx = Math.round(cropRect.left * sourceCanvas!.width);
      const sy = Math.round(cropRect.top * sourceCanvas!.height);
      const sWidth = Math.round(cropRect.width * sourceCanvas!.width);
      const sHeight = Math.round(cropRect.height * sourceCanvas!.height);
      bufferContext.drawImage(
        sourceCanvas!,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        bufferCanvas.width,
        bufferCanvas.height
      );
      pixelArray = getPixelArrayFromCanvas(bufferCanvas);
      pixelArray = applyHSVAdjustment(pixelArray, hsvControls.hue, hsvControls.saturation / 100, hsvControls.value / 100);
      pixelArray = applyBrightnessAdjustment(pixelArray, hsvControls.brightness);
      pixelArray = applyContrastAdjustment(pixelArray, hsvControls.contrast);
      outputCanvas.width = bufferCanvas.width;
      outputCanvas.height = bufferCanvas.height;
    }
    if (!pixelArray) {
      throw new Error('ไม่พบข้อมูล Step 2');
    }
    step2PixelData.value = Uint8ClampedArray.from(pixelArray);
    ensurePaintOverrideArray(pixelArray.length);
    const mergedPixels = applyOverridesToPixels(pixelArray);
    const remappedPixels = applyPixelColorRemap(mergedPixels, pixelColorRemap.value);
    renderStep2Preview(remappedPixels);
    const upscaledCanvas = step2UpscaledCanvas.value;
    if (upscaledCanvas) {
      step2Ready.value = true;
    }
    runStep3Pipeline();
  } catch (error) {
    step2Error.value = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดขณะสร้าง Step 2';
  } finally {
    isStep2Processing.value = false;
  }
};

const runStep3Pipeline = () => {
  logStep3('runStep3Pipeline: start', {
    step2Ready: step2Ready.value,
    hasOverrides: Boolean(paintOverrides.value?.some((v) => v != null)),
    highQuality: isHighQualityColorMode.value
  });
  const sourcePixels = getStep2PixelsWithOverrides();
  if (!step2Ready.value || sourcePixels == null) {
    step3Ready.value = false;
    logStep3('runStep3Pipeline: aborted (step2 not ready or no source pixels)');
    return;
  }
  const baseStudMap = ALL_BRICKLINK_SOLID_COLORS.reduce((acc, color) => {
    acc[color.hex] = Number.MAX_SAFE_INTEGER;
    return acc;
  }, {} as Record<string, number>);
  try {
    const originalPixels = Array.from(sourcePixels);
    const alignedPixels = alignPixelsToStudMap(originalPixels, baseStudMap, ciede2000ColorDistance);
    let quantPixels = Uint8ClampedArray.from(alignedPixels);
    if (!isHighQualityColorMode.value) {
      quantPixels = replaceSparseColors(quantPixels, SPARSE_COLOR_THRESHOLD, ciede2000ColorDistance);
    }
    logStep3('runStep3Pipeline: quantized', {
      pixelCount: quantPixels.length,
      colorCount: Object.keys(getUsedPixelsStudMap(quantPixels)).length
    });
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
    const baseCanvasDataUrl = step3BaseCanvas.toDataURL('image/png', 0.92);
    const baseSourceHash = hashUint8Array(quantPixels);
    lastGeneratedStep3SourceHash.value = baseSourceHash;
    lastGeneratedStep3BaseHash.value = hashString(baseCanvasDataUrl);
    const shouldSkipPersist =
      (suspendStep3Persistence.value && pendingRestoredStep3Base.value) ||
      (props.editingOrderId && showApiStep3Preview.value && apiStep3Preview.value);
    if (!shouldSkipPersist) {
      persistFinalStep3Preview(step3Upscaled.toDataURL('image/png', 0.92), baseCanvasDataUrl, baseSourceHash);
    } else {
      logStep3('runStep3Pipeline: skip persist', {
        suspendStep3Persistence: suspendStep3Persistence.value,
        pendingRestoredStep3Base: Boolean(pendingRestoredStep3Base.value),
        editingOrderId: props.editingOrderId,
        showApiStep3Preview: showApiStep3Preview.value
      });
    }
    step3QuantPixels.value = quantPixels;
    if (!step3QuantPixelsBase.value) {
      step3QuantPixelsBase.value = Uint8ClampedArray.from(quantPixels);
    }
    step3QuantizationError.value = getAverageQuantizationError(
      Array.from(sourcePixels),
      alignedPixels,
      ciede2000ColorDistance
    );
    const usageMap = getUsedPixelsStudMap(quantPixels);
    step3StudUsage.value = Object.entries(usageMap)
      .map(([hex, count]) => ({ hex, count, name: colorName(hex) ?? hex }))
      .sort((a, b) => b.count - a.count);
    if (!userPaintColorTouched.value && step3StudUsage.value.length > 0) {
      paintColorHex.value = step3StudUsage.value[0].hex;
    }

    step3Error.value = null;
    step3Ready.value = true;
    logStep3('runStep3Pipeline: done', {
      quantizationError: step3QuantizationError.value,
      colorCount: step3StudUsage.value.length,
      baseHash: lastGeneratedStep3BaseHash.value,
      sourceHash: lastGeneratedStep3SourceHash.value
    });
    applyRestoredStep3BaseIfNeeded();
  } catch (err) {
    step3Ready.value = false;
    step3Error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดใน Step 3';
    logStep3('runStep3Pipeline: error', { error: step3Error.value });
  }
};

const selectPaintTool = (tool: PaintTool) => {
  selectedPaintTool.value = tool;
  isToolDropdownOpen.value = false;
};

const selectPaintColor = (hex: string) => {
  paintColorHex.value = hex;
  userPaintColorTouched.value = true;
  isColorDropdownOpen.value = false;
};

const handleClearPaintOverrides = () => {
  if (!step2PixelData.value) {
    return;
  }
  markApiPreviewDirty();
  ensurePaintOverrideArray(step2PixelData.value.length);
  paintOverrides.value?.fill(null);
  const refreshed = getStep2PixelsWithOverrides();
  if (refreshed) {
    renderStep2Preview(refreshed, false);
    runStep3Pipeline();
  }
};

const clearPixelColorRemap = () => {
  if (!hasPixelRemap.value) {
    return;
  }
  markApiPreviewDirty();
  pixelColorRemap.value = {};
  requestStep2Processing(0);
  queuePersistSessionState();
};

const toggleToolDropdown = () => {
  isToolDropdownOpen.value = !isToolDropdownOpen.value;
  if (isToolDropdownOpen.value) {
    isColorDropdownOpen.value = false;
  }
};

const toggleColorDropdown = () => {
  isColorDropdownOpen.value = !isColorDropdownOpen.value;
  if (isColorDropdownOpen.value) {
    isToolDropdownOpen.value = false;
  }
};

const lockBodyScroll = (locked: boolean) => {
  if (typeof document === 'undefined') {
    return;
  }
  if (locked) {
    if (originalBodyOverflow.value === null) {
      originalBodyOverflow.value = document.body.style.overflow || '';
    }
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = originalBodyOverflow.value ?? '';
    originalBodyOverflow.value = null;
  }
};

const buildModalBasePixels = () => {
  const base = getStep2PixelsWithoutRemap();
  return base ? Uint8ClampedArray.from(base) : null;
};

const openEditModal = async () => {
  if (!step2Ready.value || !step2PixelData.value) {
    return;
  }
  const basePixels = buildModalBasePixels();
  if (!basePixels) {
    return;
  }
  modalBaseStep2Pixels.value = basePixels;
  modalPixelColorRemap.value = { ...(pixelColorRemap.value ?? {}) };
  isEditModalOpen.value = true;
  lockBodyScroll(true);
  await nextTick();
  renderModalPreview();
};

const cancelEditModal = () => {
  isEditModalOpen.value = false;
  modalPixelColorRemap.value = null;
  modalBaseStep2Pixels.value = null;
  modalPreviewPixels.value = null;
  modalPaintInProgress.value = false;
  lockBodyScroll(false);
};

const confirmEditModal = () => {
  markApiPreviewDirty();
  pixelColorRemap.value = { ...(modalPixelColorRemap.value ?? {}) };
  isEditModalOpen.value = false;
  modalBaseStep2Pixels.value = null;
  modalPreviewPixels.value = null;
  modalPixelColorRemap.value = null;
  modalPaintInProgress.value = false;
  lockBodyScroll(false);
  requestStep2Processing(0);
  queuePersistSessionState();
};

const clearModalRemap = () => {
  modalPixelColorRemap.value = {};
  renderModalPreview();
};

const applyPixelRemapAtPointer = (event: PointerEvent) => {
  if (!modalBaseStep2Pixels.value || !modalUpscaledCanvas.value) {
    return;
  }
  markApiPreviewDirty();
  if (!modalPixelColorRemap.value) {
    modalPixelColorRemap.value = { ...(pixelColorRemap.value ?? {}) };
  }
  const pixelIndex = getStep2PixelIndexFromPointerEvent(event, modalUpscaledCanvas);
  if (pixelIndex == null) {
    return;
  }
  if (selectedPaintTool.value === 'dropper') {
    const preview = modalPreviewPixels.value ?? applyPixelColorRemap(base, modalPixelColorRemap.value);
    paintColorHex.value = rgbToHex(preview[pixelIndex], preview[pixelIndex + 1], preview[pixelIndex + 2]);
    userPaintColorTouched.value = true;
    return;
  }
  const working = { ...(modalPixelColorRemap.value ?? {}) };
  if (selectedPaintTool.value === 'eraser') {
    delete working[pixelIndex.toString()];
  } else {
    const [r, g, b] = hexToRgb(paintColorHex.value);
    working[pixelIndex.toString()] = [r, g, b, 255];
  }
  modalPixelColorRemap.value = working;
  renderModalPreview();
};

const getStep2PixelIndexFromPointerEvent = (event: PointerEvent, targetCanvasRef: typeof step2UpscaledCanvas) => {
  const canvas = targetCanvasRef.value;
  if (!canvas) {
    return null;
  }
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor((x / rect.width) * targetResolution.width);
  const row = Math.floor((y / rect.height) * targetResolution.height);
  if (col < 0 || row < 0 || col >= targetResolution.width || row >= targetResolution.height) {
    return null;
  }
  return 4 * (row * targetResolution.width + col);
};

const applyPaintAtPointer = (
  event: PointerEvent,
  targetOverridesRef: typeof paintOverrides,
  targetCanvasRef: typeof step2UpscaledCanvas,
  setPending: (value: boolean) => void,
  paintStateRef: typeof paintInProgress
) => {
  markApiPreviewDirty();
  const pixelIndex = getStep2PixelIndexFromPointerEvent(event, targetCanvasRef);
  if (pixelIndex == null) {
    return;
  }

  if (!step2Ready.value || !step2PixelData.value) {
    return;
  }
  const pixels = getStep2PixelsWithOverrides(targetOverridesRef.value ?? paintOverrides.value);
  if (!pixels) {
    return;
  }

  if (selectedPaintTool.value === 'dropper') {
    const hex = rgbToHex(pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2]);
    paintColorHex.value = hex;
    userPaintColorTouched.value = true;
    return;
  }

  ensurePaintOverrideArray(step2PixelData.value.length);
  const overrides = targetOverridesRef.value;
  if (!overrides) {
    return;
  }

  if (selectedPaintTool.value === 'eraser') {
    overrides[pixelIndex] = null;
    overrides[pixelIndex + 1] = null;
    overrides[pixelIndex + 2] = null;
    overrides[pixelIndex + 3] = null;
  } else {
    const [r, g, b] = hexToRgb(paintColorHex.value);
    overrides[pixelIndex] = r;
    overrides[pixelIndex + 1] = g;
    overrides[pixelIndex + 2] = b;
    overrides[pixelIndex + 3] = 255;
  }
  const merged = getStep2PixelsWithOverrides(overrides);
  if (merged) {
    renderStep2Preview(merged, false);
    setPending(true);
  }
};

const handlePaintPointerDown = (event: PointerEvent) => {
  if (!step2Ready.value || isEditModalOpen.value) {
    return;
  }
  paintInProgress.value = true;
  applyPaintAtPointer(event, paintOverrides, step2UpscaledCanvas, (v) => (pendingStep3AfterPaint = v), paintInProgress);
};

const handlePaintPointerMove = (event: PointerEvent) => {
  if (!paintInProgress.value) {
    return;
  }
  applyPaintAtPointer(event, paintOverrides, step2UpscaledCanvas, (v) => (pendingStep3AfterPaint = v), paintInProgress);
};

const handlePaintPointerUp = () => {
  if (!paintInProgress.value) {
    return;
  }
  paintInProgress.value = false;
  if (pendingStep3AfterPaint) {
    runStep3Pipeline();
    pendingStep3AfterPaint = false;
  }
};

const handleModalPaintPointerDown = (event: PointerEvent) => {
  if (!isEditModalOpen.value || !modalBaseStep2Pixels.value) {
    return;
  }
  modalPaintInProgress.value = true;
  applyPixelRemapAtPointer(event);
};

const handleModalPaintPointerMove = (event: PointerEvent) => {
  if (!modalPaintInProgress.value) {
    return;
  }
  applyPixelRemapAtPointer(event);
};

const handleModalPaintPointerUp = () => {
  if (!modalPaintInProgress.value) {
    return;
  }
  modalPaintInProgress.value = false;
};

const goToCheckout = async () => {
  checkoutOrderError.value = null;
  if (isCreatingCheckoutOrder.value) {
    return;
  }
  if (!user.value) {
    requireAuth(() => goToCheckout());
    return;
  }
  if (!finalStep3Preview.value) {
    checkoutOrderError.value = 'ยังไม่มีภาพตัวอย่าง กรุณาสร้าง Step 3 ให้เสร็จ';
    return;
  }
  if (!step2PreviewForOrder.value) {
    checkoutOrderError.value = 'ยังไม่มีภาพจาก Step 2 กรุณาสร้างและบันทึกก่อน';
    return;
  }
  if (props.enablePriceFetch) {
    try {
      const latestPrice = await lookupFormatPrice();
      if (!latestPrice || latestPrice.notFound || latestPrice.price == null) {
        checkoutOrderError.value = 'ไม่พบราคาสำหรับขนาดนี้ กรุณาปรับขนาดหรือกรอกข้อมูลราคา';
        return;
      }
      formatPrice.value = latestPrice.price;
      formatPriceError.value = null;
      formatPriceMeta.value = buildFormatPriceMeta(
        Number(latestPrice.price),
        latestPrice.width,
        latestPrice.height
      );
    } catch (error: any) {
      checkoutOrderError.value = error?.message ?? 'ไม่สามารถตรวจสอบราคาได้';
      return;
    }
  }
  const latestFormatMeta =
    formatPriceMeta.value ??
    (formatPrice.value != null ? buildFormatPriceMeta(Number(formatPrice.value)) : null);

  if (typeof window === 'undefined') {
    checkoutOrderError.value = 'ต้องเปิดหน้านี้ผ่านเบราว์เซอร์เพื่อสร้างออเดอร์';
    return;
  }

  try {
    let step3Meta = buildStep3Meta();
    const mergeMetadata = (pdfMeta?: Record<string, any> | null) =>
      latestFormatMeta
        ? { format_price: latestFormatMeta, ...step3Meta, ...(pdfMeta ? { instruction_pdf: pdfMeta } : {}) }
        : { ...step3Meta, ...(pdfMeta ? { instruction_pdf: pdfMeta } : {}) };

    let orderId = props.editingOrderId ?? null;
    if (orderId) {
      let pdfMeta: Record<string, any> | null = null;
      try {
        const pdfResult = await generateInstructionPdfForOrder(orderId);
        pdfMeta = pdfResult?.pdfMeta ?? null;
        step3Meta = pdfResult?.step3Meta ?? step3Meta;
      } catch (uploadErr: any) {
        checkoutOrderError.value = uploadErr?.message ?? 'ไม่สามารถอัปโหลดไฟล์ PDF สำหรับออเดอร์ได้';
        return;
      }
      await updateOrderAssets(
        orderId,
        {
          previewUrl: step2PreviewForOrder.value,
          source: 'brick:edit',
          cropInteraction: cropInteractionForOrder.value ?? null,
          originalImage: originalImageForOrder.value ?? uploadedImage.value ?? null,
          totalAmount: latestFormatMeta?.amount ?? undefined,
          metadata: mergeMetadata(pdfMeta)
        },
        user.value.id
      );
    } else {
      const initialPayload = await buildOrderPdfPayload();
      step3Meta = initialPayload.step3Meta;
      const initialMetadata = mergeMetadata();
      const data = await recordPendingPaymentOrder({
        userId: user.value.id,
        previewUrl: step2PreviewForOrder.value,
        source: 'checkout',
        cropInteraction: cropInteractionForOrder.value ?? null,
        originalImage: originalImageForOrder.value ?? uploadedImage.value ?? null,
        totalAmount: latestFormatMeta?.amount ?? undefined,
        metadata: initialMetadata
      });
      orderId = data?.id ?? null;
      if (orderId) {
        try {
          const pdfMeta = await uploadInstructionPdf(orderId, initialPayload.instructionPdf);
          await updateOrderAssets(
            orderId,
            {
              metadata: mergeMetadata(pdfMeta)
            },
            user.value.id
          );
        } catch (uploadErr: any) {
          checkoutOrderError.value = uploadErr?.message ?? 'ไม่สามารถอัปโหลดไฟล์ PDF สำหรับออเดอร์ได้';
          return;
        }
      }
    }
    if (orderId) {
      router.push(`/checkout?id=${orderId}`);
    } else {
      router.push('/checkout');
    }
  } catch (error: any) {
    checkoutOrderError.value = error?.message ?? 'ไม่สามารถสร้างออเดอร์ได้';
  } finally {
    isGeneratingPdf.value = false;
    isCreatingCheckoutOrder.value = false;
  }
};

const buildOrderPdfPayload = async () => {
  if (!step3Ready.value || !finalStep3Preview.value) {
    throw new Error('ยังไม่มี Step 3 สำหรับสร้าง PDF');
  }
  const instructionPdf = await buildInstructionPdf(useHighQualityPdf.value, {
    download: false,
    returnBlob: true,
    quiet: true,
    noPreviewBlur: true
  });
  if (!instructionPdf) {
    throw new Error('ไม่สามารถสร้างไฟล์ PDF ได้');
  }
  const step3Meta = buildStep3Meta();
  return { instructionPdf, step3Meta };
};

const buildStep3Meta = () => ({
  stud_preview: finalStep3Preview.value ?? null,
  step3_preview: finalStep3Preview.value ?? null,
  instruction_preview: finalStep3Preview.value ?? null,
  step3_resolution: { width: targetResolution.width, height: targetResolution.height },
  step3_studs: step3StudTotal.value,
  step3_stud_usage: step3StudUsage.value,
  pixel_type: selectedPixelType.value,
  high_quality: isHighQualityColorMode.value
});

const generateInstructionPdfForOrder = async (orderId: string | number, forceUpload = false) => {
  if (!orderId) {
    throw new Error('ต้องมีเลขออเดอร์เพื่อสร้าง PDF');
  }
  const currentPreview = finalStep3Preview.value ?? null;
  if (!forceUpload && currentPreview && lastUploadedInstructionPreview.value === currentPreview && lastUploadedPdfMeta.value) {
    return { pdfMeta: lastUploadedPdfMeta.value, step3Meta: buildStep3Meta() };
  }
  const { instructionPdf, step3Meta } = await buildOrderPdfPayload();
  const pdfMeta = await uploadInstructionPdf(orderId, instructionPdf);
  lastUploadedInstructionPreview.value = currentPreview;
  lastUploadedPdfMeta.value = pdfMeta ?? null;
  return { pdfMeta, step3Meta };
};

type InstructionPdfOptions = {
  download?: boolean;
  quiet?: boolean;
  returnBlob?: boolean;
  noPreviewBlur?: boolean;
};

type InstructionPdfResult = {
  blob: Blob;
  fileName: string;
};

const handleGenerateInstructions = async () => {
  if (isGeneratingPdf.value) {
    return;
  }
  if (!step3Ready.value || !step3Canvas.value || !step3UpscaledCanvas.value) {
    pdfError.value = 'กรุณาสร้าง Step 3 ให้เสร็จสมบูรณ์ก่อน';
    return;
  }
  if (typeof window === 'undefined') {
    pdfError.value = 'ต้องเปิดหน้านี้ผ่านเบราว์เซอร์เพื่อสร้าง PDF';
    return;
  }
  pdfError.value = null;
  pdfSuccessMessage.value = null;
  isGeneratingPdf.value = true;
  pdfProgress.value = 0;
  pdfProgressLabel.value = 'กำลังเตรียมหน้าแรก...';
  try {
    await buildInstructionPdf(useHighQualityPdf.value);
    pdfSuccessMessage.value = 'สร้างคำสั่งเสร็จแล้ว (ตรวจสอบไฟล์ที่ดาวน์โหลดในเบราว์เซอร์)';
  } catch (err) {
    pdfError.value = err instanceof Error ? err.message : 'ไม่สามารถสร้าง PDF ได้';
  } finally {
    isGeneratingPdf.value = false;
  }
};

defineExpose({
  goToCheckout,
  generateInstructionPdfForOrder,
  step3Ready,
  isStep2Processing,
  isCreatingCheckoutOrder,
  handleGenerateInstructions
});

const buildInstructionPdf = async (
  isHighQuality: boolean,
  options?: InstructionPdfOptions
): Promise<InstructionPdfResult | null> => {
  if (!step3Canvas.value || !step3UpscaledCanvas.value) {
    throw new Error('ไม่พบข้อมูลจาก Step 3');
  }
  if (
    targetResolution.width % DEFAULT_PLATE_WIDTH !== 0 ||
    targetResolution.height % DEFAULT_PLATE_WIDTH !== 0
  ) {
    throw new Error('ขนาดภาพต้องหารด้วย 32 (ขนาดฐานแผ่น) ลงตัว');
  }
  const { jsPDF } = await import('jspdf');
  const pixelArray = getPixelArrayFromCanvas(step3Canvas.value);
  if (!pixelArray?.length) {
    throw new Error('ยังไม่มีพิกเซลสำหรับสร้างคำสั่ง');
  }

  const studMap = getUsedPixelsStudMap(pixelArray);
  const nonZeroColors = (colors: string[]) => colors.filter((hex) => (studMap[hex] ?? 0) > 0);
  let orderedColors = instructionColorOrder.value.length > 0 ? nonZeroColors(instructionColorOrder.value) : [];
  if (!orderedColors.length) {
    orderedColors = nonZeroColors(Object.keys(studMap).sort());
  }
  if (!orderedColors.length) {
    throw new Error('ไม่พบสีที่ใช้ในโมเสก');
  }

  const dpi = isHighQuality ? HIGH_DPI : LOW_DPI;
  const totalPlates =
    (targetResolution.width * targetResolution.height) /
    (DEFAULT_PLATE_WIDTH * DEFAULT_PLATE_WIDTH);
  const totalPages = totalPlates + 1;
  const previewClearPageLimit =
    totalPages <= PREVIEW_CLEAR_PAGE_COUNT ? Math.max(1, totalPages - 1) : PREVIEW_CLEAR_PAGE_COUNT;

  const updateProgress = (completedPages: number, label: string) => {
    if (options?.quiet) return;
    pdfProgress.value = Math.min(1, completedPages / totalPages);
    pdfProgressLabel.value = label;
  };

  const titlePageCanvas = document.createElement('canvas');
  generateInstructionTitlePage(
    pixelArray,
    targetResolution.width,
    DEFAULT_PLATE_WIDTH,
    orderedColors,
    SCALING_FACTOR,
    step3UpscaledCanvas.value,
    titlePageCanvas,
    selectedPixelType.value
  );
  setCanvasDpi(titlePageCanvas, dpi);
  const titleImg = titlePageCanvas.toDataURL('image/png', 1.0);
  const orientation = targetResolution.width >= targetResolution.height ? 'l' : 'p';

  const createPdfInstance = () =>
    new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

  let pdf = createPdfInstance();
  const addImageToPdf = (canvasData: string, canvasWidth: number, canvasHeight: number) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = Math.max(pageWidth - PDF_MARGIN_MM * 2, 10);
    const maxHeight = Math.max(pageHeight - PDF_MARGIN_MM * 2, 10);
    let drawWidth = maxWidth;
    let drawHeight = (canvasHeight / canvasWidth) * drawWidth;
    if (drawHeight > maxHeight) {
      drawHeight = maxHeight;
      drawWidth = (canvasWidth / canvasHeight) * drawHeight;
    }
    const offsetX = (pageWidth - drawWidth) / 2;
    const offsetY = (pageHeight - drawHeight) / 2;
    pdf.addImage(canvasData, 'PNG', offsetX, offsetY, drawWidth, drawHeight);
  };

  const blurCanvasForPreview = (source: HTMLCanvasElement) => {
    // aggressively destroy detail: heavy downscale + strong blur + washed-out overlay
    const downscaleFactor = 0.08;
    const minSize = 8;
    const downscaleCanvas = document.createElement('canvas');
    downscaleCanvas.width = Math.max(Math.round(source.width * downscaleFactor), minSize);
    downscaleCanvas.height = Math.max(Math.round(source.height * downscaleFactor), minSize);
    const downCtx = downscaleCanvas.getContext('2d');
    if (!downCtx) {
      return source.toDataURL('image/png', 1.0);
    }
    downCtx.imageSmoothingEnabled = true;
    downCtx.drawImage(source, 0, 0, downscaleCanvas.width, downscaleCanvas.height);

    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = source.width;
    blurCanvas.height = source.height;
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) {
      return source.toDataURL('image/png', 1.0);
    }
    blurCtx.imageSmoothingEnabled = true;
    blurCtx.filter = 'blur(18px) saturate(0.12) contrast(0.25)';
    blurCtx.drawImage(downscaleCanvas, 0, 0, source.width, source.height);
    blurCtx.filter = 'none';
    blurCtx.fillStyle = 'rgba(255,255,255,0.32)';
    blurCtx.fillRect(0, 0, blurCanvas.width, blurCanvas.height);
    setCanvasDpi(blurCanvas, dpi);
    return blurCanvas.toDataURL('image/png', 1.0);
  };

  addImageToPdf(titleImg, titlePageCanvas.width, titlePageCanvas.height);
  updateProgress(1, 'สร้างหน้าแนะนำเรียบร้อย');

  let currentPageNumber = 1; // title page already added

  for (let i = 0; i < totalPlates; i++) {
    await sleep(40);
    pdf.addPage();

    const instructionCanvas = document.createElement('canvas');
    const subPixels = getSubPixelArray(pixelArray, i, targetResolution.width, DEFAULT_PLATE_WIDTH);
    generateInstructionPage(
      subPixels,
      DEFAULT_PLATE_WIDTH,
      orderedColors,
      SCALING_FACTOR,
      instructionCanvas,
      i + 1,
      selectedPixelType.value,
      null
    );
    setCanvasDpi(instructionCanvas, dpi);
    currentPageNumber += 1;
    const isPreviewPage = options?.noPreviewBlur ? true : currentPageNumber <= previewClearPageLimit;
    // const isPreviewPage = currentPageNumber <= PREVIEW_CLEAR_PAGE_COUNT;
    const instructionImg = isPreviewPage
      ? instructionCanvas.toDataURL('image/png', 1.0)
      : blurCanvasForPreview(instructionCanvas);
    addImageToPdf(instructionImg, instructionCanvas.width, instructionCanvas.height);
    updateProgress(i + 2, `กำลังวาดแผ่นที่ ${i + 1}/${totalPlates}${isPreviewPage ? '' : ' (ตัวอย่างเบลอ)'}`);
  }

  addWatermark(pdf, isHighQuality, APP_WATERMARK);
  const fileName = `${PDF_FILENAME_BASE}.pdf`;
  const shouldDownload = options?.download ?? true;
  const pdfBlob = pdf.output('blob') as Blob;
  if (shouldDownload) {
    pdf.save(fileName);
  }
  updateProgress(totalPages, 'สร้างไฟล์สำเร็จ');
  if (options?.returnBlob) {
    return { blob: pdfBlob, fileName };
  }
  return null;
};

const uploadInstructionPdf = async (orderId: string | number, pdf: InstructionPdfResult) => {
  const orderIdStr = String(orderId);
  const version = Date.now();
  const storageFileName = `Siam-Brick-${orderIdStr}-${version}.pdf`;
  const filePath = `pdf/${storageFileName}`;

  // remove old files with the same orderId prefix to avoid stale versions
  try {
    const { data: existing } = await supabase.storage.from(PDF_STORAGE_BUCKET).list('pdf', {
      limit: 1000
    });
    const prefix = `Siam-Brick-${orderIdStr}-`;
    const toDelete =
      existing
        ?.filter((item) => item.name?.startsWith(prefix))
        .map((item) => `pdf/${item.name}`) ?? [];
    if (toDelete.length) {
      await supabase.storage.from(PDF_STORAGE_BUCKET).remove(toDelete);
    }
  } catch (cleanupErr) {
    console.warn('cleanup old instruction pdf failed', cleanupErr);
  }

  const { error } = await supabase.storage.from(PDF_STORAGE_BUCKET).upload(filePath, pdf.blob, {
    contentType: 'application/pdf',
    upsert: true,
    cacheControl: '1'
  });
  if (error) {
    throw error;
  }

  // best-effort cleanup: remove older PDFs for this order to avoid storage bloat
  try {
    const { data: existing } = await supabase.storage.from(PDF_STORAGE_BUCKET).list(`pdf/${orderIdStr}`, {
      limit: 1000
    });
    const toDelete =
      existing
        ?.map((item) => `pdf/${orderIdStr}/${item.name}`)
        .filter((path) => path !== filePath) ?? [];
    if (toDelete.length) {
      await supabase.storage.from(PDF_STORAGE_BUCKET).remove(toDelete);
    }
  } catch (cleanupErr) {
    console.warn('cleanup old instruction pdf failed', cleanupErr);
  }

  const { data: publicUrlData } = supabase.storage.from(PDF_STORAGE_BUCKET).getPublicUrl(filePath);
  let signedUrl: string | null = null;
  try {
    const { data: signedData, error: signedError } = await supabase.storage
      .from(PDF_STORAGE_BUCKET)
      .createSignedUrl(filePath, 60 * 60 * 24 * 30);
    if (!signedError) {
      signedUrl = signedData?.signedUrl ?? null;
    }
  } catch {
    signedUrl = null;
  }
  return {
    bucket: PDF_STORAGE_BUCKET,
    path: filePath,
    version,
    publicUrl: publicUrlData?.publicUrl ?? null,
    signedUrl
  };
};

watch(
  () => ({
    resolution: { ...targetResolution },
    crop: { ...cropRect },
    hsv: { ...hsvControls },
    pixelType: selectedPixelType.value,
    highQuality: isHighQualityColorMode.value,
    hasImage: Boolean(uploadedImage.value)
  }),
  () => {
    queuePersistSessionState();
  },
  { deep: true }
);

watch(uploadedImage, () => {
  queuePersistSessionState();
});

watch(
  () => props.editingOrderId,
  () => {
    // reset cached pdf meta when switching order
    lastUploadedInstructionPreview.value = null;
    lastUploadedPdfMeta.value = null;
  }
);

watch(
  () => hsvControls.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue && hasPaintOverrides.value) {
      handleClearPaintOverrides();
    }
  }
);

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
    markApiPreviewDirty();
    requestStep2Processing();
  }
);

watch(
  () => [targetResolution.width, targetResolution.height, step1Ready.value],
  () => {
    if (!step1Ready.value) return;
    if (formatPriceTimeout) clearTimeout(formatPriceTimeout);
    formatPriceTimeout = setTimeout(() => fetchFormatPrice(), 200);
  }
);

watch(
  () => [hsvControls.hue, hsvControls.saturation, hsvControls.value, hsvControls.brightness, hsvControls.contrast],
  () => {
    markApiPreviewDirty();
    requestStep2Processing();
  }
);

watch(selectedPixelType, () => {
  markApiPreviewDirty();
  if (step2Ready.value) {
    runStep3Pipeline();
  }
});

watch(isHighQualityColorMode, () => {
  markApiPreviewDirty();
  if (step2Ready.value) {
    runStep3Pipeline();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', measurePreviewRect);
});

// preset price for edit mode if provided
const applyInitialFormatPrice = (price: number | null) => {
  formatPrice.value = price;
  formatPriceError.value = null;
  if (price == null) {
    formatPriceMeta.value = null;
    return;
  }
  const existing = formatPriceMeta.value;
  if (existing && Number(existing.amount) === Number(price)) {
    return;
  }
  formatPriceMeta.value = buildFormatPriceMeta(Number(price));
};

if (props.initialFormatPrice != null) {
  applyInitialFormatPrice(props.initialFormatPrice);
}

watch(
  () => props.initialFormatPrice,
  (next) => {
    if (next != null) {
      applyInitialFormatPrice(next);
      skipInitialPriceFetch.value = Boolean(props.editingOrderId && next != null);
    }
  }
);
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

.preview-square {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #00000000;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-media {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 0.5rem;
}

.preview-media-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
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

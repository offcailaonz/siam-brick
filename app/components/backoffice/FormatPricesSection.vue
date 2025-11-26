<template>
  <section class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-900">กำหนดราคาแต่ละขนาด</p>
        <p class="text-xs text-slate-500">เพิ่ม/ลบ รูปแบบได้ (บาท/ชุดเต็ม)</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 text-sm text-slate-700">
          <input
            type="number"
            min="1"
            class="w-20 rounded border border-slate-200 px-2 py-1 text-sm text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
            placeholder="กว้าง"
            v-model.number="newWidth"
            @keyup.enter="addFormat"
          />
          <span class="px-1 text-xs text-slate-500">x</span>
          <input
            type="number"
            min="1"
            class="w-20 rounded border border-slate-200 px-2 py-1 text-sm text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
            placeholder="สูง"
            v-model.number="newHeight"
            @keyup.enter="addFormat"
          />
        </div>
        <button
          type="button"
          class="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
          :disabled="adding || !newWidth || !newHeight"
          @click="addFormat"
        >
          {{ adding ? 'กำลังเพิ่ม...' : 'เพิ่มรูปแบบ' }}
        </button>
        <button
          type="button"
          class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          :disabled="loading"
          @click="$emit('refresh')"
        >
          รีเฟรช
        </button>
      </div>
    </div>

    <div v-if="error" class="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
      {{ error }}
    </div>

    <div class="mt-4 overflow-hidden rounded-lg border border-slate-200 w-full">
      <div class="grid" :style="{ gridTemplateColumns: `repeat(${partCosts.length}, minmax(140px, 1fr))` }">
        <div
          v-for="part in partCosts"
          :key="part.key"
          class="bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600 uppercase tracking-wide text-center"
        >
          {{ part.name }}
        </div>
        <div
          v-for="part in partCosts"
          :key="`${part.key}-input`"
          class="px-3 py-3 border-t border-slate-200 flex items-center justify-center"
        >
          <div class="w-full max-w-[160px]">
            <label class="sr-only">ราคา {{ part.name }}</label>
            <div class="relative">
              <span class="absolute left-2 top-1.5 text-xs text-slate-500">฿</span>
              <input
                type="number"
                class="w-full rounded border border-slate-200 px-5 py-1.5 text-sm text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 text-right"
                :value="partPriceDrafts[part.key]"
                @input="(e) => partPriceDrafts[part.key] = (e.target as HTMLInputElement).value"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-lg border border-slate-200 w-full">
      <div
        class="grid grid-cols-[110px,110px,90px,90px,90px,70px,70px,70px,90px,120px,130px] md:grid-cols-[1fr,1fr,0.8fr,0.8fr,0.8fr,0.6fr,0.6fr,0.6fr,0.8fr,1fr,1.1fr] items-center bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600 uppercase tracking-wide"
      >
        <span class="text-center">ด้าน A</span>
        <span class="text-center">ด้าน B</span>
        <span class="text-right">ฐาน 16x16</span>
        <span class="text-right">ฐาน 32x32</span>
        <span class="text-right">มุม</span>
        <span class="text-right">รูแขวน</span>
        <span class="text-right">ขอบสั้น</span>
        <span class="text-right">ขอบยาว</span>
        <span class="text-right">studs</span>
        <span class="text-right">ราคา (บาท)</span>
        <span class="text-right">จัดการ</span>

      </div>
      <div v-if="loading" class="divide-y divide-slate-200">
        <div
          v-for="n in 5"
          :key="n"
          class="grid grid-cols-[110px,110px,90px,90px,90px,70px,70px,70px,90px,120px,130px] md:grid-cols-[1fr,1fr,0.8fr,0.8fr,0.8fr,0.6fr,0.6fr,0.6fr,0.8fr,1fr,1.1fr] items-center px-3 py-3"
        >
          <div class="flex justify-center"><div class="h-5 w-16 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-center"><div class="h-5 w-16 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-9 w-28 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-9 w-20 rounded bg-slate-100 animate-pulse"></div></div>
          <div class="flex justify-end"><div class="h-9 w-20 rounded bg-slate-100 animate-pulse"></div></div>
        </div>
      </div>
      <div v-else class="divide-y divide-slate-200">
        <div
          v-for="item in formats"
          :key="itemKey(item)"
          class="grid grid-cols-[110px,110px,90px,90px,90px,70px,70px,70px,90px,120px,130px] md:grid-cols-[1fr,1fr,0.8fr,0.8fr,0.8fr,0.6fr,0.6fr,0.6fr,0.8fr,1fr,1.1fr] items-center px-3 py-3"
        >
          <div class="text-center text-sm font-semibold text-slate-800">
            {{ normalizedSize(item).width ?? '-' }}
          </div>
          <div class="text-center text-sm font-semibold text-slate-800">
            {{ normalizedSize(item).height ?? '-' }}
          </div>
          <div class="text-right text-sm text-slate-700">{{ stats(item)?.base16 ?? 0 }}</div>
          <div class="text-right text-sm text-slate-700">{{ stats(item)?.base32 ?? 0 }}</div>
          <div class="text-right text-sm text-slate-700">{{ stats(item)?.corners ?? 0 }}</div>
          <div class="text-right text-sm text-slate-700">{{ stats(item)?.clips ?? 0 }}</div>
          <div class="text-right text-sm text-slate-700">{{ stats(item)?.sideShort ?? 0 }}</div>
          <div class="text-right text-sm text-slate-700">{{ stats(item)?.sideLong ?? 0 }}</div>
          <div class="text-right text-sm text-slate-700">{{ stats(item)?.studs?.toLocaleString?.() ?? 0 }}</div>
          <div class="flex justify-end">
            <input
              type="number"
              class="w-24 rounded border border-slate-200 px-2 py-1 text-right text-sm text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              :value="drafts[itemKey(item)] ?? item.price ?? ''"
              :placeholder="item.price != null ? String(item.price) : 'กำหนดราคา'"
              @input="onInput(item, 'price', ($event.target as HTMLInputElement)?.value)"
            />
          </div>
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
              :disabled="saving?.[itemKey(item)]"
              @click="onSave(item)"
            >
              {{ saving?.[itemKey(item)] ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
            <button
              type="button"
              class="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-40"
              :disabled="saving?.[itemKey(item)]"
              @click="$emit('delete', itemKey(item))"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

const props = defineProps<{
  formats: Array<{ size?: string; width?: number | null; height?: number | null; price: number | null }>;
  loading?: boolean;
  error?: string | null;
  saving?: Record<string, boolean>;
  adding?: boolean;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'save', payload: { size: string; width: number | null; height: number | null; price: number | null }): void;
  (e: 'delete', size: string): void;
  (e: 'add', payload: { width: number; height: number }): void;
}>();

const drafts = reactive<Record<string, string | number>>({});
const newWidth = ref<number | null>(null);
const newHeight = ref<number | null>(null);
const adding = computed(() => props.adding === true);

const normalizedSize = (item: any): { size: string; width: number | null; height: number | null } => {
  const w = Number(item.width ?? 0);
  const h = Number(item.height ?? 0);
  if (w && h) {
    const a = Math.min(w, h);
    const b = Math.max(w, h);
    return { size: `${a}x${b}`, width: a, height: b };
  }
  if (item.size) return { size: String(item.size), width: null, height: null };
  return { size: '', width: null, height: null };
};

const itemKey = (item: any) => normalizedSize(item).size.toLowerCase();

const displaySize = (item: any) => {
  const w = Number(item.width ?? 0);
  const h = Number(item.height ?? 0);
  if (w && h) return `${w} x ${h}`;
  return item.size || '-';
};

const getFrameAndBase = (width: number, height: number) => {
  const hasSize = width > 0 && height > 0;

  const corners = hasSize ? 4 : 0;
  const clips = hasSize ? 2 : 0;

  const sideShort = hasSize ? ((width - 16) / 16) * 2 : 0;
  const sideLong = hasSize ? ((height - 16) / 16) * 2 : 0;

  const canUse32 = hasSize && width % 32 === 0 && height % 32 === 0;

  const base32 = canUse32 ? (width / 32) * (height / 32) : 0;
  const base16 = !canUse32 && hasSize ? (width / 16) * (height / 16) : 0;

  const studs = width * height;

  return { corners, clips, sideShort, sideLong, base32, base16, studs };
};

const stats = (item: any) => {
  const norm = normalizedSize(item);
  if (!norm.width || !norm.height) return null;
  return getFrameAndBase(norm.width, norm.height);
};

const onInput = (item: any, field: 'price', value: string | number | null | undefined) => {
  const key = itemKey(item);
  drafts[key] = value ?? '';
};

const onSave = (item: any) => {
  const key = itemKey(item);
  const pRaw = drafts[key];
  const ordered = normalizedSize(item);
  const price = pRaw === '' || pRaw == null ? item.price ?? null : Number(pRaw);
  emit('save', {
    size: ordered.size,
    width: Number.isNaN(ordered.width as number) ? null : (ordered.width as number),
    height: Number.isNaN(ordered.height as number) ? null : (ordered.height as number),
    price: Number.isNaN(price as number) ? null : (price as number)
  });
};

const addFormat = () => {
  if (!newWidth.value || !newHeight.value) return;
  const ordered = normalizedSize({ width: newWidth.value, height: newHeight.value });
  if (!ordered.width || !ordered.height) return;
  emit('add', { width: ordered.width, height: ordered.height });
  newWidth.value = null;
  newHeight.value = null;
};

const draftsKeysCleanup = (items: Array<{ size?: string }>) => {
  const keep = new Set(items.map((i) => itemKey(i)));
  Object.keys(drafts).forEach((key) => {
    if (!keep.has(key)) delete drafts[key];
  });
};

const formatNumber = (value: number | string | null | undefined) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const partCosts = [
  { key: 'base16', name: 'ฐาน 16x16', price: 16.13 },
  { key: 'base32', name: 'ฐาน 32x32', price: 16.13 },
  { key: 'frame', name: 'ชิ้นส่วนกรอบ (ขอบ)', price: 4.61 },
  { key: 'corners', name: 'ชิ้นส่วนกรอบ (มุม)', price: 4.94 },
  { key: 'clips', name: 'รูแขวน', price: 3.3 },
  { key: 'studs', name: 'Stud', price: 0.09 }
] as const;

const partPriceDrafts = reactive<Record<string, string | number>>(
  partCosts.reduce((acc, p) => {
    acc[p.key] = p.price;
    return acc;
  }, {} as Record<string, string | number>)
);

watch(
  () => props.formats,
  (next) => {
    draftsKeysCleanup(next);
  },
  { deep: true }
);
</script>

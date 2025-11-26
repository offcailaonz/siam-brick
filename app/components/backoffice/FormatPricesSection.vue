<template>
  <section
    class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-slate-900">กำหนดราคาแต่ละขนาด</p>
        <p class="text-xs text-slate-500">เพิ่ม/ลบ รูปแบบได้ (บาท/ชุดเต็ม)</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-amber-600 disabled:opacity-60"
          :disabled="partsLoading || savingAllPartsFlag"
          @click="emitSaveAllParts"
        >
          {{ savingAllPartsFlag ? 'กำลังบันทึกราคาชิ้นส่วน...' : 'บันทึกราคาชิ้นส่วน' }}
        </button>
      </div>
    </div>

    <div
      v-if="error"
      class="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700"
    >
      {{ error }}
    </div>

    <div class="mt-4 overflow-hidden rounded-lg border border-slate-200 w-full">
      <div
        class="grid"
        :style="{ gridTemplateColumns: `repeat(${partsSafe.length}, minmax(140px, 1fr))` }"
      >
        <div
          v-for="part in partsSafe"
          :key="part.key"
          class="bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600 uppercase tracking-wide text-center"
        >
          {{ part.name }}
        </div>
        <div
          v-for="part in partsSafe"
          :key="`${part.key}-input`"
          class="px-3 py-3 border-t border-slate-200 flex items-center justify-center"
        >
          <div class="w-full max-w-[160px]">
            <label class="sr-only">ราคา {{ part.name }}</label>
            <div class="relative">
              <span class="absolute left-2 top-1.5 text-xs text-slate-500"
                >฿</span
              >
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

      <BaseModal
        :open="showExtrasModal"
        title="ราคาต้นทุนเพิ่มเติม"
        @close="showExtrasModal = false"
      >
        <div class="space-y-3">
          <p class="text-xs text-slate-500">
            เพิ่มรายการต้นทุนอื่น ๆ เช่น ค่าส่ง ค่าแพ็กสินค้า ฯลฯ
            จะถูกนำไปคิดรวมในราคาทุนของแต่ละขนาด
          </p>
          <div class="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            <div
              v-for="(extra, idx) in extrasDrafts"
              :key="extra.id ?? idx"
              class="grid grid-cols-[1fr,140px,80px] items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
            >
              <input
                v-model="extra.name"
                type="text"
                class="rounded border border-slate-200 px-2 py-1 text-sm text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
                placeholder="ชื่อรายการ"
              />
              <div class="relative">
                <span class="absolute left-2 top-1.5 text-xs text-slate-500"
                  >฿</span
                >
                <input
                  v-model="extra.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full rounded border border-slate-200 px-5 py-1 text-sm text-slate-800 text-right focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
                  placeholder="0.00"
                />
              </div>
              <div class="flex justify-end">
                <button
                  type="button"
                  class="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                  @click="removeExtraRow(idx)"
                >
                  ลบ
                </button>
              </div>
            </div>
            <div
              v-if="!extrasDrafts.length"
              class="text-xs text-slate-500 px-1"
            >
              ยังไม่มีรายการ
            </div>
          </div>
          <div class="flex items-center justify-between">
            <button
              type="button"
              class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              @click="addExtraRow"
            >
              เพิ่มรายการ
            </button>
            <div class="text-sm font-semibold text-slate-800">
              รวม: ฿{{ formatNumber(extrasTotal) }}
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              @click="showExtrasModal = false"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
              :disabled="props.extrasSaving || props.extrasLoading"
              @click="emitSaveExtras"
            >
              {{ props.extrasSaving ? 'กำลังบันทึก...' : 'บันทึกต้นทุนเพิ่ม' }}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-3 my-3 mt-6">
      <div>
        <button
          type="button"
          class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          :disabled="partsLoading || savingAllPartsFlag"
          @click="showExtrasModal = true"
        >
          ราคาต้นทุนเพิ่มเติม
        </button>
        <span class="ml-2 text-xs font-semibold text-slate-600">
          : ฿{{ formatNumber(extrasTotal) }}
        </span>
      </div>
      <div class="flex gap-3">
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
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
            :disabled="loading || savingAllFormatsFlag"
            @click="emitSaveAllFormats"
          >
            {{ savingAllFormatsFlag ? 'กำลังบันทึกขนาด...' : 'บันทึกราคาขนาด' }}
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-lg border border-slate-200 w-full">
      <div
        class="grid grid-cols-[90px,90px,90px,90px,90px,90px,90px,110px,110px,110px,110px,100px,110px] md:grid-cols-[1fr,1fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr,1fr,1fr,1fr,0.9fr,0.9fr,1fr] items-center bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600 uppercase tracking-wide"
      >
        <span class="text-center">ด้าน A</span>
        <span class="text-center">ด้าน B</span>
        <span class="text-right">ฐาน 16x16</span>
        <span class="text-right">ฐาน 32x32</span>
        <span class="text-right">รูแขวน</span>
        <span class="text-right">มุม</span>
        <span class="text-right">ขอบ</span>
        <span class="text-right">studs</span>
        <span class="text-right">ราคาทุน</span>
        <span class="text-right">ราคาขาย</span>
        <span class="text-right">กำไร</span>
        <span class="text-right">กำไร %</span>
        <span class="text-right">จัดการ</span>
      </div>
      <div v-if="loading" class="divide-y divide-slate-200">
        <div
          v-for="n in 5"
          :key="n"
          class="grid grid-cols-[90px,90px,90px,90px,90px,90px,90px,110px,110px,110px,110px,100px,110px] md:grid-cols-[1fr,1fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr,1fr,1fr,1fr,0.9fr,0.9fr,1fr] items-center px-3 py-3"
        >
          <div class="flex justify-center">
            <div class="h-5 w-16 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-center">
            <div class="h-5 w-16 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-5 w-12 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-5 w-16 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-9 w-28 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-9 w-20 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-9 w-20 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-9 w-20 rounded bg-slate-100 animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-9 w-16 rounded bg-slate-100 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div v-else class="divide-y divide-slate-200">
        <div
          v-for="item in formats"
          :key="itemKey(item)"
          class="grid grid-cols-[90px,90px,90px,90px,90px,90px,90px,110px,110px,110px,110px,100px,110px] md:grid-cols-[1fr,1fr,0.8fr,0.8fr,0.8fr,0.8fr,0.8fr,1fr,1fr,1fr,0.9fr,0.9fr,1fr] items-center px-3 py-3"
        >
          <div class="text-center text-sm font-semibold text-slate-800">
            {{ normalizedSize(item).width ?? '-' }}
          </div>
          <div class="text-center text-sm font-semibold text-slate-800">
            {{ normalizedSize(item).height ?? '-' }}
          </div>
          <div class="text-right text-sm text-slate-700">
            {{ stats(item)?.base16 ?? 0 }}
          </div>
          <div class="text-right text-sm text-slate-700">
            {{ stats(item)?.base32 ?? 0 }}
          </div>
          <div class="text-right text-sm text-slate-700">
            {{ stats(item)?.clips ?? 0 }}
          </div>
          <div class="text-right text-sm text-slate-700">
            {{ stats(item)?.corners ?? 0 }}
          </div>
          <div class="text-right text-sm text-slate-700">
            {{
              ((stats(item)?.sideShort ?? 0) + (stats(item)?.sideLong ?? 0))
            }}
          </div>
          <div class="text-right text-sm text-slate-700">
            {{ stats(item)?.studs?.toLocaleString?.() ?? 0 }}
          </div>
          <div class="text-right text-sm text-slate-700">
            ฿{{ formatNumber(formatCost(item)) }}
          </div>
          <div class="flex justify-end">
            <input
              type="number"
              class="w-24 rounded border border-slate-200 px-2 py-1 text-right text-sm text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              :value="drafts[itemKey(item)] ?? item.price ?? ''"
              :placeholder="item.price != null ? String(item.price) : 'กำหนดราคา'"
              @input="onInput(item, 'price', ($event.target as HTMLInputElement)?.value)"
            />
          </div>
          <div class="text-right text-sm text-slate-700">
            ฿{{ formatNumber(profitAmount(item)) }}
          </div>
          <div class="text-right text-sm text-slate-700">
            {{ profitPercent(item) }}
          </div>
          <div class="flex items-center justify-end gap-2">
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
import BaseModal from '~/components/ui/BaseModal.vue';

const props = defineProps<{
  formats: Array<{ size?: string; width?: number | null; height?: number | null; price: number | null }>;
  loading?: boolean;
  error?: string | null;
  saving?: Record<string, boolean>;
  adding?: boolean;
  parts?: Array<{ key: string; name: string; price: number | null }>;
  partsLoading?: boolean;
  partSaving?: Record<string, boolean>;
  partError?: string | null;
  savingAllFormats?: boolean;
  savingAllParts?: boolean;
  extras?: Array<{ id?: number | string; name: string; amount: number | null }>;
  extrasLoading?: boolean;
  extrasSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'save', payload: { size: string; width: number | null; height: number | null; price: number | null }): void;
  (e: 'delete', size: string): void;
  (e: 'add', payload: { width: number; height: number }): void;
  (e: 'save-part', key: string, price: number | null): void;
  (e: 'save-all-formats', payloads: Array<{ size: string; width: number | null; height: number | null; price: number | null }>): void;
  (e: 'save-all-parts', payloads: Array<{ key: string; price: number | null }>): void;
  (e: 'save-extras', payloads: Array<{ id?: number | string; name: string; amount: number | null }>): void;
}>();

const drafts = reactive<Record<string, string | number>>({});
const newWidth = ref<number | null>(null);
const newHeight = ref<number | null>(null);
const adding = computed(() => props.adding === true);
const partsSafe = computed(() => props.parts ?? []);
const partPriceDrafts = reactive<Record<string, string | number>>({});
const savingAllFormatsFlag = computed(() => props.savingAllFormats === true);
const savingAllPartsFlag = computed(() => props.savingAllParts === true);
const partPriceLookup = computed(() => {
  const map: Record<string, number> = {};
  partsSafe.value.forEach((p) => {
    const val = partPriceDrafts[p.key];
    const num = val === '' || val == null ? null : Number(val);
    map[p.key] = Number.isNaN(num as number) ? 0 : (num as number);
  });
  return map;
});
const extrasDrafts = reactive<Array<{ id?: number | string; name: string; amount: string | number | null }>>([]);
const showExtrasModal = ref(false);
const extrasTotal = computed(() =>
  extrasDrafts.reduce((sum, e) => {
    const num = e.amount === '' || e.amount == null ? 0 : Number(e.amount);
    return sum + (Number.isNaN(num) ? 0 : num);
  }, 0)
);

watch(
  () => props.extras,
  (next) => {
    extrasDrafts.splice(0, extrasDrafts.length);
    (next ?? []).forEach((e) => {
      extrasDrafts.push({ id: e.id, name: e.name, amount: e.amount ?? '' });
    });
  },
  { deep: true, immediate: true }
);
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

const formatCost = (item: any) => {
  const s = stats(item);
  if (!s) return 0;
  const price = (key: string) => partPriceLookup.value[key] ?? 0;
  const base16Cost = s.base16 * price('plate-16');
  const base32Cost = s.base32 * price('plate-32');
  const hangerCost = s.clips * price('hanger');
  const cornerCost = s.corners * price('frame-corner');
  const edgeCost = (s.sideShort + s.sideLong) * price('frame-edge');
  const studsCost = s.studs * price('stud-pack');
  return base16Cost + base32Cost + hangerCost + cornerCost + edgeCost + studsCost + extrasTotal.value;
};

const profitAmount = (item: any) => {
  const cost = formatCost(item);
  const priceRaw = drafts[itemKey(item)] ?? item.price ?? 0;
  const sell = Number(priceRaw) || 0;
  return sell - cost;
};

const profitPercent = (item: any) => {
  const cost = formatCost(item);
  const priceRaw = drafts[itemKey(item)] ?? item.price ?? 0;
  const sell = Number(priceRaw) || 0;
  if (sell <= 0) return '—';
  const pct = ((sell - cost) / sell) * 100;
  return `${pct.toFixed(1)}%`;
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

watch(
  () => props.parts,
  (next) => {
    if (!next) return;
    next.forEach((p) => {
      partPriceDrafts[p.key] = p.price ?? '';
    });
  },
  { deep: true, immediate: true }
);

watch(
  () => props.formats,
  (next) => {
    draftsKeysCleanup(next);
  },
  { deep: true }
);

const emitSaveAllFormats = () => {
  const payloads = (props.formats ?? []).map((item) => {
    const ordered = normalizedSize(item);
    const key = itemKey(item);
    const pRaw = drafts[key];
    const price = pRaw === '' || pRaw == null ? item.price ?? null : Number(pRaw);
    return {
      size: ordered.size,
      width: ordered.width,
      height: ordered.height,
      price: Number.isNaN(price as number) ? null : (price as number)
    };
  });
  emit('save-all-formats', payloads);
};

const emitSaveAllParts = () => {
  const payloads = partsSafe.value.map((p) => {
    const val = partPriceDrafts[p.key];
    const num = val === '' || val == null ? null : Number(val);
    return { key: p.key, price: Number.isNaN(num as number) ? null : (num as number) };
  });
  emit('save-all-parts', payloads);
};

const emitSaveExtras = () => {
  const payloads = extrasDrafts
    .filter((e) => (e.name && e.name.trim()) || e.amount)
    .map((e) => ({
      id: e.id,
      name: e.name?.trim() || '',
      amount: e.amount === '' || e.amount == null ? null : Number(e.amount)
    }));
  emit('save-extras', payloads);
  showExtrasModal.value = false;
};

const addExtraRow = () => {
  extrasDrafts.push({ name: '', amount: null });
};

const removeExtraRow = (index: number) => {
  extrasDrafts.splice(index, 1);
};
</script>

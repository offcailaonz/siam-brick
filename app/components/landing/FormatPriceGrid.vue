<template>
  <section class="mx-auto max-w-6xl px-6 py-16 text-white">
    <div class="mb-6 flex flex-col gap-2 text-center">
      <p class="text-sm font-semibold uppercase tracking-wide text-amber-300">
        รูปแบบขนาดและราคา
      </p>
      <h2 class="text-3xl font-bold">เลือกขนาดที่เหมาะกับงานของคุณ</h2>
      <p class="text-sm text-slate-200">
        อัปเดตจากระบบหลังบ้านอัตโนมัติ
      </p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" v-auto-animate>
      <template v-if="loading">
        <div
          v-for="n in 6"
          :key="n"
          class="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 shadow-lg animate-pulse"
        >
          <div class="h-6 w-24 rounded bg-white/30"></div>
          <div class="mt-3 h-4 w-20 rounded bg-white/20"></div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="item in sortedFormats"
          :key="item.size"
          class="rounded-2xl border border-white/10 bg-white/10 px-5 py-5 shadow-lg backdrop-blur-sm"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">
              {{ displaySize(item) }}
            </h3>
            <span class="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-amber-200 border border-white/10">
              ฐาน {{ areaLabel(displaySize(item)) }}
            </span>
          </div>
          <p class="mt-2 text-lg font-semibold">
            {{ item.price != null ? `฿${formatPrice(item.price)}` : 'ติดต่อประเมินราคา' }}
          </p>
          <p class="text-xs text-slate-200 mt-2" v-if="stats(item)">
            <span class="font-semibold">studs</span> ~ {{ stats(item)?.studs?.toLocaleString() || '-' }}
          </p>
          <ul v-if="stats(item)" class="mt-1 text-[11px] text-slate-200 space-y-0.5">
            <li>ฐาน 32x32: <span class="font-semibold">{{ stats(item)?.base32 || 0 }}</span></li>
            <li>ฐาน 16x16: <span class="font-semibold">{{ stats(item)?.base16 || 0 }}</span></li>
            <li>มุมกรอบภาพ (corners): <span class="font-semibold">{{ stats(item)?.corners || 0 }}</span></li>
            <li>รูแขวนกรอบภาพ (clips): <span class="font-semibold">{{ stats(item)?.clips || 0 }}</span></li>
            <li>ชิ้นส่วนกรอบภาพด้านสั้น (sideShort): <span class="font-semibold">{{ stats(item)?.sideShort || 0 }}</span></li>
            <li>ชิ้นส่วนกรอบภาพด้านยาว (sideLong): <span class="font-semibold">{{ stats(item)?.sideLong || 0 }}</span></li>
          </ul>
          <p class="text-xs text-slate-200 mt-1">
            ราคาเต็มชุด (รวมฐาน + ตัวต่อ)
          </p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type FormatItem = { size?: string; width?: number | null; height?: number | null; price: number | null };

const props = withDefaults(
  defineProps<{
    formats: Array<FormatItem>;
    loading?: boolean;
  }>(),
  {
    loading: false
  }
);

const parseSize = (value: string) => {
  const match = value?.match(/(\d+)[x×](\d+)/i);
  if (!match) return { w: 0, h: 0, area: 0 };
  const w = Number(match[1]);
  const h = Number(match[2]);
  const a = Math.min(w, h);
  const b = Math.max(w, h);
  return { w: a, h: b, area: a * b };
};

const displaySize = (item: FormatItem) => {
  const w = item.width ?? null;
  const h = item.height ?? null;
  if (w && h) {
    const a = Math.min(w, h);
    const b = Math.max(w, h);
    return `${a} x ${b}`;
  }
  const parsed = parseSize(item.size ?? '');
  return parsed.w && parsed.h ? `${parsed.w} x ${parsed.h}` : item.size ?? '-';
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

const stats = (item: FormatItem) => {
  const sizeText = item.size ?? '';
  const parsed = parseSize(sizeText);
  const w = item.width ?? parsed.w;
  const h = item.height ?? parsed.h;
  if (!w || !h) return null;
  return getFrameAndBase(w, h);
};

const sortedFormats = computed(() =>
  [...props.formats].sort((a, b) => {
    const aSize = a.size ?? `${a.width ?? 0}x${a.height ?? 0}`;
    const bSize = b.size ?? `${b.width ?? 0}x${b.height ?? 0}`;
    return parseSize(aSize).area - parseSize(bSize).area;
  })
);

const areaLabel = (size: string) => {
  const { area } = parseSize(size);
  return area ? `${area.toLocaleString()} studs` : '—';
};

const formatPrice = (price: number) => new Intl.NumberFormat('th-TH').format(price);
</script>

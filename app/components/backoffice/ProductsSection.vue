<template>
  <section
    class="rounded-xl border border-indigo-100 bg-white px-4 py-4 shadow-sm space-y-4"
  >
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">สินค้า</p>
        <p class="text-xs text-slate-500">รายการสินค้าที่แสดงบนหน้าเว็บ</p>
      </div>
      <div>
        <button
          type="button"
          class="me-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          :disabled="loading"
          @click="$emit('refresh')"
        >
          รีเฟรช
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          @click="openCreateModal"
        >
          เพิ่มสินค้า
        </button>
      </div>
    </div>
    <p v-if="error" class="mt-2 text-xs text-rose-600">
      โหลดสินค้าไม่สำเร็จ: {{ error }}
    </p>

    <div class="space-y-2 max-h-[420px] overflow-auto pr-1" v-auto-animate>
      <div v-if="loading" class="text-sm text-slate-500 px-1">กำลังโหลด...</div>
      <div
        v-else-if="products.length === 0"
        class="text-sm text-slate-500 px-1"
      >
        ยังไม่มีสินค้า
      </div>
      <div
        v-else
        v-for="product in products"
        :key="product.id"
        class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
      >
        <div class="flex items-center justify-between gap-2">
          <div>
            <p class="text-sm font-semibold text-slate-900">
              {{ product.name }}
            </p>
            <p class="text-xs text-slate-500">
              {{ product.slug || product.type || 'สินค้า' }}
            </p>
          </div>
          <span
            class="badge"
            :class="product.active === false ? 'badge-grey' : 'badge-green'"
          >
            {{ product.active === false ? 'ปิด' : 'ขายอยู่' }}
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          ราคา {{ product.price != null ? formatCurrency(product.price) : '—' }}
        </p>
        <div class="mt-2 flex items-center gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            @click="editProduct(product)"
          >
            แก้ไข
          </button>
          <button
            type="button"
            class="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] font-semibold text-rose-700 shadow-sm hover:bg-rose-50"
            @click="$emit('delete', product.id)"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>

    <BaseModal
      :open="showModal"
      :title="form.id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'"
      max-width-class="max-w-3xl"
      @close="closeModal"
    >
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="flex">
          <div class="space-y-2 mx-auto">
            <p class="text-[11px] font-semibold text-slate-600">
              รูปภาพตัวอย่าง
            </p>
            <div
              class="relative flex min-h-[220px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
            >
              <img
                v-if="form.image"
                :src="form.image"
                alt="product preview"
                class="max-h-[360px] w-full object-contain"
              />
              <p v-else class="text-xs text-slate-500">ยังไม่มีภาพจากการแปลง</p>
            </div>
          </div>
          <div class="grid gap-3 mx-auto">
            <label class="space-y-1 text-[11px] font-semibold text-slate-600">
              ชื่อสินค้า
              <input
                v-model.trim="form.name"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </label>
            <label class="space-y-1 text-[11px] font-semibold text-slate-600">
              ราคา (ชุดเต็ม)
              <input
                v-model.number="form.priceKit"
                type="number"
                step="1"
                min="0"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            <label class="space-y-1 text-[11px] font-semibold text-slate-600">
              Tag
              <input
                v-model.trim="form.tag"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            <label class="space-y-1 text-[11px] font-semibold text-slate-600">
              ความยาก
              <select
                v-model="form.difficulty"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <label class="space-y-1 text-[11px] font-semibold text-slate-600">
              จำนวน studs
              <input
                disabled
                v-model.number="form.studs"
                type="number"
                min="0"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            <label class="space-y-1 text-[11px] font-semibold text-slate-600">
              ขนาด
              <input
                disabled
                v-model.trim="form.size"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
        <label
          class="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
        >
          <input
            v-model="form.active"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          แสดงบนหน้าเว็บ
        </label>
        <div class="flex flex-wrap items-center gap-2 justify-end">
          <!-- <button
            type="button"
            class="rounded-full border border-slate-200 px-4 py-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
            :disabled="saving"
            @click="resetForm"
          >
            เคลียร์
          </button> -->
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            :disabled="saving"
          >
            {{ form.id ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า' }}
          </button>

          <!-- <p v-if="saveError" class="text-xs text-rose-600">{{ saveError }}</p>
          <p v-else-if="saveSuccess" class="text-xs text-emerald-600">{{ saveSuccess }}</p> -->
        </div>
      </form>
    </BaseModal>
    <ProductGeneratorModal
      :open="showGeneratorModal"
      @close="closeGeneratorModal"
      @generated="handleGeneratedProduct"
    />
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import BaseModal from '~/components/ui/BaseModal.vue';
import ProductGeneratorModal from '~/components/backoffice/ProductGeneratorModal.vue';

const props = defineProps<{
  products: Array<Record<string, any>>;
  loading: boolean;
  error: string | null;
  formatCurrency: (v: number | string | null | undefined) => string;
  saving?: boolean;
  saveError?: string | null;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'save', payload: any): void;
  (e: 'delete', id: number | string): void;
}>();

const form = reactive({
  id: null as number | string | null,
  name: '',
  slug: '',
  priceKit: 0,
  tag: '',
  studs: 0,
  difficulty: 'Beginner',
  size: '',
  image: '',
  active: true,
  formatPriceMeta: null as any
});

const saveSuccess = ref('');
const showModal = ref(false);
const showGeneratorModal = ref(false);

const resetForm = () => {
  form.id = null;
  form.name = '';
  form.slug = '';
  form.priceKit = 0;
  form.tag = '';
  form.studs = 0;
  form.difficulty = 'Beginner';
  form.size = '';
  form.image = '';
  form.active = true;
  form.formatPriceMeta = null;
  saveSuccess.value = '';
};

const editProduct = (p: any) => {
  form.id = p.id ?? null;
  form.name = p.name ?? '';
  form.slug = p.slug ?? '';
  form.priceKit = p.price ?? p.metadata?.priceKit ?? 0;
  form.tag = p.metadata?.tag ?? '';
  form.studs = p.metadata?.studs ?? 0;
  form.difficulty = p.metadata?.difficulty ?? 'Beginner';
  form.size = p.metadata?.size ?? '';
  form.image = p.metadata?.image ?? '';
  form.active = p.active !== false;
  form.formatPriceMeta = p.metadata?.format_price ?? null;
  saveSuccess.value = '';
  showModal.value = true;
};

const handleSubmit = () => {
  saveSuccess.value = '';
  const payload = { ...form };
  if (!payload.slug && payload.name) {
    payload.slug = slugify(payload.name);
  }
  payload.priceInstructions = undefined;
  emit('save', payload);
};

const closeModal = () => {
  showModal.value = false;
};

const openCreateModal = () => {
  resetForm();
  showGeneratorModal.value = true;
};

const closeGeneratorModal = () => {
  showGeneratorModal.value = false;
};

watch(
  () => props.saving,
  (next, prev) => {
    if (prev && !next && !props.saveError) {
      saveSuccess.value = 'บันทึกสำเร็จ';
      setTimeout(() => {
        saveSuccess.value = '';
      }, 1500);
      showModal.value = false;
    }
  }
);

const handleGeneratedProduct = (payload: any) => {
  form.image = payload.preview || form.image;
  form.studs = payload.studs ?? form.studs;
  form.tag = form.tag || 'พร้อมสร้าง';
  form.difficulty = form.difficulty || 'Intermediate';
  form.size = `${payload.resolution?.width ?? ''}x${payload.resolution?.height ?? ''}`.trim();
  const priceAmount = payload.formatPrice ?? payload.formatPriceMeta?.amount ?? null;
  if (priceAmount != null && !Number.isNaN(Number(priceAmount))) {
    form.priceKit = Number(priceAmount);
  }
  form.formatPriceMeta = payload.formatPriceMeta ?? form.formatPriceMeta;
  showGeneratorModal.value = false;
  showModal.value = true;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');

watch(
  () => form.name,
  (next) => {
    if (!next) return;
    form.slug = slugify(next);
  }
);
</script>

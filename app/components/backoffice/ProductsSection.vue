<template>
  <section class="rounded-xl border border-indigo-100 bg-white px-4 py-4 shadow-sm space-y-4">
    <div class="flex items-center justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-slate-900">สินค้า</p>
        <p class="text-xs text-slate-500">รายการสินค้าที่แสดงบนหน้าเว็บ</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        :disabled="loading"
        @click="$emit('refresh')"
      >
        รีเฟรช
      </button>
    </div>
    <p v-if="error" class="mt-2 text-xs text-rose-600">โหลดสินค้าไม่สำเร็จ: {{ error }}</p>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        @click="openCreateModal"
      >
        เพิ่มสินค้า
      </button>
    </div>

    <div class="space-y-2 max-h-[420px] overflow-auto pr-1" v-auto-animate>
      <div v-if="loading" class="text-sm text-slate-500 px-1">กำลังโหลด...</div>
      <div v-else-if="products.length === 0" class="text-sm text-slate-500 px-1">ยังไม่มีสินค้า</div>
      <div
        v-else
        v-for="product in products"
        :key="product.id"
        class="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
      >
        <div class="flex items-center justify-between gap-2">
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ product.name }}</p>
            <p class="text-xs text-slate-500">{{ product.slug || product.type || 'สินค้า' }}</p>
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
          <button type="button" class="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50" @click="editProduct(product)">
            แก้ไข
          </button>
          <button type="button" class="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] font-semibold text-rose-700 shadow-sm hover:bg-rose-50" @click="$emit('delete', product.id)">
            ลบ
          </button>
        </div>
      </div>
    </div>

    <BaseModal :open="showModal" :title="form.id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'" @close="closeModal">
      <form class="space-y-2" @submit.prevent="handleSubmit">
        <div class="grid gap-2 md:grid-cols-2">
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            ชื่อสินค้า
            <input v-model.trim="form.name" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            slug
            <input v-model.trim="form.slug" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" required />
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            ราคา (ชุดเต็ม)
            <input v-model.number="form.priceKit" type="number" step="1" min="0" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            ราคา (คำสั่ง)
            <input v-model.number="form.priceInstructions" type="number" step="1" min="0" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            Tag
            <input v-model.trim="form.tag" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            ความยาก
            <select v-model="form.difficulty" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            จำนวน studs
            <input v-model.number="form.studs" type="number" min="0" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600">
            ขนาด (เช่น 48x48)
            <input v-model.trim="form.size" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </label>
          <label class="space-y-1 text-[11px] font-semibold text-slate-600 md:col-span-2">
            รูปภาพ (URL)
            <input v-model.trim="form.image" type="url" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
          </label>
        </div>
        <label class="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
          <input v-model="form.active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          แสดงบนหน้าเว็บ
        </label>
        <div class="flex flex-wrap items-center gap-2">
          <button type="submit" class="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60" :disabled="saving">
            {{ form.id ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า' }}
          </button>
          <button type="button" class="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50" :disabled="saving" @click="resetForm">
            เคลียร์
          </button>
          <p v-if="saveError" class="text-xs text-rose-600">{{ saveError }}</p>
          <p v-else-if="saveSuccess" class="text-xs text-emerald-600">{{ saveSuccess }}</p>
        </div>
      </form>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import BaseModal from '~/components/ui/BaseModal.vue';

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
  priceInstructions: 0,
  tag: '',
  studs: 0,
  difficulty: 'Beginner',
  size: '',
  image: '',
  active: true
});

const saveSuccess = ref('');
const showModal = ref(false);

const resetForm = () => {
  form.id = null;
  form.name = '';
  form.slug = '';
  form.priceKit = 0;
  form.priceInstructions = 0;
  form.tag = '';
  form.studs = 0;
  form.difficulty = 'Beginner';
  form.size = '';
  form.image = '';
  form.active = true;
  saveSuccess.value = '';
};

const editProduct = (p: any) => {
  form.id = p.id ?? null;
  form.name = p.name ?? '';
  form.slug = p.slug ?? '';
  form.priceKit = p.price ?? p.metadata?.priceKit ?? 0;
  form.priceInstructions = p.metadata?.priceInstructions ?? p.price ?? 0;
  form.tag = p.metadata?.tag ?? '';
  form.studs = p.metadata?.studs ?? 0;
  form.difficulty = p.metadata?.difficulty ?? 'Beginner';
  form.size = p.metadata?.size ?? '';
  form.image = p.metadata?.image ?? '';
  form.active = p.active !== false;
  saveSuccess.value = '';
  showModal.value = true;
};

const handleSubmit = () => {
  saveSuccess.value = '';
  const payload = { ...form };
  if (!payload.slug && payload.name) {
    payload.slug = payload.name.trim().toLowerCase().replace(/\s+/g, '-');
  }
  emit('save', payload);
};

const closeModal = () => {
  showModal.value = false;
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
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
</script>

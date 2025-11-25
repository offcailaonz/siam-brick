<template>
  <form class="space-y-3" @submit.prevent="handleSubmit">
    <div class="grid gap-2 sm:grid-cols-2">
      <div>
        <label class="text-[11px] font-semibold text-slate-600"
          >ชื่อ นามสกุล</label
        >
        <input
          v-model.trim="local.recipient_name"
          type="text"
          class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label class="text-[11px] font-semibold text-slate-600"
          >หมายเลขโทรศัพท์</label
        >
        <input
          v-model.trim="local.phone"
          type="tel"
          class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
    <div class="space-y-1">
      <label class="text-[11px] font-semibold text-slate-600"
        >ค้นหาเขต/แขวง/จังหวัด/รหัสไปรษณีย์</label
      >
      <div class="relative">
        <input
          v-model="areaQuery"
          type="search"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="พิมพ์เช่น บางรัก กรุงเทพ 10500"
          @focus="ensureDataLoaded"
          @input="handleAreaInput"
          @blur="handleAreaBlur"
          @keydown="handleAreaKeyDown"
        />
        <div
          v-if="areaQuery && filteredSuggestions.length"
          class="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
          v-auto-animate
        >
          <button
            v-for="(suggestion, idx) in filteredSuggestions"
            :key="idx"
            type="button"
            class="w-full px-3 py-2 text-left text-sm hover:bg-indigo-50"
            @mousedown.prevent="handleSuggestionMouseDown"
            @click="applySuggestion(suggestion)"
          >
            <p class="font-semibold text-slate-800">
              {{ suggestion.subdistrict }} · {{ suggestion.district }}
            </p>
            <p class="text-xs text-slate-600">
              {{ suggestion.province }} {{ suggestion.postcode }}
            </p>
          </button>
        </div>
      </div>
      <p class="text-[11px] text-slate-500">
        เลือกจากผลลัพธ์เพื่อเติม จังหวัด/อำเภอ/ตำบล/รหัสไปรษณีย์ อัตโนมัติ
      </p>
      <p v-if="areaValidationError" class="text-[11px] text-rose-600">
        {{ areaValidationError }}
      </p>
      <div v-if="searching" class="text-[11px] text-slate-500">
        กำลังโหลดข้อมูลจังหวัด/อำเภอ/ตำบล...
      </div>
      <div
        v-if="addressSearchError"
        class="text-[11px] text-rose-600 flex items-center gap-2"
      >
        <span>{{ addressSearchError }}</span>
        <button
          type="button"
          class="rounded-full border border-rose-200 px-2 py-0.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
          @click="ensureDataLoaded"
        >
          ลองโหลดอีกครั้ง
        </button>
      </div>
    </div>
    <div>
      <label class="text-[11px] font-semibold text-slate-600"
        >ที่อยู่ (ระบุถนน/บ้านเลขที่)</label
      >
      <textarea
        v-model.trim="local.address_line"
        rows="2"
        class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
    <label
      v-if="showDefaultToggle"
      class="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
    >
      <input
        v-model="local.is_default"
        type="checkbox"
        class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      ตั้งเป็นที่อยู่หลัก
    </label>
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="submit"
        class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="submitDisabled"
      >
        <span v-if="loading">กำลังบันทึก...</span>
        <span v-else>{{ submitLabel }}</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        @click="handleReset"
      >
        เคลียร์ฟอร์ม
      </button>
      <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
      <p v-if="savedMessage" class="text-xs text-emerald-600">
        {{ savedMessage }}
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue';
import type { UserAddress } from '~/composables/useAddresses';
import { useThaiAddressSearch } from '~/composables/useThaiAddressSearch';

const props = defineProps<{
  modelValue?: Partial<UserAddress>;
  loading?: boolean;
  error?: string | null;
  savedMessage?: string | null;
  showDefaultToggle?: boolean;
  submitLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: Partial<UserAddress>): void;
  (e: 'reset'): void;
  (e: 'update:modelValue', value: Partial<UserAddress>): void;
}>();

const { loadAddressData, searchAddress, loading: addressLoading, error: searchError } = useThaiAddressSearch();

const local = reactive<Partial<UserAddress>>({
  recipient_name: '',
  phone: '',
  address_line: '',
  province: '',
  district: '',
  subdistrict: '',
  postcode: '',
  is_default: false
});

const areaQuery = ref('');
const hasSelectedArea = ref(false);
const areaValidationError = ref<string | null>(null);
const selectingSuggestion = ref(false);
const searching = computed(() => addressLoading.value);
const addressSearchError = computed(() => searchError.value);
const filteredSuggestions = computed(() => {
  if (!areaQuery.value) return [];
  return searchAddress(areaQuery.value, 15);
});

const ensureDataLoaded = () => {
  loadAddressData();
};

onMounted(() => {
  ensureDataLoaded();
});

const applySuggestion = (suggestion: any) => {
  local.province = suggestion.province;
  local.district = suggestion.district;
  local.subdistrict = suggestion.subdistrict;
  local.postcode = suggestion.postcode;
  areaQuery.value = `${suggestion.subdistrict} ${suggestion.district} ${suggestion.province} ${suggestion.postcode}`;
  hasSelectedArea.value = true;
  areaValidationError.value = null;
  emit('update:modelValue', { ...local });
  selectingSuggestion.value = false;
};

const clearAreaFields = () => {
  local.province = '';
  local.district = '';
  local.subdistrict = '';
  local.postcode = '';
  hasSelectedArea.value = false;
};

const clearAreaSelection = () => {
  clearAreaFields();
  areaQuery.value = '';
  areaValidationError.value = null;
  emit('update:modelValue', { ...local });
};

const handleAreaInput = () => {
  clearAreaFields();
  areaValidationError.value = null;
};

const handleAreaBlur = () => {
  if (selectingSuggestion.value) return;
  if (!hasSelectedArea.value && areaQuery.value) {
    clearAreaSelection();
  }
};

const handleAreaKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    if (!areaQuery.value && !local.province && !local.district && !local.subdistrict && !local.postcode) return;
    event.preventDefault();
    clearAreaSelection();
  }
};

const handleSuggestionMouseDown = () => {
  // ป้องกัน blur เคลียร์ค่าก่อนกดเลือก suggestion
  selectingSuggestion.value = true;
};

watch(
  () => props.modelValue,
  (next) => {
    if (!next) return;
    Object.assign(local, next);
    const text = [next.subdistrict, next.district, next.province, next.postcode].filter(Boolean).join(' ');
    areaQuery.value = text;
    hasSelectedArea.value = Boolean(next.subdistrict && next.district && next.province && next.postcode);
    areaValidationError.value = null;
  },
  { immediate: true, deep: true }
);

watch(
  local,
  (next) => {
    emit('update:modelValue', { ...next });
  },
  { deep: true }
);

const handleSubmit = () => {
  if (areaQuery.value && !hasSelectedArea.value) {
    areaValidationError.value = 'โปรดเลือกพื้นที่จากรายการให้ครบ หรือเคลียร์ช่องก่อนส่ง';
    return;
  }
  emit('submit', { ...local });
};

const handleReset = () => {
  Object.assign(local, {
    recipient_name: '',
    phone: '',
    address_line: '',
    province: '',
    district: '',
    subdistrict: '',
    postcode: '',
    is_default: false
  });
  areaQuery.value = '';
  hasSelectedArea.value = false;
  areaValidationError.value = null;
  emit('reset');
};

const submitLabel = computed(() => props.submitLabel || 'บันทึก');
const areaPendingSelection = computed(() => Boolean(areaQuery.value) && !hasSelectedArea.value);
const loading = computed(() => props.loading ?? false);
const submitDisabled = computed(() => loading.value || areaPendingSelection.value);
const error = computed(() => props.error || null);
const savedMessage = computed(() => props.savedMessage || null);
</script>

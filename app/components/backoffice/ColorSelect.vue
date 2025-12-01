<template>
  <div class="relative inline-block text-sm" ref="wrapper">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-left font-semibold shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      :class="selectedOption?.colorClass || 'border-slate-200 bg-white text-slate-700'"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="inline-flex items-center gap-2">
        <span
          class="h-3 w-3 rounded-full border border-white/70 shadow"
          :class="selectedOption?.colorClass || 'bg-slate-300'"
          aria-hidden="true"
        ></span>
        <span class="text-[12px] sm:text-sm text-slate-800">
          {{ selectedOption?.label || placeholder }}
        </span>
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="text-slate-500">
        <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed z-[12000] mt-1 w-[var(--color-select-width)] min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        :style="dropdownStyle"
        role="listbox"
      >
        <button
          v-for="option in options"
          :key="String(option.value ?? option.label)"
          type="button"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition hover:bg-slate-50"
          :class="option.colorClass || 'text-slate-700'"
          @click="select(option)"
        >
          <span
            class="h-3 w-3 rounded-full border border-white/70 shadow"
            :class="option.colorClass || 'bg-slate-300'"
            aria-hidden="true"
          ></span>
          <span class="font-semibold">{{ option.label }}</span>
        </button>
        <div v-if="!options.length" class="px-3 py-2 text-xs text-slate-500">ไม่มีตัวเลือก</div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type Option = { label: string; value: any; colorClass?: string };

const props = defineProps<{
  modelValue: any;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const open = ref(false);
const wrapper = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

const selectedOption = computed(() => props.options.find((opt) => opt.value === props.modelValue));

const toggle = () => {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    nextTick(() => {
      positionDropdown();
    });
  }
};

const select = (option: Option) => {
  emit('update:modelValue', option.value);
  open.value = false;
};

const positionDropdown = () => {
  if (!wrapper.value) return;
  const rect = wrapper.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    '--color-select-width': `${rect.width}px`
  };
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (wrapper.value && !wrapper.value.contains(target)) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const placeholder = computed(() => props.placeholder ?? 'เลือกตัวเลือก');
</script>

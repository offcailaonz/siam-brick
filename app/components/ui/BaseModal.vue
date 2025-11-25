<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[6000] flex items-center justify-center bg-slate-900/70 px-4"
        @keydown.escape.prevent.stop="emitClose"
      >
        <Transition name="modal-scale">
          <div v-if="open" class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                @click="emitClose"
                aria-label="ปิดหน้าต่าง"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m7 7 10 10M7 17 17 7" />
                </svg>
              </button>
            </header>
            <div class="px-5 py-4">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const emitClose = () => emit('close');
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 180ms ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: opacity 180ms ease, transform 200ms ease;
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>

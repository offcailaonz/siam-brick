<template>
  <div class="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
    <div class="max-w-xl rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow">
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">เข้าสู่ระบบ</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900">เข้าสู่ระบบเพื่อดำเนินการต่อ</h1>
      <p class="mt-3 text-sm text-slate-600">
        หากคุณไม่ได้เห็นหน้าต่างเข้าสู่ระบบ ให้กดปุ่มด้านล่างเพื่อเปิดใหม่
      </p>
      <div class="mt-6 flex justify-center">
        <button
          type="button"
          class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
          @click="openAuthModal"
        >
          เปิดหน้าต่างเข้าสู่ระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import { useRouter } from '#imports';

const router = useRouter();
const { user, openAuthModal, closeAuthModal } = useAuthFlow();

watch(
  () => user.value,
  (val) => {
    if (val) router.replace('/');
  }
);

onBeforeUnmount(() => {
  closeAuthModal();
});
</script>

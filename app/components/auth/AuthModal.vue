<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-900/70 p-4"
      @keydown.escape.prevent.stop="emitClose"
    >
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">เข้าสู่ระบบด้วย Supabase</p>
            <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
          </div>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            @click="emitClose"
            aria-label="ปิดหน้าต่างเข้าสู่ระบบ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m7 7 10 10M7 17 17 7" />
            </svg>
          </button>
        </div>

        <form class="space-y-4 px-5 py-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="auth-email">อีเมล</label>
            <input
              id="auth-email"
              v-model="email"
              type="email"
              required
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="auth-password">รหัสผ่าน</label>
            <input
              id="auth-password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>

          <p v-if="errorMessage" class="text-sm text-rose-600">{{ errorMessage }}</p>
          <p v-else-if="infoMessage" class="text-sm text-emerald-600">{{ infoMessage }}</p>

          <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
          >
            <span v-if="loading">กำลังดำเนินการ...</span>
            <span v-else>{{ ctaLabel }}</span>
          </button>

          <p class="text-center text-xs text-slate-500">
            <button type="button" class="font-semibold text-indigo-600 hover:underline" @click="toggleMode">
              {{ toggleLabel }}
            </button>
          </p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'authed'): void;
}>();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const mode = ref<'sign-in' | 'sign-up'>('sign-in');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const infoMessage = ref('');

const title = computed(() => (mode.value === 'sign-in' ? 'เข้าสู่ระบบ' : 'สมัครบัญชีใหม่'));
const ctaLabel = computed(() => (mode.value === 'sign-in' ? 'เข้าสู่ระบบ' : 'สมัครและเข้าสู่ระบบ'));
const toggleLabel = computed(() =>
  mode.value === 'sign-in' ? 'ยังไม่มีบัญชี? สมัครใช้งาน' : 'มีบัญชีแล้ว? กลับไปเข้าสู่ระบบ'
);

const emitClose = () => {
  emit('close');
};

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  infoMessage.value = '';

  if (mode.value === 'sign-in') {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });
    if (error) {
      errorMessage.value = error.message;
    } else {
      emit('authed');
    }
  } else {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    });
    if (error) {
      errorMessage.value = error.message;
    } else {
      infoMessage.value = data.session ? 'สมัครและเข้าสู่ระบบสำเร็จ' : 'สมัครสำเร็จ ตรวจสอบอีเมลเพื่อยืนยัน';
      if (data.session) emit('authed');
    }
  }

  loading.value = false;
};

const toggleMode = () => {
  mode.value = mode.value === 'sign-in' ? 'sign-up' : 'sign-in';
  errorMessage.value = '';
  infoMessage.value = '';
};

watch(
  () => user.value,
  (val) => {
    if (val && props.open) {
      emit('authed');
    }
  }
);
</script>

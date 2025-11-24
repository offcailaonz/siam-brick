<template>
  <div class="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center px-4">
    <main class="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl p-6 space-y-4">
      <header class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-400">Authentication</p>
        <h1 class="text-2xl font-bold text-white">{{ heading }}</h1>
        <p class="text-sm text-slate-300">{{ subheading }}</p>
      </header>

      <div v-if="status === 'loading'" class="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-3 text-sm text-slate-200">
        <span class="h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
        กำลังยืนยันโทเคน...
      </div>

      <div v-else-if="status === 'error'" class="space-y-3">
        <div class="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {{ errorMessage }}
        </div>
        <NuxtLink
          to="/"
          class="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
        >
          กลับหน้าแรก
        </NuxtLink>
      </div>

      <div v-else-if="status === 'success'" class="space-y-4">
        <div class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {{ successMessage }}
        </div>
        <div class="flex flex-col gap-2">
          <NuxtLink
            to="/profile"
            class="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            ไปที่โปรไฟล์
          </NuxtLink>
          <NuxtLink
            to="/"
            class="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
          >
            กลับหน้าแรก
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="status === 'recovery-ready'" class="space-y-4">
        <div class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          ยืนยันโทเคนรีเซ็ตรหัสผ่านแล้ว กรุณาตั้งรหัสผ่านใหม่
        </div>
        <form class="space-y-3" @submit.prevent="handleUpdatePassword">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-100" for="new-password">รหัสผ่านใหม่</label>
            <input
              id="new-password"
              v-model="newPassword"
              type="password"
              minlength="6"
              required
              class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-100" for="confirm-password">ยืนยันรหัสผ่าน</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              minlength="6"
              required
              class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
            />
          </div>

          <p v-if="formError" class="text-sm text-rose-200">{{ formError }}</p>
          <p v-else-if="formSuccess" class="text-sm text-emerald-200">{{ formSuccess }}</p>

          <button
            type="submit"
            class="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-amber-300 disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่' }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter, useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();

const status = ref<'loading' | 'success' | 'error' | 'recovery-ready'>('loading');
const errorMessage = ref('ไม่พบโทเคนยืนยัน หรือโทเคนไม่ถูกต้อง');
const successMessage = ref('ยืนยันอีเมลสำเร็จ คุณสามารถใช้งานได้แล้ว');
const typeParam = ref<string>('');
const friendlyError = (raw?: string) => {
  if (!raw) return 'ไม่สามารถยืนยันลิงก์ได้';
  const lower = raw.toLowerCase();
  if (raw.toLowerCase().includes('code verifier')) return 'ลิงก์นี้หมดอายุหรือใช้ไปแล้ว กรุณากดส่งลิงก์ใหม่จากอีเมลล่าสุด';
  if (lower.includes('expired') || lower.includes('expire')) return 'ลิงก์นี้หมดอายุแล้ว กรุณากดส่งลิงก์ใหม่จากอีเมลล่าสุด';
  return raw;
};

const newPassword = ref('');
const confirmPassword = ref('');
const submitting = ref(false);
const formError = ref('');
const formSuccess = ref('');

const attemptCloseOrRedirect = (path = '/profile') => {
  if (process.client && typeof window !== 'undefined') {
    window.close();
    setTimeout(() => router.push(path), 400);
  } else {
    router.push(path);
  }
};

const clearAuthParams = () => {
  if (process.client && typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.hash = '';
    url.searchParams.delete('code');
    url.searchParams.delete('token');
    url.searchParams.delete('token_hash');
    url.searchParams.delete('type');
    window.history.replaceState({}, document.title, url.pathname + url.search);
  }
};

const decodeJwtExp = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
};

const type = computed(() => typeParam.value);
const heading = computed(() => {
  if (status.value === 'recovery-ready') return 'ตั้งรหัสผ่านใหม่';
  if (type.value === 'recovery') return 'รีเซ็ตรหัสผ่าน';
  if (type.value === 'email_change') return 'ยืนยันอีเมลใหม่';
  return 'ยืนยันการสมัคร';
});
const subheading = computed(() => {
  if (status.value === 'recovery-ready') return 'สร้างรหัสผ่านใหม่เพื่อเข้าสู่ระบบ';
  if (type.value === 'recovery') return 'กำลังตรวจสอบลิงก์รีเซ็ตรหัสผ่าน';
  if (type.value === 'email_change') return 'กำลังยืนยันอีเมลใหม่ของคุณ';
  return 'กำลังยืนยันบัญชีของคุณ';
});

const handleUpdatePassword = async () => {
  formError.value = '';
  formSuccess.value = '';
  if (!newPassword.value || !confirmPassword.value) {
    formError.value = 'กรุณากรอกรหัสผ่านใหม่ให้ครบ';
    return;
  }
  if (newPassword.value.length < 6) {
    formError.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    formError.value = 'รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน';
    return;
  }
  submitting.value = true;
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword.value });
    if (error) {
      formError.value = error.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ';
      return;
    }
    formSuccess.value = 'เปลี่ยนรหัสผ่านสำเร็จ กำลังพากลับสู่โปรไฟล์...';
    setTimeout(() => {
      router.push('/profile');
    }, 800);
  } catch (err: any) {
    formError.value = err?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ';
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  const hasActiveSession = async () => {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  };

  // ถ้า session มีอยู่แล้ว (เช่น Supabase จัดการแลก code ไปก่อนหน้า) ให้ข้ามการแลกโทเคนซ้ำ
  typeParam.value = String(route.query.type || '');
  if (await hasActiveSession()) {
    clearAuthParams();
    if (typeParam.value === 'recovery') {
      status.value = 'recovery-ready';
      return;
    }
    status.value = 'success';
    successMessage.value = typeParam.value === 'email_change' ? 'อีเมลใหม่ถูกยืนยันแล้ว' : 'ยืนยันอีเมลสำเร็จ เข้าสู่ระบบแล้ว';
    setTimeout(() => attemptCloseOrRedirect('/profile'), 500);
    return;
  }

  if (process.client && typeof window !== 'undefined') {
    const hashParams = new URLSearchParams(window.location.hash ? window.location.hash.slice(1) : '');
    const hashType = hashParams.get('type') || '';
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const hashTokenHash = hashParams.get('token_hash');
    const expiresIn = hashParams.get('expires_in');
    typeParam.value = String(route.query.type || hashType || '');

    if (accessToken && refreshToken) {
      const exp = decodeJwtExp(accessToken);
      const nowSec = Math.floor(Date.now() / 1000);
      if (exp && exp < nowSec) {
        status.value = 'error';
        errorMessage.value = 'ลิงก์หมดอายุแล้ว กรุณากดส่งลิงก์ใหม่จากอีเมลล่าสุด';
        return;
      }
      if (expiresIn) {
        const expFromParam = nowSec + Number(expiresIn || 0);
        if (expFromParam < nowSec + 5) {
          status.value = 'error';
          errorMessage.value = 'ลิงก์หมดอายุแล้ว กรุณากดส่งลิงก์ใหม่จากอีเมลล่าสุด';
          return;
        }
      }
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      if (error) {
        status.value = 'error';
        errorMessage.value = friendlyError(error.message);
        return;
      }
      clearAuthParams();
      if (typeParam.value === 'recovery') {
        status.value = 'recovery-ready';
        return;
      }
      status.value = 'success';
      successMessage.value = typeParam.value === 'email_change' ? 'อีเมลใหม่ถูกยืนยันแล้ว' : 'ยืนยันอีเมลสำเร็จ เข้าสู่ระบบแล้ว';
      setTimeout(() => attemptCloseOrRedirect('/profile'), 500);
      return;
    }

    const tokenHashFromHash = hashTokenHash || '';
    if (tokenHashFromHash) {
      const { error } = await supabase.auth.verifyOtp({
        type: typeParam.value === 'email_change' ? 'email_change' : 'signup',
        token_hash: tokenHashFromHash
      });
      if (error) {
        status.value = 'error';
        errorMessage.value = friendlyError(error.message);
        return;
      }
      clearAuthParams();
      status.value = 'success';
      successMessage.value = typeParam.value === 'email_change' ? 'อีเมลใหม่ถูกยืนยันแล้ว' : 'ยืนยันอีเมลสำเร็จ เข้าสู่ระบบแล้ว';
      setTimeout(() => attemptCloseOrRedirect('/profile'), 500);
      return;
    }
  }

  typeParam.value = String(route.query.type || '');
  const tokenHash = (route.query.token_hash as string | undefined) || '';
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam.value === 'email_change' ? 'email_change' : 'signup',
      token_hash: tokenHash
    });
    if (error) {
      status.value = 'error';
      errorMessage.value = friendlyError(error.message);
      return;
    }
    clearAuthParams();
    status.value = 'success';
    successMessage.value = typeParam.value === 'email_change' ? 'อีเมลใหม่ถูกยืนยันแล้ว' : 'ยืนยันอีเมลสำเร็จ เข้าสู่ระบบแล้ว';
    setTimeout(() => attemptCloseOrRedirect('/profile'), 500);
    return;
  }

  const token = (route.query.code as string | undefined) || (route.query.token as string | undefined);
  if (!token) {
    if (await hasActiveSession()) {
      status.value = 'success';
      successMessage.value = 'คุณยืนยันอีเมลแล้วและอยู่ในระบบ';
      setTimeout(() => attemptCloseOrRedirect('/profile'), 500);
      return;
    }
    status.value = 'error';
    errorMessage.value = 'ไม่พบโทเคนในลิงก์ กรุณาลองใหม่จากอีเมลล่าสุด';
    return;
  }

  const { error } = await supabase.auth.exchangeCodeForSession(token);
  if (error) {
    status.value = 'error';
    errorMessage.value = friendlyError(error.message);
    return;
  }
  clearAuthParams();

  if (type.value === 'recovery') {
    status.value = 'recovery-ready';
    return;
  }

  status.value = 'success';
  if (type.value === 'email_change') {
    successMessage.value = 'อีเมลใหม่ถูกยืนยันแล้ว';
  } else {
    successMessage.value = 'ยืนยันอีเมลสำเร็จ เข้าสู่ระบบแล้ว';
  }

  setTimeout(() => {
    router.push('/profile');
  }, 800);
});
</script>

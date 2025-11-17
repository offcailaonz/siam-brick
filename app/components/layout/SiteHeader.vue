<template>
  <header class="sticky top-0 z-40 ">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-slate-900 font-semibold tracking-wide"
      >
        <img
          src="/logo.png"
          alt="Siam Brick Logo"
          class="h-10 w-10 rounded-md shadow"
        />
        <span
          class="text-3xl text-white 
           drop-shadow-[4px_0_0_black]
           drop-shadow-[-4px_0_0_black]
           drop-shadow-[0_4px_0_black]
           drop-shadow-[0_-4px_0_black]"
        >
          Siam Brick
        </span>
      </NuxtLink>
      <nav class="flex items-center gap-4 text-sm font-semibold text-white">
        <div v-if="user" class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-left">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 font-bold shadow">
              {{ userInitial }}
            </div>
            <div class="leading-tight">
              <p class="text-xs text-white/80">เข้าสู่ระบบแล้ว</p>
              <p class="text-sm font-semibold text-white truncate max-w-[140px]">
                {{ user.email }}
              </p>
            </div>
          </div>
          <button
            class="rounded-full border border-white/60 px-4 py-2 text-sm text-white hover:bg-white/10"
            type="button"
            :disabled="signingOut"
            @click="signOut"
          >
            {{ signingOut ? 'กำลังออก...' : 'ออกจากระบบ' }}
          </button>
        </div>
        <button
          v-else
          class="text-black rounded-full bg-yellow-400 px-4 py-2 text-sm"
          type="button"
          @click="openAuthModal"
        >
          <span> เข้าสู่ระบบ </span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSupabaseClient } from '#imports';

const { user, openAuthModal } = useAuthFlow();
const supabase = useSupabaseClient();
const signingOut = ref(false);

const userInitial = computed(() => {
  const email = user.value?.email ?? '';
  return email ? email.charAt(0).toUpperCase() : 'U';
});

const signOut = async () => {
  signingOut.value = true;
  await supabase.auth.signOut();
  signingOut.value = false;
};
</script>

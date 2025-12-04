<template>
  <header class="sticky top-0 z-40 ">
    <div>
      <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-semibold tracking-wide"
        >
          <img
            src="/logo.png"
            alt="Siam Brick Logo"
            class="h-10 w-10 rounded-md shadow"
          />
          <span
            class="hidden sm:inline text-2xl sm:text-3xl text-white drop-shadow-[4px_0_0_black] drop-shadow-[-4px_0_0_black] drop-shadow-[0_4px_0_black] drop-shadow-[0_-4px_0_black]"
          >
            Siam Brick
          </span>
        </NuxtLink>

        <nav class="ml-auto flex items-center gap-2 sm:gap-3 text-white">
          <!-- Mobile: logo + profile avatar + icon logout/login -->
          <div class="flex items-center gap-2 sm:hidden">
            <NuxtLink
              v-if="user"
              to="/profile"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30"
              :title="user.email || 'โปรไฟล์'"
            >
              <div
                class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white text-slate-900 font-bold shadow"
              >
                <img
                  v-if="profileAvatarUrl"
                  :src="profileAvatarUrl"
                  alt="โปรไฟล์"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <span v-else>{{ userInitial }}</span>
              </div>
              <span class="sr-only">โปรไฟล์</span>
            </NuxtLink>

            <button
              v-if="user"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white shadow-inner hover:bg-white/20 disabled:opacity-60"
              type="button"
              :disabled="signingOut"
              @click="signOut"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12H3m0 0 4-4m-4 4 4 4m3-12h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8"
                />
              </svg>
              <span class="sr-only">ออกจากระบบ</span>
            </button>

            <button
              v-else
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-slate-900 shadow hover:bg-yellow-500"
              type="button"
              @click="openAuthModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h12m0 0-4-4m4 4-4 4M6 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6"
                />
              </svg>
              <span class="sr-only">เข้าสู่ระบบ</span>
            </button>
          </div>

          <!-- Desktop / tablet -->
          <div class="hidden items-center gap-3 text-sm font-semibold sm:flex">
            <NuxtLink
              v-if="user"
              to="/profile"
              class="inline-flex items-center gap-3 rounded-full bg-white/15 px-2 py-1 shadow-inner ring-1 ring-white/25"
              :title="user.email || 'โปรไฟล์'"
            >
              <div
                class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white text-slate-900 font-bold shadow"
              >
                <img
                  v-if="profileAvatarUrl"
                  :src="profileAvatarUrl"
                  alt="โปรไฟล์"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <span v-else>{{ userInitial }}</span>
              </div>
              <div class="min-w-0 leading-tight text-left">
                <p class="text-[11px] text-white/80">เข้าสู่ระบบแล้ว</p>
                <p class="text-sm font-semibold text-white truncate max-w-[200px]">
                  {{ user.email }}
                </p>
              </div>
            </NuxtLink>

            <button
              v-if="user"
              class="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm text-white hover:bg-white/10"
              type="button"
              :disabled="signingOut"
              @click="signOut"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12H3m0 0 4-4m-4 4 4 4m3-12h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8"
                />
              </svg>
              <span>{{ signingOut ? 'กำลังออก...' : 'ออกจากระบบ' }}</span>
            </button>

            <button
              v-else
              class="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-yellow-500"
              type="button"
              @click="openAuthModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h12m0 0-4-4m4 4-4 4M6 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6"
                />
              </svg>
              <span>เข้าสู่ระบบ</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const { user, openAuthModal, signOut: signOutFromAuthFlow } = useAuthFlow();
const signingOut = ref(false);

const userInitial = computed(() => {
  const email = user.value?.email ?? '';
  return email ? email.charAt(0).toUpperCase() : 'U';
});

const profileAvatarUrl = computed(() => {
  const metadata = user.value?.user_metadata || {};
  return metadata.avatar_url || metadata.avatar || metadata.picture || metadata.image || null;
});

const signOut = async () => {
  signingOut.value = true;
  await signOutFromAuthFlow();
  signingOut.value = false;
};
</script>

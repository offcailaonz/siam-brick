<template>
  <main class="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 px-4 text-center">
    <p class="text-sm uppercase tracking-[0.4em] text-slate-500">Siam Brick</p>
    <h1 class="text-4xl font-semibold text-slate-900">Nuxt playground</h1>
    <p class="text-lg text-slate-600">
      โปรเจ็กต์นี้กำลังย้าย Brick Art Remix เข้ามาในโลกของ Vue แล้ว — ลอง component prototype ได้เลย
    </p>
    <NuxtLink
      to="/brick"
      class="rounded-full bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-indigo-500"
    >
      เปิด Brick Art Remix (Vue)
    </NuxtLink>
  </main>
</template>

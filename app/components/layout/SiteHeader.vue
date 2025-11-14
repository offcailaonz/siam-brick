<template>
  <header class="sticky top-0 z-40">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
      <NuxtLink to="/" class="flex items-center gap-2 text-slate-900 font-semibold tracking-wide">
        <span class="text-emerald-600">Siam</span> Brick
      </NuxtLink>
      <nav class="flex items-center gap-4 text-sm font-semibold text-slate-600">
        <NuxtLink to="/brick" class="hover:text-slate-900">ทดลองสร้าง</NuxtLink>
        <NuxtLink to="/shop" class="hover:text-slate-900">แกลเลอรี</NuxtLink>
        <button class="rounded-full bg-emerald-600 px-4 py-2 text-white text-sm">เข้าสู่ระบบ</button>
      </nav>
    </div>
  </header>
</template>

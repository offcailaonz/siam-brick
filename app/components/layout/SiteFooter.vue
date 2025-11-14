<template>
  <footer class="bg-slate-900 text-white py-10">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm">
      <p class="text-white/70">© {{ new Date().getFullYear() }} Siam Brick. สงวนสิทธิ์.</p>
      <div class="flex items-center gap-4 text-white/80">
        <NuxtLink to="/privacy" class="hover:text-white">นโยบายความเป็นส่วนตัว</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-white">ข้อตกลงการใช้บริการ</NuxtLink>
      </div>
    </div>
  </footer>
</template>

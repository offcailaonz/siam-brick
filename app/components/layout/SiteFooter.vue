<template>
  <footer class="text-white py-10 text-center">
    <div class="mx-auto md:flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm">
      <div>
        <p class="text-white/70">© {{ new Date().getFullYear() }} Siam Brick. สงวนสิทธิ์.</p>
      </div>
      <div class="md:flex items-center gap-4 text-white/80">
        <div class="mt-2 md:mt-0">
          <NuxtLink to="/privacy" class="hover:text-white">นโยบายความเป็นส่วนตัว</NuxtLink>
        </div>
        <div class="mt-2 md:mt-0">
          <NuxtLink to="/terms" class="hover:text-white">ข้อตกลงการใช้บริการ</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

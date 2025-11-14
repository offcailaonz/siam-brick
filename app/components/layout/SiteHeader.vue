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
        <!-- <NuxtLink
          to="/brick"
          class="hover:text-white/60 
         text-white
         drop-shadow-[2px_0_0_black]
         drop-shadow-[-2px_0_0_black]
         drop-shadow-[0_2px_0_black]
         drop-shadow-[0_-2px_0_black]"
        >
          ทดลองสร้าง
        </NuxtLink>

        <NuxtLink
          to="/shop"
          class="hover:text-white/60 
         text-white
         drop-shadow-[2px_0_0_black]
         drop-shadow-[-2px_0_0_black]
         drop-shadow-[0_2px_0_black]
         drop-shadow-[0_-2px_0_black]"
        >
          แกลเลอรี
        </NuxtLink> -->

        <button
          class="text-black rounded-full bg-yellow-400 px-4 py-2 text-sm"
        >
          <span> เข้าสู่ระบบ </span>
        </button>
      </nav>
    </div>
  </header>
</template>

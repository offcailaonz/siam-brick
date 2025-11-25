<template>
  <div class="min-h-screen bg-slate-900 text-slate-100">
    <div class="brick-bg--header">
      <SiteHeader />
    </div>
    <NuxtRouteAnnouncer />
    <main>
      <NuxtLayout>
        <Transition name="page-fade" mode="out-in" appear>
          <NuxtPage :page-key="route.fullPath" />
        </Transition>
      </NuxtLayout>
    </main>
    <div class="brick-bg--footer">
      <SiteFooter />
    </div>
    <AuthModal
      :open="authModalOpen"
      @close="closeAuthModal"
      @authed="handleAuthenticated"
    />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '~/components/layout/SiteHeader.vue';
import SiteFooter from '~/components/layout/SiteFooter.vue';
import AuthModal from '~/components/auth/AuthModal.vue';

const route = useRoute();
const { authModalOpen, closeAuthModal, handleAuthenticated } = useAuthFlow();
</script>
<style lang="scss">
@use 'sass:math';

@mixin brick-bg($color, $hue: 0deg) {
  $brick-peg-size: 15px;
  $brick-wall-thickness: 6px;
  $brick-square: $brick-peg-size + $brick-wall-thickness * 2;

  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;

    background-color: $color;
    background-image:
      radial-gradient($color math.div($brick-peg-size, 2), transparent calc(#{$brick-peg-size} / 2 + 1px)),
      radial-gradient(rgba(#fff, .4) math.div($brick-peg-size, 2), transparent calc(#{$brick-peg-size} / 2 + 1px)),
      radial-gradient(rgba(#000, .18) math.div($brick-peg-size, 2), transparent calc(#{$brick-peg-size} / 2 + math.div($brick-wall-thickness, 2))),
      radial-gradient(rgba(#000, .18) math.div($brick-peg-size, 2), transparent calc(#{$brick-peg-size} / 2 + math.div($brick-wall-thickness, 2)));

    background-size: $brick-square $brick-square;
    background-position:
      0px 0px,
      -0.5px -0.5px,
      0px 0px,
      math.div($brick-wall-thickness, 2) math.div($brick-wall-thickness, 2);

    background-repeat: repeat;

    filter: hue-rotate($hue);
  }
}

.brick-bg--header {
  @include brick-bg(#43a047, 0deg);
}

.brick-bg--footer {
  @include brick-bg(#0f172a, 0deg);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 220ms ease;
  will-change: opacity;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="brick-bg--header">
      <SiteHeader />
    </div>
    <NuxtRouteAnnouncer />
    <main>
      <NuxtPage />
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

const { authModalOpen, closeAuthModal, handleAuthenticated } = useAuthFlow();
</script>
<style lang="scss">
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
      radial-gradient($color $brick-peg-size/2, transparent $brick-peg-size/2+1px),
      radial-gradient(rgba(#fff, .4) $brick-peg-size/2, transparent $brick-peg-size/2+1px),
      radial-gradient(rgba(#000, .18) $brick-peg-size/2, transparent $brick-peg-size/2+$brick-wall-thickness/2),
      radial-gradient(rgba(#000, .18) $brick-peg-size/2, transparent $brick-peg-size/2+$brick-wall-thickness/2);

    background-size: $brick-square $brick-square;
    background-position:
      0px 0px,
      -0.5px -0.5px,
      0px 0px,
      $brick-wall-thickness/2 $brick-wall-thickness/2;

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
</style>

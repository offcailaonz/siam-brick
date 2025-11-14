<template>
  <main class="bg-slate-50 text-slate-900">
    <LandingHeroBanner :data="hero" />
    <div class="hero-banner">
      <section class="mx-auto max-w-6xl px-6 pb-16">
        <h2 class="py-4 text-center text-3xl font-bold text-white">
          ลองใช้งาน Generate Brick Pixel ได้ทันที
        </h2>
        <BrickArtRemixApp
          :initial-resolution="{ width: 128, height: 128 }"
          :show-step4="false"
          redirect-on-upload="/brick"
          default-image-src="/zuzu.png"
          :initial-crop-interaction="demoCropInteraction"
        />
      </section>
    </div>
    <LandingReadyKitsGrid :kits="readyKits" />
    <LandingSplitCtaSection />
    <LandingStepsTimeline :steps="steps" />
    <LandingMaterialsSection :materials="materials" />
    <LandingShowcaseGrid :showcase="showcase" />
    <LandingFaqAccordion :faqs="faqs" />
    <LandingComingSoonSection />
  </main>
</template>

<script setup lang="ts">
import LandingHeroBanner from '~/components/landing/HeroBanner.vue';
import LandingReadyKitsGrid from '~/components/landing/ReadyKitsGrid.vue';
import LandingSplitCtaSection from '~/components/landing/SplitCtaSection.vue';
import LandingStepsTimeline from '~/components/landing/StepsTimeline.vue';
import LandingMaterialsSection from '~/components/landing/MaterialsSection.vue';
import LandingShowcaseGrid from '~/components/landing/ShowcaseGrid.vue';
import LandingFaqAccordion from '~/components/landing/FaqAccordion.vue';
import LandingComingSoonSection from '~/components/landing/ComingSoonSection.vue';

import { heroData, readyKits, steps, materials, showcase, faqs } from '~/mockup-api-data';

const hero = heroData;
const demoCropInteraction = {
    "active": false,
    "type": null,
    "startX": 419.76953125,
    "startY": 392.1484375,
    "containerWidth": 301.328125,
    "containerHeight": 301.328125,
    "rectSnapshot": {
        "left": 0.25186673580502983,
        "top": 0,
        "width": 0.45112781954887216,
        "height": 0.45112781954887216
    }
};
</script>
<style>
.hero-banner {
  position: relative;
  z-index: 1;
  overflow: hidden; /* กัน ::before เกินขอบ */
}

.hero-banner::before {
  content: "";
  position: absolute;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  z-index: -1;

  background-image:
    linear-gradient(rgba(0, 0, 0, 0.59) ,rgba(0, 0, 0, 0.15)),
    url("/mockup-api-data/images/hero/bg-banner.png");

  background-size: cover;
  background-position: center;

  /* ใช้เฉพาะ background ไม่โดนเนื้อหา */
  filter: hue-rotate(280deg);
}
</style>

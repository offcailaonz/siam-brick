<template>
  <main class="bg-slate-50 text-slate-900">
    <LandingHeroBanner :data="hero" />
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
</script>

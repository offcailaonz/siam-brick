<template>
  <main class="bg-slate-50 text-slate-900">
    <div class="brick-bg--hero">
      <LandingHeroBanner :data="hero" @view-gallery="scrollToReady" />
    </div>

    <div class="brick-bg--generator">
      <section class="mx-auto max-w-6xl px-6 py-16">
        <h2 class="pb-6 text-center text-3xl font-bold text-white">
          ลองใช้งาน Generate Brick Pixel ได้ทันที
        </h2>
        <BrickArtRemixApp
          :initial-resolution="{ width: 64, height: 64 }"
          :show-step4="false"
          redirect-on-upload="/brick"
          default-image-src="/zuzu.png"
          :initial-crop-interaction="demoCropInteraction"
        />
      </section>
    </div>

    <div class="brick-bg--coming">
      <LandingComingSoonSection />
    </div>

    <div class="brick-bg--readykits" ref="readyKitsRef">
      <LandingReadyKitsGrid :kits="readyKits" :loading="readyKitsPending && !(readyKitsData?.length)" />
    </div>

    <div class="brick-bg--faq">
      <LandingStepsTimeline :steps="steps" />
      <LandingMaterialsSection :materials="materials" />
      <LandingFaqAccordion :faqs="faqs" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import LandingHeroBanner from '~/components/landing/HeroBanner.vue';
import LandingReadyKitsGrid from '~/components/landing/ReadyKitsGrid.vue';
import LandingStepsTimeline from '~/components/landing/StepsTimeline.vue';
import LandingMaterialsSection from '~/components/landing/MaterialsSection.vue';
import LandingShowcaseGrid from '~/components/landing/ShowcaseGrid.vue';
import LandingFaqAccordion from '~/components/landing/FaqAccordion.vue';
import LandingComingSoonSection from '~/components/landing/ComingSoonSection.vue';

import { heroData, readyKits as mockReadyKits, steps, materials, showcase, faqs } from '~/mockup-api-data';

const hero = heroData;
const readyKitsRef = ref<HTMLElement | null>(null);
const supabase = useSupabaseClient();
const { data: readyKitsData, pending: readyKitsPending } = await useAsyncData('ready-kits', async () => {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, price, active, metadata')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(12);
  if (error) throw error;
  return (
    data?.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tag: p.metadata?.tag ?? p.type ?? 'พร้อมสร้าง',
      size: p.metadata?.size ?? 'ขนาดกำลังดี',
      studs: p.metadata?.studs ?? 0,
      difficulty: p.metadata?.difficulty ?? 'Beginner',
      priceKit: p.price ?? p.metadata?.priceKit ?? 0,
      priceInstructions: p.metadata?.priceInstructions ?? p.price ?? 0,
      image: p.metadata?.image ?? '/placeholder.png'
    })) ?? []
  );
});
const readyKits = computed(() => readyKitsData.value?.length ? readyKitsData.value : mockReadyKits);
const scrollToReady = () => {
  readyKitsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
const demoCropInteraction = {
    "active": false,
    "type": null,
    "startX": 397.7109375,
    "startY": 460.4765625,
    "containerWidth": 301.328125,
    "containerHeight": 301.328125,
    "rectSnapshot": {
        "left": 0.24904070521130414,
        "top": 0,
        "width": 0.45112781954887216,
        "height": 0.45112781954887216
    }
};
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

/* HERO — แดงอิฐเข้ม ไม่จิ๊ด */
.brick-bg--hero {
  @include brick-bg(#B91C1C, 0deg);
}

/* GENERATOR — น้ำเงินเข้ม น่าเชื่อถือ */
.brick-bg--generator {
  @include brick-bg(#1E3A8A, 0deg);
}

/* READY KITS — เขียวอมฟ้า สุภาพ */
.brick-bg--readykits {
  @include brick-bg(#0F766E, 0deg);
}

/* STEPS — ม่วงกรมท่า ดูมี structure */
.brick-bg--steps {
  @include brick-bg(#4338CA, 0deg);
}

/* MATERIALS — น้ำตาลอิฐ ดูเป็นวัสดุจริงจัง */
.brick-bg--materials {
  @include brick-bg(#7C2D12, 0deg);
}

/* FAQ — ฟ้าเทาเข้ม อ่านง่าย ดูน่าเชื่อถือ */
.brick-bg--faq {
  @include brick-bg(#334155, 0deg);
}

/* coming — น้ำเงินเทาเกือบดำ ปิดท้ายเว็บ */
.brick-bg--coming {
  @include brick-bg(#0F172A, 0deg);
}
</style>

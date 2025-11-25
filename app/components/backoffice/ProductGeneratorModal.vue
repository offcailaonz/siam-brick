<template>
  <BaseModal :open="open" title="สร้างสินค้าใหม่จากรูป" max-width-class="max-w-6xl" @close="$emit('close')">
    <div class="space-y-2 text-sm text-slate-600">
      <ClientOnly>
        <BrickArtRemixApp
          :show-step4="false"
          :enable-persistence="false"
          :show-generate-action="true"
          generate-label="ใช้ผลลัพธ์นี้"
          :default-image-src="defaultImage"
          @generated="handleGenerated"
        />
      </ClientOnly>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '~/components/ui/BaseModal.vue';
import BrickArtRemixApp from '~/components/BrickArtRemix/BrickArtRemixApp.vue';

defineProps<{
  open: boolean;
  defaultImage?: string | null;
}>();

const emit = defineEmits<{
  (
    e: 'generated',
    payload: {
      preview: string | null;
      studs: number;
      studUsage: Array<{ hex: string; name?: string; count: number }>;
      resolution: { width: number; height: number };
    }
  ): void;
  (e: 'close'): void;
}>();

const handleGenerated = (payload: any) => {
  emit('generated', payload);
};
</script>

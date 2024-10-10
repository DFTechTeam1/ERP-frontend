<template>
    <div>
      <div
        class="d-flex align-center"
        v-if="props.info.images.length">
        <template
          v-for="(image, x) in props.info.images"
          :key="x">
          <v-img
            :src="image.image"
            :width="100"></v-img>
        </template>
      </div>

      <div v-else>
        <v-empty-state
          :title="t('noDataToDispay')"
          :text="t('familyDataWillDisplayHere')"
          image="/paper.png"
        ></v-empty-state>
      </div>
    </div>
</template>

<script setup>

import {useI18n} from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
    info: {
        type: Object,
        required: true,
    },
})
</script>

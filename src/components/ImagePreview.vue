<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  mediaPath: String,
  isShow: Boolean
});

const emit = defineEmits(['close-event']);

const show = ref(false);

watch(props, (values) => {
  if (values.isShow) {
    show.value = values.isShow;
  }
});

function updatePreviewState(event) {
  show.value = event;

  emit("close-event", event);
}
</script>

<template>
  <v-dialog
    max-width="1000"
    @update:modelValue="updatePreviewState"
    v-model="show">
    <v-card>
      <v-card-text>
        <v-img
          height="500"
          :style="{borderRadius: '12px'}"
          :src="props.mediaPath"></v-img>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.preview-image-wrapper {
  position: fixed;
  margin: 0 auto;
  display: flex;
  z-index: 999999999;
}
</style>

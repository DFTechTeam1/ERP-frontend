<template>
    <div>
        <div class="w-100">
            <template v-if="(props.image) && (props.image)">
                <div 
                    class="mb-3 position-relative img-preview-wrapper"
                    :id="'img-wrapper-' + props.keyImage"
                    @click="$emit('delete-image-event')">
                    <v-img
                        :src="props.image"
                        rounded
                        width="100"></v-img>
                    <v-icon
                        class="position-absolute"
                        :icon="mdiCloseCircle"
                        size="20"
                        color="red"></v-icon>
                </div>
            </template>
            <file-pond-com
                ref="pond"
                v-on:addfile="updateImageValue"
                class-name="my-pond"
                label-idle="Drop files here..."
                allow-multiple="true"
                :accepted-file-types="props.allowedTypes"
                :max-files="props.maxFiles"
            ></file-pond-com>
        </div>
    </div>
</template>

<style scoped lang="scss">
.img-preview-wrapper {
    width: 100px;

    i {
        top: -10px;
        right: -10px;
        cursor: pointer;
    }
}
</style>

<script setup>
import { mdiCloseCircle } from '@mdi/js';
import { ref } from 'vue';

const pond = ref(null);

const props = defineProps({
    image: {
        type: String,
    },
    keyImage: {
        type: String,
    },
    maxFiles: {
        type: String,
        default: '1',
    },
    allowedTypes: {
        type: String,
        default: 'image/jpg, image/jpeg, image/png, image/webp',
    },
})

const emit = defineEmits(['delete-image-event', 'image-updated'])

function updateImageValue() {
    var _value = pond.value ? pond.value.getFile().file : '';
    emit('image-updated', {value: _value, key: props.keyImage});
}
</script>
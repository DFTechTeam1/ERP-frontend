<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    images: Array
});

const emit = defineEmits(['close-event']);

const show = ref(false);

function closeModal() {
    emit('close-event');
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        console.log(values.images);
    }
});
</script>

<template>
    <v-dialog
        @after-leave="closeModal"
        v-model="show"
        max-width="800">
        <!-- <master-card>
            <v-card-text :style="{
                padding: '0'
            }">
                <v-img :src="props.image"></v-img>
            </v-card-text>
        </master-card> -->

        <v-carousel show-arrows="hover" v-if="props.images">
            <v-carousel-item
                v-for="(image, i) in props.images"
                :key="i"
                :src="image"
                aspect-ratio="16/9"
                cover
            ></v-carousel-item>
        </v-carousel>
    </v-dialog>
</template>
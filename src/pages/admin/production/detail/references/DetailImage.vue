<template>
    <v-dialog
        v-model="show"
        max-width="600"
        v-on:afterLeave="closeModal">
        <v-card flat>
            <v-card-text v-if="props.image">
                <v-img
                    :src="props.image"></v-img>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const show = ref(false);

const emit = defineEmits(['close-detail-image']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
    },
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

function closeModal() {
    show.value = false;
    emit('close-detail-image');
}
</script>
<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="400">
        <v-card>

            <v-card-text>
                <p class="fw-bold mb-5">Copy and paste link below to your browser</p>
                <span id="link">{{ props.link }}</span>

                <v-btn
                    class="mt-5 w-100"
                    variant="flat"
                    color="primary"
                    @click.prevent="copyLink">
                    {{ $t('copy') }}
                </v-btn>
                <v-btn
                    class="mt-1 w-100"
                    variant="flat"
                    color="grey-lighten-1"
                    @click.prevent="$emit('close-download-view')">
                    {{ $t('close') }}
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { showNotification } from '@/compose/notification';

defineEmits(['close-download-view'])

const show = ref(false)

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
        default: '',
    },
});

function copyLink() {
    navigator.clipboard.writeText(props.link);

    showNotification('Link has been copied');
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
})
</script>
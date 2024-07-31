<template>
    <v-dialog v-model="show" persistent max-width="600">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('edit') }}

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form>
                    
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const show = ref(false)

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close-event'])

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})
</script>
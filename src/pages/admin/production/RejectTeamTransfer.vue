<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('reason') }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <field-input
                        :label="t('reason')"
                        v-model="reason"
                        class="mb-2"
                        :error-message="errors.reason"></field-input>

                    <v-btn
                        type="submit"
                        variant="flat"
                        color="primary"
                        class="w-100">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';

const { t } = useI18n()

const store = useProjectStore()

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: yup.object({
        reason: yup.string().required(t('reasonRequired')),
    }),
})

const emit = defineEmits(['close-event'])

const [reason] = defineField('reason')

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    transferUid: {
        type: String,
        default: '',
    },
})

const show = ref(false)

const loading = ref(false)

const validateData = handleSubmit(async (values) => {
    loading.value = true
    const resp = await store.rejectRequestTeam(values, props.transferUid)
    loading.value = false

    if (resp.status < 300) {
        emit('close-event', true)
    }
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})
</script>
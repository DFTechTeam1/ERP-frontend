<template>
    <v-dialog v-model="show"
        persistent
        max-width="600">
        <v-card>
            <v-card-item>
                <v-card-title>
                    <div class="d-flex align-center justify-space-between">
                        <p>{{ $t('reviseDetail') }}</p>

                        <v-icon
                            :icon="mdiClose"
                            size="20"
                            @click.prevent="closeForm"
                            color="red"></v-icon>
                    </div>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <field-input
                        :label="t('reason')"
                        class="mb-2"
                        v-model="reason"
                        :error-message="errors.reason"></field-input>

                    <v-label>{{ $t('previewImage') }}</v-label>
                    <file-pond-com
                        ref="pond"
                        class-name="my-pond"
                        label-idle="Drop files here..."
                        allow-multiple="true"
                        v-on:addfile="updateImages"
                        accepted-file-types="image/png, image/jpg, image/jpeg"
                    ></file-pond-com>
                    <div class="invalid-feedback" v-if="errors.file">{{ errors.file }}</div>

                    <v-btn variant="flat"
                        color="primary"
                        class="mt-4 w-100"
                        :disabled="loading"
                        type="submit">
                        {{ $t('save') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useProjectStore } from '@/stores/project'
import { mdiClose } from '@mdi/js'

const store = useProjectStore()

const { t } = useI18n()

const emit = defineEmits(['close-event'])

const { defineField, errors, setFieldValue, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        reason: yup.string().required(t('reasonRequired')),
        file: yup.array().nullable(),
    }),
})

const [reason] = defineField('reason')

const pond = ref(null)

const loading = ref(false)

const show = ref(false)

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    detail: {
        default: null,
    },
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

function updateImages() {
    if (pond.value.getFiles().length) {
        var images = [];
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            images.push(pond.value.getFiles()[a].file)
        }
        setFieldValue('file', images);
    } else {
        setFieldValue('file', null);
    }
}

function closeForm() {
    resetForm()
    emit('close-event')
}

const validateData = handleSubmit(async (values) => {
    loading.value = true
    var formData = new FormData()
    formData.append('reason', values.reason)
    if (values.file) {
        for (let a = 0; a < values.file.length; a++) {
            formData.append(`file[${a}]`, values.file[a]);
        }
    }
    const resp = await store.reviseTask(formData, props.detail.project.uid, props.detail.uid)
    loading.value = false

    if (resp.status < 300) {
        emit('close-event')
    }
})
</script>
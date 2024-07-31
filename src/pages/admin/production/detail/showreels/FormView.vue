<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p>{{ $t('uploadShowreels') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        @click.prevent="$emit('close-event')"
                        size="20"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text
                class="mt-5">
                <v-form
                    @submit="validateData">
                        <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="false"
                            v-on:updatefiles="updateImages"
                            accepted-file-types="video/mp4"
                        ></file-pond-com>
                        <div class="invalid-feedback" 
                            style="padding-inline: 16px;"
                            v-if="fileErrorRequired">
                            File is required
                        </div>

                        <v-btn
                            type="submit"
                            variant="flat"
                            color="primary"
                            class="mt-2 w-100">
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
import { mdiClose } from '@mdi/js'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

const store = useProjectStore()

const { detailProject } = storeToRefs(store)

const { setFieldValue, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        file: yup.array().required(t('fileRequired'))
    })
})

const show = ref(false)

const loading = ref(false)

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const pond = ref(null)

const fileErrorRequired = ref(true)

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

function updateImages() {
    if (pond.value.getFiles().length) {

        setFieldValue('file', pond.value.getFiles())
        fileErrorRequired.value = false;
    } else {
        setFieldValue('file', null)
        fileErrorRequired.value = true;
    }
}

const validateData = handleSubmit(async (values) => {
    var formData = new FormData()

    formData.append('file', values.file[0].file)

    const resp = await store.uploadShowreels(formData, detailProject.value.uid)

    if (resp.status < 300) {
        resetForm()
        emit('close-event')
    }
})
</script>
<template>
    <v-dialog v-model="show" persistent max-width="600">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('textImport') }}

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <v-label>{{ $t('chooseFile') }}</v-label>
                    <file-pond-com
                        ref="pond"
                        class-name="my-pond"
                        label-idle="Drop files here..."
                        allow-multiple="true"
                        v-on:addfile="updateImages"
                        accepted-file-types="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet"
                    ></file-pond-com>
                    <div class="invalid-feedback" v-if="errors.file">{{ errors.file }}</div>

                    <div class="text-end">
                        <p style="font-size: 12px; margin-top: 25px;">{{ $t('click') }} <span @click.prevent="downloadData" class="pointer fw-bold border-bottom"><i>{{ $t('here') }}</i></span> {{ $t('downloadEmployeeTemplateFile') }}</p>
                    </div>

                    <v-btn variant="flat"
                        color="primary"
                        class="mt-4 w-100"
                        :disabled="loading"
                        type="submit">
                        <template v-if="loading">{{ $t('uploadingData') }}</template>
                        <template v-else>
                            {{ $t('save') }}
                        </template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useEmployeesStore } from '@/stores/employees';

const { t } = useI18n()

const show = ref(false)

const store = useEmployeesStore()

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close-event'])

const { errors, setFieldValue, handleSubmit } = useForm({
    validationSchema: yup.object({
        excel: yup.string().nullable(),
    }),
})

const pond = ref(null)

const loading = ref(false)

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

function downloadData() {
    window.location.href = import.meta.env.VITE_API_URL + `/employees/downloadTemplate`;
}

function updateImages() {
    if (pond.value.getFiles().length) {
        var images = [];
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            images.push(pond.value.getFiles()[a].file)
        }
        setFieldValue('excel', images[0]);
    } else {
        setFieldValue('excel', null);
    }
}

const validateData = handleSubmit(async (values) => {
    loading.value = true
    var formData = new FormData()
    formData.append('excel', values.excel)
    const resp = await store.uploadImport(formData)
    loading.value = false

    if (resp.status < 300) {
        emit('close-event', true)
    }
})
</script>
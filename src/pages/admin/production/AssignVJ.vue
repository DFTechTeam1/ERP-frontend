<template>
    <v-dialog v-model="show"
        max-width="500"
        persistent>
        <master-card>
            <v-card-item>
                <v-card-text class="d-flex align-center justify-lg-space-between">
                    <p class="mb-0">{{ $t('assignVJ') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event', false)"></v-icon>
                </v-card-text>
            </v-card-item>

            <v-card-text>
                <template v-if="loading">
                    <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                    <p class="text-center">
                        <i>{{ $t('preparingData') }}</i>
                    </p>
                </template>
                <template v-else>
                    <v-form @submit="validateData">
                        <field-input
                            :label="t('selectEmployee')"
                            input-type="select"
                            :custom-options="true"
                            class="mb-3"
                            v-model="employee_id"
                            :error-message="errors.employee_id"
                            :select-options="employees"
                            :is-multiple="true">
                            <template v-slot:selectOption="{ props, item }">
                                <v-list-item v-bind="props">

                                    <template v-slot:title>
                                        {{ item.raw.title }}
                                    </template>
                                    <template v-slot:subtitle>
                                        {{ $t('inChargeOnProject', {num: item.raw.date}) }}
                                    </template>

                                </v-list-item>
                            </template>
                        </field-input>

                        <v-btn
                            variant="flat"
                            color="primary"
                            class="w-100"
                            :disabled="loadingSave"
                            type="submit">
                            <template v-if="loadingSave">
                                {{ $t('processing') }}
                            </template>
                            <template v-else>
                                {{ $t('save') }}
                            </template>
                        </v-btn>
                    </v-form>
                </template>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup'

const { t } = useI18n()

const store = useEmployeesStore()

const projectStore = useProjectStore()

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    projectUid: {
        type: String,
    },
})

const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        employee_id: yup.array().required(t('employeeRequired'))
    }),
})

const [employee_id] = defineField('employee_id')

const show = ref(false)

const loading = ref(false)

const loadingSave = ref(false)

const employees = ref([])

async function initVJ () {
    loading.value = true

    const resp = await store.getVJ(props.projectUid)
    if (resp.status < 300) {
        employees.value = resp.data.data
    }

    loading.value = false
}

const validateData = handleSubmit(async (values) => {
    loadingSave.value = true
    const resp = await projectStore.assignVj(values, props.projectUid)
    loadingSave.value = false

    if (resp.status < 300) {
        resetForm()
        emit('close-event', true)
    }
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }

    if (values.isShow) {
        initVJ()
    }
})
</script>

<template>
    <div>
        <template v-if="!detailOfEmployee">
            <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
        </template>
        <template v-else>
            <template v-if="loadingPrepare">
                <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                <p class="text-center">
                    {{ $t('preparingData') }}
                </p>
            </template>
            <template v-else>
                <v-form @submit="validateData">
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('company') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('company')"
                                v-model="company"
                                :is-solo="true"
                                density="compact"
                                :is-disabled="true"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('employeeID') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('employeeID')"
                                v-model="employee_id"
                                :is-solo="true"
                                density="compact"
                                :error-message="errors.employee_id"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('jobPosition') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('jobPosition')"
                                v-model="position_id"
                                input-type="select"
                                :is-solo="true"
                                density="compact"
                                :select-options="positions"
                                :error-message="errors.position_id"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('level') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('level')"
                                v-model="level"
                                input-type="select"
                                :is-solo="true"
                                density="compact"
                                :select-options="levels"
                                :error-message="errors.level"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('status') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('status')"
                                v-model="status"
                                input-type="select"
                                :is-solo="true"
                                density="compact"
                                :select-options="statusOptions"
                                :error-message="errors.status"></field-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('joinDate') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <date-picker
                                :label="t('joinDate')"
                                v-model="join_date"
                                :error-message="errors.join_date"></date-picker>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="5">
                            <p class="employee-detail-title">{{ $t('approvalLine') }}</p>
                        </v-col>
                        <v-col cols="12" md="7">
                            <field-input
                                :label="t('directSupervisor')"
                                v-model="boss_id"
                                :isRequired="isBossRequired"
                                inputType="select"
                                :select-options="listOfAllProjectManagers"
                                :error-message="errors.boss_id"></field-input>
                        </v-col>
                    </v-row>
        
                    <v-btn variant="flat" 
                        color="secondary" 
                        @click.prevent="$emit('close-event')"
                        :disabled="loading">{{ $t('cancel') }}</v-btn>
                    <v-btn variant="flat" 
                        class="ms-3" 
                        color="primary" 
                        type="submit"
                        :disabled="loading">
                        <template v-if="loading">
                            {{ $t('processing') }}
                        </template>
                        <template v-else>
                            {{ $t('save') }}
                        </template>
                    </v-btn>

                </v-form>
            </template>
        </template>
    </div>
</template>

<style scoped lang="scss">
.length-of-service {
    font-size: 12px !important;
    padding: 2px 6px;
    background: #e6e6e6;
    border-radius: 4px;
    font-weight: bold;
}
</style>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { usePositionStore } from '@/stores/position';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import * as yup from 'yup'

const store = useEmployeesStore()

const storePosition = usePositionStore()

const route = useRoute()

const { detailOfEmployee, listOfAllProjectManagers } = storeToRefs(store)

const { t } = useI18n()

const loading = ref(false)

const emit = defineEmits(['close-event'])

const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        company: yup.string().required(),
        employee_id: yup.string().required(),
        position_id: yup.string().required(),
        level: yup.string().required(),
        boss_id: yup.string()
            .when('level', {
                is: (value) => value != 'manager' && value != undefined,
                then: function () {
                    return yup.string().required(t('bossIdRequired'))
                },
                otherwise: function () {
                    return yup.string().nullable()
                },
            }),
        status: yup.number().required(),
        join_date: yup.string().required(),
    }),
    initialValues: {
        company: detailOfEmployee.value.data.data.company_name,
        employee_id: detailOfEmployee.value.data.data.employee_id,
        position_id: detailOfEmployee.value.data.data.position.uid,
        level: detailOfEmployee.value.data.data.level_staff,
        boss_id: detailOfEmployee.value.data.data.boss_uid,
        status: detailOfEmployee.value.data.data.status,
        join_date: detailOfEmployee.value.data.data.join_date,
    }
})

const [company] = defineField('company')
const [employee_id] = defineField('employee_id')
const [position_id] = defineField('position_id')
const [level] = defineField('level')
const [boss_id] = defineField('boss_id')
const [status] = defineField('status')
const [join_date] = defineField('join_date')

const levels = ref([
    {title: t('manager'), value: 'manager'},
    {title: t('lead'), value: 'lead'},
    {title: t('staff'), value: 'staff'},
    {title: t('juniorStaff'), value: 'junior_staff'},
])

const statusOptions = ref([
    {title: t('permanent'), value: 1},
    {title: t('contract'), value: 2},
    {title: t('partTime'), value: 3},
    {title: t('freelance'), value: 4},
    {title: t('internship'), value: 5},
])

const loadingPrepare = ref(false)

const isBossRequired = ref(false)

const positions = ref([])

async function initManager() {
    await store.getProjectManager()
}

async function initPosition() {
    const resp = await storePosition.getAll();

    if (resp.status < 300) {
        positions.value = resp.data.data;
    }
}

async function prepareAllData() {
    loadingPrepare.value = true
    await Promise.all([
        initPosition(),
        initManager(),
    ])
    loadingPrepare.value = false
}

watch(level, (values) => {
    if (values == 'manager') {
        isBossRequired.value = false
    } else {
        isBossRequired.value = true
    }
})

const validateData = handleSubmit(async (values) => {
    loading.value = true
    const resp = await store.updateEmployment(values, route.params.id)
    loading.value = false

    if (resp.status < 300) {
        resetForm()
        emit('close-event')
    }
})

onMounted(() => {
    prepareAllData()

    if ((detailOfEmployee) && (detailOfEmployee.value.data.data.level == 'manager')) {
        isBossRequired.value = false
    } else {
        isBossRequired.value = true
    }
})
</script>
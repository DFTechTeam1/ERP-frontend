<template>
    <div>
        <v-form>
            <v-row class="pt-4">
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('position')"
                        inputType="select"
                        v-model="position_id"
                        :error-message="errors.position_id"
                        :select-options="listOfAllPositions"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('level')"
                        v-model="level"
                        inputType="select"
                        :select-options="levels"
                        :error-message="errors.level"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('directSupervisor')"
                        v-model="boss_id"
                        :isRequired="isBossRequired"
                        inputType="select"
                        :select-options="listOfAllProjectManagers"
                        :error-message="errors.boss_id"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('status')"
                        v-model="status"
                        inputType="select"
                        :select-options="statusOptions"
                        :error-message="errors.status"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('placement')"
                        v-model="placement"
                        :error-message="errors.placement"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('company')"
                        v-model="company"
                        :is-readonly="true"
                        :error-message="errors.company"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <date-picker
                        :label="t('joinDate')"
                        v-model="join_date"
                        :error-message="errors.join_date"></date-picker>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <date-picker
                        :label="t('startReviewProbation')"
                        v-model="start_review_date"
                        :is-required="false"
                        :error-message="errors.start_review_date"></date-picker>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <date-picker
                        :label="t('endProbationDate')"
                        v-model="end_probation_date"
                        :is-required="false"
                        :error-message="errors.end_probation_date"></date-picker>
                </v-col>
            </v-row>
        </v-form>        
    </div>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees'
import { usePositionStore } from '@/stores/position'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useForm, useValidateForm } from 'vee-validate'
import * as yup from 'yup'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();

const { t } = useI18n();

const props = defineProps({
    detailData : {
        default: null,
    },
});

const { defineField, errors, values, setValues } = useForm({
    validationSchema: yup.object({
        position_id: yup.string().required(t('positionRequired')),
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
        placement: yup.string().required(),
        company: yup.string().nullable(),
        join_date: yup.string().required(),
        start_review_date: yup.string().nullable()
            .when('join_date', {
                is: (val) => val != undefined,
                then: function () {
                    return yup.date().min(join_date.value, t('dateMustBeGreater', {date: join_date.value})).nullable();
                },
                otherwise: function () {
                    return yup.string().nullable();
                },
            }),
        end_probation_date: yup.string().nullable()
            .when('start_review_date', {
                is: (val) => val != undefined,
                then: function() {
                    return yup.date().min(start_review_date.value, t('dateMustBeGreater', {date: start_review_date.value})).nullable();
                },
                otherwise: function () {
                    return yup.string().nullable();
                },
            }),
    }),
    initialValues: {
        company: 'DFactory',
    },
})

const [position_id] = defineField('position_id')
const [boss_id] = defineField('boss_id')
const [level] = defineField('level')
const [status] = defineField('status')
const [placement] = defineField('placement')
const [company] = defineField('company')
const [join_date] = defineField('join_date')
const [start_review_date] = defineField('start_review_date')
const [end_probation_date] = defineField('end_probation_date')

const isBossRequired = ref(false)

const store = useEmployeesStore();
const storePosition = usePositionStore()

onMounted(() => {
    console.log('mounted job', props.detailData);
    initPosition()

    if (route.params.id) {
        if (props.detailData) {
            setValues({
                position_id: props.detailData.position.uid,
                level: props.detailData.level_staff,
                boss_id: props.detailData.boss_id || '',
                status: props.detailData.status,
                placement: props.detailData.placement,
                join_date: props.detailData.join_date,
                start_review_date: props.detailData.start_review_probation_date,
                end_probation_date: props.detailData.end_probation_date,
            });
        }
    }
});

watch(level, (values) => {
    if (values == 'manager') {
        isBossRequired.value = false
    } else {
        isBossRequired.value = true
    }

    store.getProjectManager();
})

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

const initPosition = async () => {
    await storePosition.getAll()
}

const { 
    listOfAllPositions,
 } = storeToRefs(storePosition)

const { 
    listOfAllProjectManagers
 } = storeToRefs(store)

const storeJobDetail = () => {
    store.storeJobDetail(values)
}

const validateJobDetail = useValidateForm()

defineExpose({
    storeJobDetail,
    validateJobDetail,
})
</script>
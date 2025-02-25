<script setup>
import { showNotification } from '@/compose/notification';
import { useEmployeesStore } from '@/stores/employees';
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { usePositionStore } from '@/stores/position';
import { mdiClose } from '@mdi/js';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close-event']);

const { t } = useI18n();

const store = usePerformanceReportStore();

const storeEmployee = useEmployeesStore();

const storePosition = usePositionStore();

const {
    listOfAllEmployees
} = storeToRefs(storeEmployee);

const { defineField, handleSubmit, errors, resetForm } = useForm({
    validationSchema: yup.object({
        all_employee: yup.boolean(),
        start_date: yup.string().nullable(),
        end_date: yup.string().nullable(),
        employee_uids: yup.array().nullable(),
        position_uids: yup.array().nullable()
    }),
    initialValues: {
        all_employee: '1'
    }
})

const [all_employee] = defineField('all_employee');
const [start_date] = defineField('start_date');
const [end_date] = defineField('end_date');
const [employee_uids] = defineField('employee_uids');
const [position_uids] = defineField('position_uids');

const positions = ref([]);

const show = ref(false);

const loading = ref(false);

const submitData = handleSubmit(async (values) => {
    if (values.start_date) {
        values.start_date = moment(values.start_date, "YYYY, MMMM DD").format("YYYY-MM-DD");
    } else {
        values.start_date = null;
    }
    if (values.end_date) {
        values.end_date = moment(values.end_date, "YYYY, MMMM DD").format("YYYY-MM-DD");
    } else {
        values.end_date = null;
    }

    if (!values.employee_uids) {
        values.employee_uids = [];
    }
    if (!values.position_uids) {
        values.position_uids = [];
    }
    
    console.log("values", values);

    loading.value = true;
    const resp = await store.exportData(values);
    loading.value = false;

    console.log("res.export", resp);

    if (resp.status < 300) {
        resetForm();
        emit('close-event');
        window.open(resp.data.data.path, '_blank');
    } else {
        showNotification(resp.response.data.message, 'error');
    }
});

async function initEmployee() {
    await storeEmployee.getAll();
}

async function initPosition() {
    const resp = await storePosition.getAll();

    positions.value = resp.data.data;
}

async function prepareData() {
    await Promise.all([
        initEmployee(),
        initPosition()
    ]);
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        if (values.isShow) {
            prepareData();
        }
    }
});
</script>

<template>
    <v-dialog v-model="show"
        persistent
        max-width="500">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('export') }} {{ $t("performanceReport") }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        color="red"
                        class="pointer"
                        @click="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit.prevent="submitData">
                    <date-picker
                        v-model="start_date"
                        :label="t('startDate')"
                        :is-required="false"></date-picker>

                    <date-picker
                        class="mt-3"
                        v-model="end_date"
                        :label="t('endDate')"
                        :is-required="false"></date-picker>

                    <field-input
                        input-type="switch"
                        v-model="all_employee"
                        :label="t('allEmployee') + '?'" />

                    <field-input
                        v-model="employee_uids"
                        :label="t('employees')"
                        input-type="select"
                        :is-multiple="true"
                        :select-options="listOfAllEmployees" />

                    <field-input
                        v-model="position_uids"
                        :label="t('position')"
                        input-type="select"
                        :is-multiple="true"
                        :select-options="positions" />

                    <v-btn
                        type="submit"
                        :disabled="loading"
                        color="primary">
                        <template v-if="loading">
                            {{ $t('processing') }}
                        </template>
                        <template v-else>
                            {{ $t("export") }}
                        </template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>
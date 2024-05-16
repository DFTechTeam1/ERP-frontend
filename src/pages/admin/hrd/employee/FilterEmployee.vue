<template>
    <v-dialog
        v-model="showModal"
        max-width="500"
        persistent>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between">
                    <span>{{ $t('filterEmployee') }}</span>
                    <v-icon
                        :icon="mdiClose"
                        class="cursor-pointer"
                        @click.prevent="closeFilter"></v-icon>
                </div>
            </v-card-title>
            <v-card-text>
                <v-form @submit="doFilter">
                    <v-row>
                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <field-input
                                v-model="name"
                                :isRequired="false"
                                :errorMessage="errors.name"
                                :label="t('name')"></field-input>
                        </v-col>
                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <field-input
                                v-model="employee_id"
                                :isRequired="false"
                                :errorMessage="errors.employee_id"
                                :label="t('nip')"></field-input>
                        </v-col>
                    </v-row>

                    <v-row
                        class="mt-1">
                        <v-col
                            class="pt-0"
                            cols="12">
                            <field-input
                                v-model="position_id"
                                :error-message="errors.position_id"
                                :is-multiple="true"
                                :label="t('position')"
                                inputType="select"
                                :select-options="listOfAllPositions"
                                :is-required="false"></field-input>
                        </v-col>
                        <v-col
                            class="pt-0"
                            cols="12">
                            <field-input
                                v-model="level_staff"
                                :error-message="errors.level_staff"
                                :is-multiple="true"
                                :label="t('level')"
                                inputType="select"
                                :select-options="levels"
                                :is-required="false"></field-input>
                        </v-col>
                    </v-row>

                    <v-row
                        class="mt-1">
                        <v-col
                            class="pt-0"
                            cols="12"
                            lg="5"
                            md="5">
                            <field-input
                                v-model="join_date_condition"
                                inputType="select"
                                :label="t('joinDateCondition')"
                                :select-options="joinDateConditions"
                                :is-required="false"></field-input>
                        </v-col>

                        <v-col
                            class="pt-0"
                            cols="12"
                            lg="7"
                            md="7">
                            <date-picker
                                v-model="join_date"
                                :label="t('joinDate')"
                                :is-required="false"></date-picker>
                        </v-col>
                    </v-row>

                    <v-row
                        class="mt-1">
                        <v-col
                            class="pt-0"
                            cols="12">
                            <field-input
                                v-model="status"
                                inputType="select"
                                :select-options="statusOptions"
                                :is-required="false"
                                :label="t('status')"></field-input>
                        </v-col>
                    </v-row>

                    <v-btn
                        width="100%"
                        type="submit"
                        color="primary">
                        {{ $t('search') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { mdiClose } from '@mdi/js';
import { onMounted } from 'vue';
import { usePositionStore } from '@/stores/position';
import { storeToRefs } from 'pinia';

const storePosition = usePositionStore();

const { t } = useI18n()

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['filterEvent', 'closeEvent']);

const levels = ref([
    {title: t('manager'), value: 'manager'},
    {title: t('lead'), value: 'lead'},
    {title: t('staff'), value: 'staff'},
    {title: t('juniorStaff'), value: 'junior_staff'},
])

const joinDateConditions = ref([
    {title: t('equal'), value: 'equal'},
    {title: t('lessThan'), value: 'less_than'},
    {title: t('moreThan'), value: 'more_than'},
])

const statusOptions = ref([
    {title: t('permanent'), value: 1},
    {title: t('contract'), value: 2},
    {title: t('partTime'), value: 3},
    {title: t('freelance'), value: 4},
    {title: t('internship'), value: 5},
    {title: t('inactive'), value: 6},
])

const { errors, resetForm, defineField, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().nullable(),
        employee_id: yup.string().nullable(),
        position_id: yup.array().nullable(),
        level_staff: yup.array().nullable(), 
        join_date_condition: yup.string().nullable(),
        join_date: yup.string().nullable(),
        status: yup.number().nullable(),
    })
})

const showModal = ref(false);
const [name] = defineField('name');
const [employee_id] = defineField('employee_id');
const [position_id] = defineField('position_id');
const [level_staff] = defineField('level_staff');
const [join_date_condition] = defineField('join_date_condition');
const [join_date] = defineField('join_date');
const [status] = defineField('status');

const doFilter = handleSubmit((values) => {
    resetForm();
    emit('filterEvent', values);
})

const {
    listOfAllPositions
} = storeToRefs(storePosition)

function closeFilter() {
    resetForm();

    emit('closeEvent');
}

function initPosittion() {
    storePosition.getAll();
}

onMounted(() => {
    initPosittion();
});

watch(props, (values) => {
    showModal.value = values.show
})
</script>
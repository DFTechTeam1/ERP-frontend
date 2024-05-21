<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('createUser') }}

                    <v-icon
                        :icon="mdiClose"
                        color="red"
                        @click.prevent="closeForm"
                        size="25"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <field-input
                        class="mb-3"
                        :label="t('email')"
                        v-model="email"
                        :error-message="errors.email"></field-input>

                    <field-input
                        class="mb-3"
                        :label="t('password')"
                        v-model="password"
                        field-type="password"
                        :hint="t('fillIfWantChangePass')"
                        :error-message="errors.password"></field-input>

                    <field-input
                        class="mb-3"
                        v-model="role"
                        :error-message="errors.role"
                        input-type="select"
                        :select-options="roles"
                        :label="t('role')"></field-input>

                    <field-input
                        class="mb-3"
                        input-type="switch"
                        v-if="!detailUserData"
                        v-model="is_external_user"
                        :label="t('isForExternalUser')"></field-input>

                    <field-input
                        class="mb-3"
                        :label="t('selectEmployee')"
                        v-model="employee_id"
                        input-type="select"
                        v-if="is_external_user == 0 && !detailUserData"
                        :select-options="listOfAllEmployees"></field-input>

                    <v-btn
                        variant="flat"
                        color="primary"
                        class="w-100"
                        :disabled="loading"
                        type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useEmployeesStore } from '@/stores/employees';
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';
import { mdiClose } from '@mdi/js';
import { useError } from '@/compose/handleError';

const storeEmployee = useEmployeesStore();

const storeRole = useRoleStore();

const store = useUserStore();

const { t } = useI18n();

const emit = defineEmits(['close-event']);

const { listOfAllEmployees } = storeToRefs(storeEmployee);

const { defineField, errors, handleSubmit, resetForm, setValues, setFieldValue, setErrors } = useForm({
    validationSchema: yup.object({
        is_edit: yup.bool().nullable(),
        email: yup.string().required(t('emailRequired')),
        password: yup.string()
            .when('is_edit', {
                is: 1,
                then: function () {
                    return yup.string().nullable()
                },
                otherwise: function () {
                    yup.string().required(t('passwordRequired'))
                }
            }),
        role: yup.string().required(t('roleRequired')),
        is_external_user: yup.bool().nullable(),
        employee_id: yup.string()
            .when('is_external_user', {
                is: (value) => value == 0 && !is_edit,
                then: function () {
                    return yup.string().required();
                },
                otherwise: function () {
                    return yup.string().nullable();
                }
            }),
    }),
});

const [email] = defineField('email');
const [is_edit] = defineField('is_edit');
const [password] = defineField('password');
const [role] = defineField('role');
const [is_external_user] = defineField('is_external_user');
const [employee_id] = defineField('employee_id');

const detailUserData = ref(null);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    detail: {
        default: null,
    },
});

const show = ref(false);

const loading = ref(false);

const roles = ref([]);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }

    if (values.detail) {
        setValues({
            email: values.detail.data.data.email,
            role: values.detail.data.data.role_id,
            is_external_user: 0,
            is_edit: 1,
        });

        detailUserData.value = values.detail;
        console.log('detailUserData', detailUserData.value);
    } else {
        setFieldValue('is_external_user', 0);
        setFieldValue('is_edit', 0);
        detailUserData.value = null;
    }

    initEmployees();
    initRoles();
})

async function initRoles() {
    const resp = await storeRole.getAllRoles();

    if (resp.status < 300) {
        roles.value = resp.data.data;
    }
}

async function initEmployees() {
    await storeEmployee.getAll();
}

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    if (detailUserData.value) {
        values.detailData = detailUserData.value.data.data;
    }
    const resp = await store.storeData(values);
    loading.value = false;

    useError(resp, setErrors);

    if (resp.status < 300) {
        closeForm();
    }
})

function closeForm() {
    resetForm();

    emit('close-event');
}
</script>
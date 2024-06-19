<template>
    <v-card flat border>
        <v-card-text>
            <v-form @submit="validateData">
                <v-row>
                    <v-col cols="12"
                        md="6">
                        <field-input
                            :label="t('appName')"
                            class="mt-5"
                            :is-required="false"
                            v-model="app_name"
                            :error-message="errors.app_name"></field-input>

                        <field-input
                            :label="t('boardNameStartToCalculated')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_start_calculated"
                            input-type="select"
                            :select-options="boards"
                            :hint="t('boardNameCalculatedHint')"
                            :error-message="errors.board_start_calculated"></field-input>

                        <field-input
                            :label="t('boardNameBacklog')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_as_backlog"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_as_backlog"></field-input>

                        <field-input
                            :label="t('boardToStartCheckByPM')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_to_check_by_pm"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_to_check_by_pm"></field-input>

                        <field-input
                            :label="t('boardToStartCheckByClient')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_to_check_by_client"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_to_check_by_client"></field-input>

                        <field-input
                            :label="t('boardAsCompleted')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_completed"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_completed"></field-input>

                        <field-input
                            :label="t('superUserRole')"
                            class="mt-5"
                            :is-required="false"
                            v-model="super_user_role"
                            input-type="select"
                            :select-options="roles"
                            :hint="t('superUserRoleHint')"
                            :error-message="errors.super_user_role"></field-input>

                        <field-input
                            :label="t('productionStaffRole')"
                            class="mt-5"
                            :is-required="false"
                            v-model="production_staff_role"
                            input-type="select"
                            :select-options="roles"
                            :is-multiple="true"
                            :error-message="errors.production_staff_role"></field-input>

                        <button-submit
                            class="mt-4"
                            :is-loading="loading"
                            :full-width="false"></button-submit>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { onMounted, ref, watch } from 'vue';
import { useSettingStore } from '@/stores/setting';
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';

const store = useSettingStore();

const storeRole = useRoleStore();

const { globalGeneralSetting } = storeToRefs(store);

const { t } = useI18n();

const { defineField, errors, handleSubmit, setFieldValue, setFieldError, validateField } = useForm({
    validationSchema: yup.object({
        app_name: yup.string().nullable(),
        board_start_calculated: yup.string().nullable(),
        board_as_backlog: yup.string().nullable(),
        board_to_check_by_pm: yup.string().nullable(),
        board_to_check_by_client: yup.string().nullable(),
        board_completed: yup.string().nullable(),
        super_user_role: yup.string().nullable(),
        production_staff_role: yup.array().nullable(),
    }),
});

const [app_name] = defineField('app_name');
const [board_start_calculated] = defineField('board_start_calculated');
const [board_as_backlog] = defineField('board_as_backlog');
const [board_to_check_by_pm] = defineField('board_to_check_by_pm');
const [board_to_check_by_client] = defineField('board_to_check_by_client');
const [board_completed] = defineField('board_completed');
const [super_user_role] = defineField('super_user_role');
const [production_staff_role] = defineField('production_staff_role');

const loading = ref(true);

const boards = ref([]);

const roles = ref([]);

async function initBoards() {
    const resp = await store.getSetting({code: 'kanban'});

    if (resp.status < 300) {
        boards.value = resp.data.data.boards.map((elem) => {
            return {
                title: elem.name,
                value: elem.id,
            }
        });

        initSetting();
    }
}

const validateData = handleSubmit(async (values) => {
    // validate board category
    if (
        board_start_calculated.value == board_as_backlog.value
    ) {
        setFieldError('board_start_calculated', 'Board is already selected in another category');
        setFieldError('board_as_backlog', 'Board is already selected in another category');

        return;
    }
    if (
        board_start_calculated.value == board_to_check_by_pm.value
    ) {
        setFieldError('board_start_calculated', 'Board is already selected in another category');
        setFieldError('board_to_check_by_pm', 'Board is already selected in another category');

        return;
    }
    if (
        board_as_backlog.value == board_to_check_by_pm.value
    ) {
        setFieldError('board_as_backlog', 'Board is already selected in another category');
        setFieldError('board_to_check_by_pm', 'Board is already selected in another category');

        return;
    }
    if (
        board_start_calculated.value == board_completed.value
    ) {
        setFieldError('board_start_calculated', 'Board is already selected in another category');
        setFieldError('board_completed', 'Board is already selected in another category');

        return;
    }
    if (
        board_as_backlog.value == board_completed.value
    ) {
        setFieldError('board_as_backlog', 'Board is already selected in another category');
        setFieldError('board_completed', 'Board is already selected in another category');

        return;
    }
    if (
        board_to_check_by_pm.value == board_completed.value
    ) {
        setFieldError('board_to_check_by_pm', 'Board is already selected in another category');
        setFieldError('board_completed', 'Board is already selected in another category');

        return;
    }
    if (
        board_to_check_by_client.value == board_completed.value
    ) {
        setFieldError('board_to_check_by_client', 'Board is already selected in another category');
        setFieldError('board_completed', 'Board is already selected in another category');

        return;
    }
    if (
        board_to_check_by_client.value == board_to_check_by_pm.value
    ) {
        setFieldError('board_to_check_by_client', 'Board is already selected in another category');
        setFieldError('board_to_check_by_pm', 'Board is already selected in another category');

        return;
    }
    if (
        board_to_check_by_client.value == board_as_backlog.value
    ) {
        setFieldError('board_to_check_by_client', 'Board is already selected in another category');
        setFieldError('board_as_backlog', 'Board is already selected in another category');

        return;
    }
    if (
        board_to_check_by_client.value == board_start_calculated.value
    ) {
        setFieldError('board_to_check_by_client', 'Board is already selected in another category');
        setFieldError('board_start_calculated', 'Board is already selected in another category');

        return;
    }

    loading.value = true;
    const resp = await store.storeSetting(values, 'general');
    loading.value = false;
    
    if (resp.status < 300) {
        initSetting();
    }
})

async function initSetting() {
    globalGeneralSetting.value.forEach((elem) => {
        if (elem.key == 'app_name') {
            setFieldValue('app_name', elem.value);
        } else if (elem.key == 'board_start_calculated') {
            setFieldValue('board_start_calculated', parseInt(elem.value));
        } else if (elem.key == 'super_user_role') {
            setFieldValue('super_user_role', parseInt(elem.value));
        } else if (elem.key == 'production_staff_role') {
            setFieldValue('production_staff_role', elem.value);
        } else if (elem.key == 'board_as_backlog') {
            setFieldValue('board_as_backlog', parseInt(elem.value));
        } else if (elem.key == 'board_to_check_by_pm') {
            setFieldValue('board_to_check_by_pm', parseInt(elem.value));
        } else if (elem.key == 'board_completed') {
            setFieldValue('board_completed', parseInt(elem.value));
        } else if (elem.key == 'board_to_check_by_client') {
            setFieldValue('board_to_check_by_client', parseInt(elem.value));
        }
    })
}

async function initRoles() {
    const resp = await storeRole.getAllRoles();

    if (resp.status < 300) {
        roles.value = resp.data.data;
    }
}

onMounted(() => {
    initRoles();
    initBoards();
})

watch(globalGeneralSetting, (values) => {
    if (values) {
        initSetting();
        loading.value = false;
    }
})
</script>
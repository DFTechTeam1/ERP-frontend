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
                            :label="t('boardNameBacklog')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_as_backlog"
                            input-type="select"
                            :select-options="boards"
                            :hint="t('boardNameCalculatedHint')"
                            :error-message="errors.board_as_backlog"></field-input>

                        <field-input
                            :label="t('boardAs3D')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_as_3d"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_as_3d"></field-input>

                        <field-input
                            :label="t('boardAsCompositing')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_as_compositing"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_as_compositing"></field-input>

                        <field-input
                            :label="t('boardAsAnimating')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_as_animating"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_as_animating"></field-input>

                        <field-input
                            :label="t('boardAsFinalize')"
                            class="mt-5"
                            :is-required="false"
                            v-model="board_as_finalize"
                            input-type="select"
                            :select-options="boards"
                            :error-message="errors.board_as_finalize"></field-input>

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
                            :label="t('defineRoleAsProjectManager')"
                            class="mt-5"
                            :is-required="false"
                            v-model="project_manager_role"
                            input-type="select"
                            :select-options="roles"
                            :hint="t('superUserRoleHint')"
                            :is-multiple="true"
                            :error-message="errors.project_manager_role"></field-input>

                        <field-input
                            :label="t('defineRoleAsDirector')"
                            class="mt-5"
                            :is-required="false"
                            v-model="director_role"
                            input-type="select"
                            :select-options="roles"
                            :hint="t('superUserRoleHint')"
                            :error-message="errors.director_role"></field-input>

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

const { defineField, errors, handleSubmit, setFieldValue, setFieldError } = useForm({
    validationSchema: yup.object({
        app_name: yup.string().nullable(),
        board_as_backlog: yup.string().nullable(),
        board_as_3d: yup.string().nullable(),
        board_as_compositing: yup.string().nullable(),
        board_as_animating: yup.string().nullable(),
        board_as_finalize: yup.string().nullable(),
        super_user_role: yup.string().nullable(),
        production_staff_role: yup.array().nullable(),
        project_manager_role: yup.array().nullable(),
        all_employee_role: yup.array().nullable(),
    }),
});

const [app_name] = defineField('app_name');
const [board_as_backlog] = defineField('board_as_backlog');
const [board_as_3d] = defineField('board_as_3d');
const [board_as_compositing] = defineField('board_as_compositing');
const [board_as_animating] = defineField('board_as_animating');
const [board_as_finalize] = defineField('board_as_finalize');
const [super_user_role] = defineField('super_user_role');
const [project_manager_role] = defineField('project_manager_role');
const [director_role] = defineField('director_role');
const [all_employee_role] = defineField('all_employee_role');
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
        (board_as_3d.value != null && board_as_backlog.value != null) &&
        (board_as_3d.value == board_as_backlog.value)
    ) {
        setFieldError('board_as_3d', 'Board is already selected in another category');
        setFieldError('board_as_backlog', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_3d.value != null && board_as_compositing.value != null) &&
        (board_as_3d.value == board_as_compositing.value)
    ) {
        setFieldError('board_as_3d', 'Board is already selected in another category');
        setFieldError('board_as_compositing', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_3d.value != null && board_as_animating.value != null) &&
        (board_as_3d.value == board_as_animating.value)
    ) {
        setFieldError('board_as_3d', 'Board is already selected in another category');
        setFieldError('board_as_animating', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_3d.value != null && board_as_finalize.value != null) &&
        (board_as_3d.value == board_as_finalize.value)
    ) {
        setFieldError('board_as_3d', 'Board is already selected in another category');
        setFieldError('board_as_finalize', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_backlog.value != null && board_as_compositing.value != null) &&
        (board_as_backlog.value == board_as_compositing.value)
    ) {
        setFieldError('board_as_backlog', 'Board is already selected in another category');
        setFieldError('board_as_compositing', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_backlog.value != null && board_as_animating.value != null) &&
        (board_as_backlog.value == board_as_animating.value)
    ) {
        setFieldError('board_as_backlog', 'Board is already selected in another category');
        setFieldError('board_as_animating', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_backlog.value != null && board_as_finalize.value != null) &&
        (board_as_backlog.value == board_as_finalize.value)
    ) {
        setFieldError('board_as_backlog', 'Board is already selected in another category');
        setFieldError('board_as_finalize', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_compositing.value != null && board_as_animating.value != null) &&
        (board_as_compositing.value == board_as_animating.value)
    ) {
        setFieldError('board_as_compositing', 'Board is already selected in another category');
        setFieldError('board_as_animating', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_compositing.value != null && board_as_finalize.value != null) &&
        (board_as_compositing.value == board_as_finalize.value)
    ) {
        setFieldError('board_as_compositing', 'Board is already selected in another category');
        setFieldError('board_as_finalize', 'Board is already selected in another category');

        return;
    }
    if (
        (board_as_animating.value != null && board_as_finalize.value != null) &&
        (board_as_animating.value == board_as_finalize.value)
    ) {
        setFieldError('board_as_animating', 'Board is already selected in another category');
        setFieldError('board_as_finalize', 'Board is already selected in another category');

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
        } else if (elem.key == 'super_user_role') {
            setFieldValue('super_user_role', parseInt(elem.value));
        } else if (elem.key == 'production_staff_role') {
            setFieldValue('production_staff_role', elem.value);
        } else if (elem.key == 'board_as_backlog' && elem.value) {
            setFieldValue('board_as_backlog', parseInt(elem.value));
        } else if (elem.key == 'board_as_3d' && elem.value) {
            setFieldValue('board_as_3d', parseInt(elem.value));
        } else if (elem.key == 'board_as_compositing' && elem.value) {
            setFieldValue('board_as_compositing', parseInt(elem.value));
        } else if (elem.key == 'board_as_animating' && elem.value) {
            setFieldValue('board_as_animating', parseInt(elem.value));
        } else if (elem.key == 'board_as_finalize' && elem.value) {
            setFieldValue('board_as_finalize', parseInt(elem.value));
        } else if (elem.key == 'project_manager_role' && elem.value) {
            setFieldValue('project_manager_role', elem.value);
        } else if (elem.key == 'director_role' && elem.value) {
            setFieldValue('director_role', elem.value);
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
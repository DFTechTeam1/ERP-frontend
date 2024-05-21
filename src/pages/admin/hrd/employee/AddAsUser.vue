<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="400">
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('createUser') }}

                    <v-icon
                        :icon="mdiClose"
                        color="red"
                        @click.prevent="closeForm(false)"
                        size="25"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form
                    @submit="validateData">
                    <field-input
                        class="mb-3"
                        :label="t('role')"
                        v-model="role"
                        input-type="select"
                        :error-message="errors.role"
                        :select-options="roles"></field-input>

                    <v-btn
                        :disabled="loading"
                        variant="flat"
                        color="primary"
                        class="w-100"
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
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoleStore } from '@/stores/role';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { generatePassword } from '@/compose/passwordGenerator';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

const storeRole = useRoleStore();

const emit = defineEmits(['close-form-add-user']);

const { t } = useI18n();

const { handleSubmit, defineField, errors, resetForm } = useForm({
    validationSchema: yup.object({
        role: yup.string().required(t('roleRequired')),
    })
})

const [role] = defineField('role');

const show = ref(false);

const loading = ref(false);

const roles = ref([]);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    employee_id: {
        type: String,
        default: '',
    },
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }

    initRoles();
});

async function initRoles() {
    const resp = await storeRole.getAllRoles();

    if (resp.status < 300) {
        roles.value = resp.data.data;
    }
}

function closeForm(isRefresh = false) {
    resetForm();

    emit('close-form-add-user', {refresh: isRefresh});
}

const validateData = handleSubmit(async (values) => {
    values.password = generatePassword();
    values.employee_id = props.employee_id;
    values.is_external_user = false;
    console.log('value', values);

    const resp = await store.storeData(values);

    if (resp.status < 300) {
        closeForm(true);
    }
})
</script>
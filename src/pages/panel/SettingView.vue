<template>
    <div>
        <v-card border>
            <v-card-item>
                <v-card-title>{{ $t('nasConfiguration') }}</v-card-title>
            </v-card-item>
            <v-card-text>
                <v-form 
                    class="mt-5"
                    @submit="validateData">
                    <v-row>
                        <v-col
                            cols="12"
                            lg="6"
                            md="6">

                            <field-input
                                class="mt-3"
                                :label="t('nasServer')"
                                v-model="server"
                                :error-message="errors.server"></field-input>

                            <field-input
                                class="mt-3"
                                :label="t('addonFolder')"
                                v-model="folder"
                                :error-message="errors.folder"></field-input>

                            <field-input
                                class="mt-3"
                                :label="t('user')"
                                v-model="user"
                                :error-message="errors.user"></field-input>

                            <field-input
                                class="mt-3"
                                :label="t('password')"
                                v-model="password"
                                :error-message="errors.password"></field-input>

                            <div class="d-flex align-center ga-5 mt-5">
                                <v-btn
                                    variant="flat"
                                    color="warning"
                                    type="button"
                                    :disabled="loading"
                                    @click.prevent="testConnection">
                                    <template v-if="loading">{{ $t('processing') }}</template>
                                    <template v-if="!loading">{{ $t('testConnection') }}</template>
                                </v-btn>
                                <v-btn
                                    variant="flat"
                                    color="primary"
                                    :disabled="loading"
                                    type="submit">
                                    <template v-if="loading">{{ $t('processing') }}</template>
                                    <template v-if="!loading">{{ $t('save') }}</template>
                                </v-btn>
                            </div>

                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useNasStore } from '@/stores/nas';
import { ref, onMounted, watch } from 'vue';

const store = useNasStore();

const { t } = useI18n();

const { defineField, errors, handleSubmit, setValues } = useForm({
    validationSchema: yup.object({
        server: yup.string().required(),
        folder: yup.string().required(),
        user: yup.string().required(),
        password: yup.string().required(),
    })
});

const [server] = defineField('server');
const [folder] = defineField('folder');
const [user] = defineField('user');
const [password] = defineField('password');

const loading = ref(false);

const setting = ref(null);

onMounted(() => {
    initSetting();
});

watch(setting, (values) => {
    if (values.status < 300) {
        setValues({
            server: values.data.data.server,
            folder: values.data.data.folder,
            user: values.data.data.user,
            password: values.data.data.password,
        })
    }
})

const initSetting = async () => {
    setting.value = await store.initAddonSetting();
}

const testConnection = handleSubmit(async(values) => {
    loading.value = true;
    await store.testConnection(values)
    loading.value = false;
})

const validateData = handleSubmit(async(values) => {
    loading.value = true;
    await store.storeAddonConfiguration(values)
    loading.value = false;
});
</script>
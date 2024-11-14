<template>
    <v-card flat border>
        <v-card-text>
            <v-form @submit="validateData">
                <v-row>
                    <v-col cols="12"
                        md="6">
                        <field-input
                            :label="t('emailHost')"
                            class="mt-5"
                            :is-required="false"
                            v-model="email_host"
                            :error-message="errors.email_host"></field-input>
                        <field-input
                            :label="t('port')"
                            class="mt-5"
                            :is-required="false"
                            v-model="email_port"
                            :error-message="errors.email_port"></field-input>
                        <field-input
                            :label="t('username')"
                            class="mt-5"
                            :is-required="false"
                            v-model="username"
                            :error-message="errors.username"></field-input>
                        <field-input
                            :label="t('password')"
                            class="mt-5"
                            :is-required="false"
                            v-model="password"
                            :error-message="errors.password"></field-input>
                        <field-input
                            :label="t('senderEmail')"
                            class="mt-5"
                            :is-required="false"
                            v-model="sender_email"
                            :error-message="errors.sender_email"></field-input>
                        <field-input
                            :label="t('senderName')"
                            class="mt-5"
                            :is-required="false"
                            v-model="sender_name"
                            :error-message="errors.sender_name"></field-input>

                        <v-btn
                            variant="flat"
                            color="primary"
                            type="submit">
                            <template v-if="loading">
                                {{ $t('processing') }}
                            </template>
                            <template v-else>
                                {{ $t('save') }}
                            </template>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const store = useSettingStore();

const { globalEmailSetting } = storeToRefs(store);

const { defineField, errors, handleSubmit, setFieldValue } = useForm({
    validationSchema: yup.object({
        email_host: yup.string().nullable(),
        email_port: yup.string().nullable(),
        username: yup.string().nullable(),
        password: yup.string().nullable(),
        sender_email: yup.string().nullable(),
        sender_name: yup.string().nullable(),
    }),
});

const [email_host] = defineField('email_host');
const [email_port] = defineField('email_port');
const [username] = defineField('username');
const [password] = defineField('password');
const [sender_email] = defineField('sender_email');
const [sender_name] = defineField('sender_name');

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    const resp = await store.storeSetting(values, 'email');
    loading.value = false;

    if (resp.status < 300) {
        initEmailSetting();
    }
})

const loading = ref(true);

function initEmailSetting() {
    globalEmailSetting.value.forEach((elem) => {
        if (elem.key == 'email_host') {
            setFieldValue('email_host', elem.value);
        } else if (elem.key == 'email_port') {
            setFieldValue('email_port', elem.value);
        } else if (elem.key == 'username') {
            setFieldValue('username', elem.value);
        } else if (elem.key == 'password') {
            setFieldValue('password', elem.value);
        } else if (elem.key == 'sender_email') {
            setFieldValue('sender_email', elem.value);
        } else if (elem.key == 'sender_name') {
            setFieldValue('sender_name', elem.value);
        }
    })
}

onMounted(() => {
    if (globalEmailSetting) {
        initEmailSetting();
        loading.value = false;
    }
})
</script>
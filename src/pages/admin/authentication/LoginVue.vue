<template>
    <div class="mt-xl-0 mt-5 mw-100">
        <h2 class="text-h3 font-weight-bold mb-2">
            Welcome to DF Data Center
        </h2>
        <v-form @submit="submitData">
            <v-text-field
                variant="outlined"
                v-model="email"
                v-bind="emailAttrs"
                :error-messages="errors.email"
                :class="{
                    'mb-3': errors.email
                }"
                label="Email">
            </v-text-field>
            <v-text-field
                variant="outlined"
                label="Password"
                v-model="password"
                v-bind="passwordAttrs"
                :error-messages="errors.password"
                :class="{
                    'mb-3': errors.email
                }"
                type="password">
            </v-text-field>

            <a
                href="/auth/a/forgot-password"
                class="text-primary no-underline"
                style="font-size: 12px;">
                {{ $t('forgotPassword') }}
            </a>

            <v-btn
                height="auto"
                type="submit"
                :disabled="isLoading"
                class="btn-primary w-100 pt-3 pb-3 mt-3">
                <template v-if="isLoading">
                    {{ $t('processing') }}
                </template>
                <template v-else>
                    {{ $t('login') }}
                </template>
            </v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useAuthenticationStore } from '@/stores/authentication'

const store = useAuthenticationStore();

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const submitData = handleSubmit(async values => {
    isLoading.value = true;
    await store.login(values)
    isLoading.value = false;

    window.location.href = window.location.origin + '/admin/dashboard';
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const isLoading = ref(false);
</script>
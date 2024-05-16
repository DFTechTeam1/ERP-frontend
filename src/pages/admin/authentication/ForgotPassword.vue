<template>
    <div class="mt-xl-0 mt-5 w-50">
        <h2 class="text-h3 font-weight-bold mb-2">
            Forgot Password
        </h2>

        <v-form @submit="submitData">
            <v-text-field
                variant="outlined"
                v-model="email"
                v-bind="emailAttrs"
                placeholder="Please type your registered email"
                :error-messages="errors.email"
                :class="{
                    'mb-3': errors.email
                }"
                label="Email">
            </v-text-field>

            <a
                href="/auth/a/login"
                class="text-primary no-underline"
                style="font-size: 12px; margin-bottom: 10px;">
                Back to Login
            </a>

            <v-btn
                variant="flat"
                class="bg-primary"
                width="100%"
                type="submit">
                Send Reset Password Link
            </v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup'
import { useAuthenticationStore } from '@/stores/authentication'

const store = useAuthenticationStore();

const isLoading = ref(false);

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
</script>
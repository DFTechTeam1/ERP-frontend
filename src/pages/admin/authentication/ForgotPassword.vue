<template>
    <div class="mt-xl-0 mt-5 w-50">
        <h2 class="text-h3 font-weight-bold"
            :class="{
                'mb-5': !showSuccess
            }">
            Forgot Password
        </h2>

        <v-alert v-if="showSuccess" 
            class="mb-5 mt-3"
            :text="showSuccess"
            type="success"></v-alert>

        <v-form @submit="submitData">
            <field-input
                :label="t('email')"
                v-model="email"
                :error-message="errors.email"></field-input>

            <a
                href="/auth/a/login"
                class="text-primary no-underline"
                style="font-size: 12px;">
                Back to Login
            </a>
            
            <v-btn
                variant="flat"
                class="bg-primary mt-2 w-100"
                type="submit"
                :disabled="isLoading">
                <template v-if="isLoading">
                    {{ $t('processing') }}
                </template>
                <template v-else>
                    {{ $t('sendPasswordLink') }}
                </template>
            </v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup'
import { useAuthenticationStore } from '@/stores/authentication'
import { useI18n } from 'vue-i18n';

const store = useAuthenticationStore();

const { t } = useI18n()

const showSuccess = ref(null)

const isLoading = ref(false);

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(t('emailRequired')),
  }),
});

const submitData = handleSubmit(async (values) => {
    isLoading.value = true;
    const resp = await store.forgotPassword(values)
    isLoading.value = false;

    if (resp.status < 300) {
        showSuccess.value = resp.data.message
        resetForm()
    } else {
        showSuccess.value = null
    }
});

const [email] = defineField('email');
</script>
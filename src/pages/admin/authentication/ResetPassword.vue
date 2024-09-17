<template>
    <div class="mt-xl-0 mt-5 w-50">
        <h2 class="text-h3 font-weight-bold mb-5">
            {{ $t('resetPassword') }}
        </h2>

        <v-form @submit="submitData">
            <field-input
                :label="t('password')"
                v-model="password"
                class="mb-2"
                field-type="password"
                :error-message="errors.password"></field-input>

            <field-input
                :label="t('confirmPassword')"
                v-model="confirm_password"
                class="mb-2"
                field-type="password"
                :error-message="errors.confirm_password"></field-input>

            <v-btn
                variant="flat"
                class="bg-primary"
                width="100%"
                :disabled="loading"
                type="submit">
                <template v-if="loading">
                    {{ $t('processing') }}
                </template>
                <template v-else>
                    {{ $t('resetPassword') }}
                </template>
            </v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { useAuthenticationStore } from '@/stores/authentication';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup'

const { t }  = useI18n()

const store = useAuthenticationStore()

const router = useRouter()

const route = useRoute()

const loading = ref(false)

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: yup.object({
        password: yup.string().required(),
        confirm_password: yup.string()
            .oneOf([yup.ref('password'), null], t('passwordNotSame')),
    })
})

const [password] = defineField('password')
const [confirm_password] = defineField('confirm_password')

const submitData = handleSubmit(async (values) => {
    var encrypted = route.query.d

    loading.value = true
    const resp = await store.resetPassword({
        encrypted: encrypted,
        password: values.password,
    })
    loading.value = false

    if (resp.status < 300) {
        router.push({path: '/auth/a/login'})
    }
})
</script>
<template>
    <div class="mt-xl-0 mt-5 mw-100">
        <h2 class="text-h3 font-weight-bold mb-2">
            Welcome to DF Data Centerr
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

            <div class="d-flex align-center justify-space-between">
              <a
                href="/auth/a/forgot-password"
                class="text-primary no-underline"
                style="font-size: 12px;">
                {{ $t('forgotPassword') }}
              </a>

              <v-checkbox
                :style="{
                fontSize: '10px'
                }"
                class="remember"
                v-model="remember_me"
                color="success"
                label="Remember me?"
                :value="true"
                hide-details
              ></v-checkbox>
            </div>

            <v-btn
                height="auto"
                type="submit"
                :disabled="isLoading"
                class="btn-primary w-100 pt-3 pb-3">
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
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useAuthenticationStore } from '@/stores/authentication'
import { useRoute, useRouter } from 'vue-router';
import { useGetRole } from '@/compose/getRole';
import BaseRole from '@/enums/system/BaseRole';
import { useBreakToken } from '@/compose/breakToken';

const route = useRoute();

const router = useRouter();

const store = useAuthenticationStore();

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    remember_me: yup.boolean().default(false)
  }),
});

const submitData = handleSubmit(async values => {
    isLoading.value = true;
    const resp = await store.login(values)
    isLoading.value = false;

    if (resp.status < 300) {
        if (route.path == '/auth/a/login') {
          if (useGetRole() == BaseRole.Hrd) {
            window.location.href = import.meta.env.VITE_OFFICE_URL + '/init/' + useBreakToken('encrypted_user_id');
            return;
          } else {
            window.location.href = window.location.origin + '/admin/dashboard';
          }
          // router.push({path: '/admin/dashboard'});
        }
    }
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [remember_me] = defineField('remember_me')

const isLoading = ref(false);
</script>

<style lang="scss">
.remember label {
  font-size: 12px !important;
}
</style>

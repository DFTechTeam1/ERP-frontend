<template>
	<div class="login-mobile-wrapper">
		<header>
			<p class="title">{{ $t('welcome') }}</p>
			<p class="subtitle">{{ $t('signInToContinue') }}</p>
		</header>

		<section class="section-content">
			<v-form @submit="submitData">
				<div class="form-box w-100">
					<div class="form-group form-group-first">
						<input class="mobile-input"
							v-model="email"
							:placeholder="t('email')">
					</div>

					<div class="form-group">
						<input class="mobile-input"
							v-model="password"
							:placeholder="t('password')"
							type="password">
					</div>

					<v-btn 
						class="w-100 mt-10" 
						flat 
						color="primary"
						type="submit">
						{{ $t('login') }}
					</v-btn>

					<div class="text-center">
						<a
		                    href="/auth/a/forgot-password"
		                    class="text-primary no-underline text-center"
		                    style="font-size: 12px;">
		                    {{ $t('forgotPassword') }}
		                </a>
					</div>
				</div>
			</v-form>
		</section>
	</div>
</template>

<style lang="scss" scoped>
	.login-mobile-wrapper {
		height: 100%;
		position: relative;
	}

	.section-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
	}

	.login-mobile-wrapper {
		padding-top: 80px;
	}

	.title {
		font-size: 34px;
		font-weight: bold;
		color: #2d1da4;
		margin-bottom: 8px;
	}

	.subtitle {
		color: #6a679f;
		font-size: 18px;
	}

	.form-group-first {
		margin-bottom: 70px;
	}
</style>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useAuthenticationStore } from '@/stores/authentication'
import { useRoute, useRouter } from 'vue-router';
import LoginMobile from './LoginMobile.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { mobile } = useDisplay()

const route = useRoute();

const router = useRouter();

const store = useAuthenticationStore();

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const submitData = handleSubmit(async values => {
    isLoading.value = true;
    const resp = await store.login(values)
    isLoading.value = false;

    if (resp.status < 300) {
        console.log('route path', route);
        if (route.path == '/auth/a/login') {
            window.location.href = window.location.origin + '/admin/dashboard';
            // router.push({path: '/admin/dashboard'});
        } else if (route.path == '/auth/p/login') {
            window.location.href = window.location.origin + '/panel/addons';
            // router.push({path: '/panel/addons'});
        }
    }
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const isLoading = ref(false);
</script>
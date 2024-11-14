<template>
	<v-dialog v-model="show"
		max-width="500"
		persistent>
		<master-card>
			<v-card-item>
				<v-card-title class="d-flex align-center justify-space-between">
					{{ $t('resetPassword') }}

					<v-icon
						:icon="mdiClose"
						size="15"
						class="pointer"
						@click.prevent="closeForm"></v-icon>
				</v-card-title>
			</v-card-item>

			<v-card-text>
				<v-form @submit="validateData">
					<field-input
						:label="t('newPassword')"
						:error-message="errors.password"
						v-model="password"
						:class="{
							'mb-3': errors.password
						}"
						field-type="password"></field-input>

					<field-input
						:label="t('confirmPassword')"
						:error-message="errors.confirm_password"
						v-model="confirm_password"
						:class="{
							'mb-3': errors.confirm_password
						}"
						field-type="password"></field-input>

					<v-btn class="mt-5 w-100"
						flat
						color="primary"
						:disabled="loading"
						type="submit">
						<template v-if="loading">
							{{ $t('processing') }}
						</template>
						<template v-else>
							{{ $t('save') }}
						</template>
					</v-btn>
				</v-form>
			</v-card-text>
		</master-card>
	</v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { mdiClose } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useUserStore()

const { t } = useI18n()

const { defineField, errors, handleSubmit, resetForm, setFieldError } = useForm({
	validationSchema: yup.object({
		password: yup.string().min(8).required(t('passwordRequired')),
		confirm_password: yup.string().min(8).required(t('confirmPasswordRequired')),
	})
})

const [password] = defineField('password')
const [confirm_password] = defineField('confirm_password')

const emit = defineEmits(['close-event'])

const show = ref(false)

const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
})

const loading = ref(false)

watch(props, (values) => {
	if (values) {
		show.value = values.isShow
	}
})

function closeForm() {
	resetForm()
	emit('close-event')
}

const validateData = handleSubmit(async (values) => {
	if (values.password !== values.confirm_password) {
		setFieldError('confirm_password', t('passwordNotSame'))
		return
	}

	loading.value = true

	const resp = await store.resetPassword(values)

	loading.value = false

	if (resp.status < 300) {
		router.push({path: '/redirect/logout'});
	}
})
</script>
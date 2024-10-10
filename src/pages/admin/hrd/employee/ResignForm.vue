<template>
	<v-dialog v-model="show"
		max-width="500"
		persistent>
		<master-card>
			<v-card-item>
				<v-card-title class="d-flex align-center justify-space-between">
					{{ $t('resign') }}

					<v-icon
						:icon="mdiClose"
						size="15"
						class="pointer"
						@click.prevent="closeForm(false)"></v-icon>
				</v-card-title>
			</v-card-item>

			<v-card-text>
				<v-form @submit="validateData">
					<field-input
						:label="t('reason')"
						v-model="reason"
						:class="{
							'mb-3': errors.reason
						}"
						:error-message="errors.reason"
						density="compact"></field-input>

					<v-btn class="w-100" color="primary" density="compact" type="submit">
						{{ $t('save') }}
					</v-btn>
				</v-form>
			</v-card-text>
		</master-card>
	</v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { mdiClose } from '@mdi/js'
import { useEmployeesStore } from '@/stores/employees'

const store = useEmployeesStore()

const { t } = useI18n()

const { handleSubmit, errors, defineField, resetForm } = useForm({
	validationSchema: yup.object({
		reason: yup.string().required(t('reasonRequired')),
	})
})

const [reason] = defineField('reason')

const show = ref(false)

const emit = defineEmits(['close-event'])

const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
	employeeUid: {
		type: String,
	}
})

watch(props, (values) => {
	if (values) {
		show.value = values.isShow
	}
})

function closeForm(isRefresh) {
	resetForm()
	emit('close-event', isRefresh)
}

const validateData = handleSubmit(async (values) => {
	const resp = await store.resign(values, props.employeeUid)

	if (resp.status < 300) {
		closeForm(true)
	}
})
</script>
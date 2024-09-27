<template>
	<v-dialog v-model="show"
		persistent
		max-width="500">
		<master-card>
			<v-card-item>
				<v-card-title class="d-flex align-center justify-space-between">
					{{ $t('requestTeamMember') }}

					<v-icon
						:icon="mdiClose"
						size="15"
						class="pointer"
						color="red"
						@click.prevent="closeForm"></v-icon>
				</v-card-title>
			</v-card-item>

			<v-card-text>
				<v-form @submit="validateData">
					<v-switch
						v-model="default_select"
						:label="t('letEntertaintChooseTeam')"
						color="primary"></v-switch>

					<field-input
						v-if="!default_select"
						:label="t('chooseTeam')"
						input-type="select"
						:select-options="teams"
						v-model="team"
						:disabled="loadingPrepare"
						:error-message="errors.team"
						:is-multiple="true"
						density="compact"></field-input>

					<v-btn flat color="primary" type="submit" class="w-100">
						<template v-if="!loading">
							{{ $t('save') }}
						</template>
						<template v-else>
							{{ $t('processing') }}
						</template>
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
import { useProjectStore } from '@/stores/project'

const { defineField, handleSubmit, errors, resetForm } = useForm({
	validationSchema: yup.object({
		team: yup.array().nullable(),
	}),
})

const store = useProjectStore()

const [team] = defineField('team')

const { t } = useI18n()

const show = ref(false)

const emit = defineEmits(['close-event'])

const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
	projectUid: {
		default: '',
	}
})

const default_select = ref(true)

const teams = ref([])

const loadingPrepare = ref(false)

const loading = ref(false)

async function initEntertainment() {
	loadingPrepare.value = true
	const resp = await store.initEntertainment()
	loadingPrepare.value = false

	if (resp.status < 300) {
		teams.value = resp.data.data.map((item) => {
			return {title: item.name, value: item.uid}
		})
	}
}

watch(props, (values) => {
	if (values) {
		show.value = values.isShow
	}
})

watch(default_select, (values) => {
	if (values) {
		resetForm()
	}

	if (!values) {
		initEntertainment()
	}
})

function closeForm() {
	resetForm()
	emit('close-event')
}

const validateData = handleSubmit(async (values) => {
	values.default_select = default_select.value

	loading.value = true
	const resp = await store.requestEntertainment(values, props.projectUid)
	loading.value = false

	if (resp.status < 300) {
		closeForm()
	}
})
</script>
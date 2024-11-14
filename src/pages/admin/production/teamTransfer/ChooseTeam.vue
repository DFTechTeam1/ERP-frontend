<template>
	<v-dialog v-model="show"
		persistent
		max-width='500'>
		<master-card>
			<v-card-item>
				<v-card-title class="d-flex align-center justify-space-between">
					{{ $t('chooseTeam') }}

					<v-icon
						:icon="mdiClose"
						color="red"
						size="15"
						class="pointer"
						@click.prevent="closeForm(false)"></v-icon>
				</v-card-title>
			</v-card-item>

			<v-card-text>
				<v-form @submit="validateData">

					<field-input input-type="select"
						:select-options="teams"
						:disabled="loadingPrepare"
						v-model="team"
						:is-multiple="true"
						:error-message="errors.team"
						:class="{'mb-3': errors.team}"
						:label="t('chooseTeam')"></field-input>

          <v-btn
            flat
            color="primary"
            class="w-100"
            type="submit"
            :disabled="loading">
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
import { useProjectStore } from '@/stores/project'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const store = useProjectStore()

const { t } = useI18n()

const { defineField, errors, handleSubmit, resetForm } = useForm({
	validationSchema: yup.object({
		team: yup.array().required(t('teamRequired'))
	})
})

const [team] = defineField('team')

const show = ref(false)

const emit = defineEmits(['close-event'])

const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
  transferUid: {
    type: String,
    default: '',
  },
})

const loadingPrepare = ref(false)

const loading = ref(false)

const teams = ref([])

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

		if (values.isShow) {
			initEntertainment()
		}
	}
})

function closeForm(refresh) {
  resetForm()
	emit('close-event', refresh)
}

const validateData = handleSubmit(async (values) => {
	console.log('values', values)
  loading.value = true
  const resp = await store.approveWithManualSelection(props.transferUid, {ids: values.team});
  loading.value = false

  if (resp.status < 300) {
    closeForm(true)
  }
})
</script>

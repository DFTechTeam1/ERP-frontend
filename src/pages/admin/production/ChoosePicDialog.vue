<template>
	<v-dialog v-model="show"
		persistent
		max-width="500">
		<master-card>
			<v-card-item>
				<v-card-title class="d-flex align-center justify-space-between">
					<p>{{ $t('choosePic') }}</p>

					<v-icon
						:icon="mdiClose"
						size="15"
						@click.prevent="closeDialog(false)"></v-icon>
				</v-card-title>
			</v-card-item>

			<v-card-text>
				<v-form @submit="validateData">
					<template v-if="loadingPrepare">
						<v-skeleton-loader
							type="list-item-two-line"
							width="100%"></v-skeleton-loader>
					</template>
					<template v-else>
						<v-text-field
							density="compact"
							readonly
							:clearable="true"
							multiple
							@click:clear="clearPic"
							v-model="selected_pic"
							:error-messages="errors.selected_pic"
							variant="outlined"
							:label="t('choosePic')">
							<v-menu
								max-height="350"
								activator="parent">
								<v-list
									lines="three">
									<ListPic
										:pics="pics"
										@select-item="selectPic"></ListPic>
								</v-list>	
							</v-menu>	
						</v-text-field>

						<v-btn class="w-100" variant="flat" color="primary"
							type="submit">
							<template v-if="loading">
								{{ $t('save') }}
							</template>
							<template v-else>
								{{ $t('save') }}
							</template>
						</v-btn>
					</template>
				</v-form>
			</v-card-text>
		</master-card>
	</v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { mdiClose, mdiStarCheck } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import ListPic from './components/ListPicDropdown.vue'

const show = ref(false)

const store = useProjectStore()

const { t } = useI18n()

const { defineField, errors, handleSubmit, resetForm, setFieldValue } = useForm({
	validationSchema: yup.object({
		selected_pic: yup.string().required(),
	}),
})

const [selected_pic] = defineField('selected_pic')

const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
	projectUid: {
		type: String,
		default: '',
	},
})

const loadingPrepare = ref(false)

const loading = ref(false)

const emit = defineEmits(['close-event'])

const pic = ref([])

const picNames = ref([])

const pics = ref([]);

watch(props, (values) => {
	console.log('props', values)
	if (values) {
		show.value = values.isShow

		if (values.isShow) {
			initPic()
		}
	}
})

async function initPic() {
	loadingPrepare.value = true
	const resp = await store.getPicScheduler(props.projectUid)
	loadingPrepare.value = false

	if (resp.status < 300) {
		pics.value = resp.data.data
	}
}

function closeDialog(closeAll = false) {
	resetForm()
	emit('close-event', closeAll)
}

function selectPic(user) {
	var selected = pics.value.filter((filter) => {
		return filter.id == user.id
	})
	
	pic.value.push(selected[0].id)
	pic.value = [...new Set(pic.value)]

	picNames.value.push(selected[0].name)
	picNames.value = [...new Set(picNames.value)]

	setFieldValue('selected_pic', picNames.value.join(','))
}

const validateData = handleSubmit(async () => {
	loading.value = true
	const resp = await store.assignPic(pic.value, props.projectUid)
	loading.value = false

	if (resp.status < 300) {
		closeDialog(true)
	}
})

function clearPic() {
	setFieldValue('selected_pic', '')
	pic.value = []
	picNames.value = []
}

</script>
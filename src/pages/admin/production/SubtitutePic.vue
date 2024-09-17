<template>
	<v-dialog v-model="show"
		max-width="600">
		<master-card>
			<v-card-item>
				<v-card-title class="d-flex align-center justify-space-between">
					{{ $t('subtitutePic') }}

					<v-icon
						:icon="mdiClose"
						size="15"
						@click.prevent="closeDialog(false)"></v-icon>
				</v-card-title>
			</v-card-item>

			<v-card-text>
				<v-form>
					<template v-if="loadingPrepare">
						<v-skeleton-loader
							type="list-item-two-line"
							width="100%"></v-skeleton-loader>
					</template>
					<template v-else>
						<div class="form-wrapper">
							<div class="current-wrapper">
								<p class="title">{{ $t('currentPic') }}</p>	

								<v-list class="mt-4"
									lines="three" v-if="selectedPic.length">
									<ListPic :pics="selectedPic"
										:clearable="true"
										@clearable-event="removePic"></ListPic>
								</v-list>
								<v-empty-state v-else
									title="PIC does'nt exist"
									text="there's no pic for this project"
									:icon="mdiMagnify"></v-empty-state>
							</div>

							<div class="d-flex align-center justify-center my-5">
								<v-icon
									:icon="mdiSwapVertical"
									size="40"></v-icon>
							</div>

							<div class="current-wrapper">
								<p class="title">{{ $t('currentPic') }}</p>	

								<v-list class="mt-4"
									lines="three">
									<ListPic :pics="availablePics"
										@select-item="choosePic"></ListPic>
								</v-list>
							</div>
						</div>

						<v-btn class="w-100 mt-5"
							variant="flat"
							color="primary"
							@click.prevent="submitForm">
							{{ $t('save') }}
						</v-btn>
						
					</template>
				</v-form>
			</v-card-text>
		</master-card>
	</v-dialog>
</template>

<style lang="scss">
	.item-pic {
		min-height: 30px !important;

		.v-list-item-title {
			font-size: 12px !important;
		}
	}
</style>

<style lang="scss" scoped>
	.title {
		font-weight: bold;
	}

	.form-wrapper {
		border-radius: 8px;
		background-color: #f6f6f6;
		padding: 8px;
	}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { mdiClose, mdiSwapVertical, mdiMagnify } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import ListPic from './components/ListPicDropdown.vue'

const { t } = useI18n()

const show = ref(false)

const store = useProjectStore()

const loadingPrepare = ref(false)

const loading = ref(false)

const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
	projectUid: {
		type: String,
		default: '',
	}
})

watch(props, (values) => {
	if (values) {
		show.value = values.isShow

		if (values.isShow) {
			initUsers()
		}
	}
})

const selectedPic = ref([])

const availablePics = ref([])

const removedPic = ref([])

const emit = defineEmits(['close-event'])

onMounted(() => {
})

function closeDialog(isClose = false) {
	emit('close-event', isClose)
}

function choosePic(pic) {
	console.log('pic select', pic)
	var selectable = pic

	selectedPic.value.push(pic)

	var newFilter = availablePics.value.filter((filter) => {
		return filter.id != pic.id
	})

	availablePics.value = newFilter
}

function removePic(pic) {
	var selectable = pic

	availablePics.value.push(pic)

	var newFilter = selectedPic.value.filter((filter) => {
		return filter.id != pic.id
	})

	selectedPic.value = newFilter
}

async function submitForm() {
	removedPic.value = availablePics.value.filter((filter) => {
		return filter.current_id
	}).map((item) => {
		return item.id
	})

	var pics = selectedPic.value.filter((filterUser) => {
		return !filterUser.current_id
	}).map((user) => {
		return user.id
	})

	loading.value = true

	const resp = await store.subtitutePic({pics: pics, removed: removedPic.value}, props.projectUid)

	if (resp.status < 300) {
		closeDialog(true)
	}

	loading.value = false
}	

async function initUsers() {
	loadingPrepare.value = true

	const resp = await store.getPicSubtitute(props.projectUid)

	if (resp.status < 300) {
		selectedPic.value = resp.data.data.current_pic
		availablePics.value = resp.data.data.available_pic
	}

	loadingPrepare.value = false
}
</script>
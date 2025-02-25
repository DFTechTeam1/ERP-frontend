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
									
                                    <v-list-item
                                        v-for="(item, i) in pics"
                                        :key="i"
                                        prepend-avatar="/user.png"
                                        @click.prevent="selectPic(item)">
                                        <template v-slot:title>
                                            <p class="w-100 d-flex align-center justify-space-between">
                                                {{ item.name }} - {{ item.employee_id }}
                                            </p>
                                        </template>

                                        <template v-slot:subtitle>
                                            <div class="mt-2">
                                                <v-chip color="primary" density="compact">
                                                    {{ item.workload }} {{ $t("workload") }}
                                                </v-chip>
                                            </div>
                                        </template>
                                    </v-list-item>

								</v-list>
							</v-menu>
						</v-text-field>

						<v-btn class="w-100" variant="flat" color="primary"
							type="submit"
							:disabled="loading">
							<template v-if="loading">
								{{ $t('processing') }}
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
import ListPicDropdown from '../../components/ListPicDropdown.vue'
import { showNotification } from '@/compose/notification'

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
	options: {
		type: Array,
		default: []
	},
	songUid: {
		type: String
	}
})

const loadingPrepare = ref(false)

const loading = ref(false)

const emit = defineEmits(['close-event', 'on-init'])

const pic = ref([])

const picNames = ref([])

const pics = ref([]);

watch(props, (values) => {
	if (values) {
		show.value = values.isShow

		if (values.isShow) {
			initPic()
		}
	}
})

async function initPic() {
	loadingPrepare.value = true
	const resp = await store.getEntertainmentTeamList(props.projectUid)
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
		return filter.uid == user.uid
	})

    pic.value = user.uid;
    picNames.value = selected[0].name

	setFieldValue('selected_pic', picNames.value)
}

const validateData = handleSubmit(async (values) => {
	loading.value = true
	const resp = await store.distributeSong(props.projectUid, props.songUid, {employee_uid: pic.value});
	loading.value = false

	if (resp.status < 300) {
		closeDialog()
		showNotification(resp.data.message);
	} else {
		showNotification(resp.response.data.message, 'error');
	}
})

function clearPic() {
	setFieldValue('selected_pic', '')
	pic.value = []
	picNames.value = []
}

</script>

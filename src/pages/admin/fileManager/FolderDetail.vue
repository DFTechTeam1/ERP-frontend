<template>
	<div>
		<div class="folder-title">
			<div class="d-flex align-center ga-3">
				{{ $route.params.year }}
				
				<!-- <v-chip 
					v-if="!isMyFiles"
					color="grey-lighten-1"
					density="compact"
					class="pointer"
					@click.prevent="myFiles">
					{{ $t('myFiles') }}
				</v-chip>
				<v-chip 
					v-if="isMyFiles"
					color="primary"
					density="compact"
					class="pointer"
					@click.prevent="myFiles">
					{{ $t('myFiles') }}
				</v-chip> -->
			</div>

			<div class="filter-name w-50">
				<field-input
					label="search"
					class="search-project"
					:is-solo="true"
					:is-required="false"
					v-model="searchProject"
					density="compact"></field-input>
			</div>
		</div>
		<div class="folders-wrapper" v-if="folders.length">
			<template v-if="loading">
				<div class="folders-item">
					<v-skeleton-loader
						type="card"></v-skeleton-loader>
				</div>
				<div class="folders-item">
					<v-skeleton-loader
						type="card"></v-skeleton-loader>
				</div>
				<div class="folders-item">
					<v-skeleton-loader
						type="card"></v-skeleton-loader>
				</div>
				<div class="folders-item">
					<v-skeleton-loader
						type="card"></v-skeleton-loader>
				</div>
			</template>
			<template v-else>
				<div class="folders-item"
					v-for="(folder, ff) in folders"
					:key="ff"
					@click.prevent="detailFolder(folder)">
					<div class="folders-item__title">
						<v-icon
							:icon="mdiFolder"
							color="primary"
							size="50"></v-icon>
					</div>

					<div class="folders-item__value">
						<p class="name">{{ folder.name }}</p>
						<p class="desc">{{ folder.task }} Task</p>
					</div>
				</div>
			</template>
		</div>
		<div v-else>
			<v-empty-state
                :title="t('noDataToDispay')"
                :text="t('noMediaInYeas', {year: $route.params.year})"
                image="/paper.png"
                ></v-empty-state>
		</div>

		<!-- pagination -->
		<div class="d-flex align-center justify-end mt-5" v-if="folders.length && totalData > 0">
			<v-pagination
				color="primary"
				density="compact"
				v-model="page"
				:length="totalData"
				@update:modelValue="updatePage"
				:total-visible="7"></v-pagination>
		</div>
	</div>
</template>

<style lang="scss">
	.search-project {
		.v-text-field .v-input__details {
			display: none !important;
		}
	}
</style>

<style lang="scss" scoped>

	.folder-title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.folders-wrapper {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 14px;

		.folders-item {
			padding: 8px;
			border-radius: 8px;
			box-shadow: 0px 4px 37px -3px rgba(0,0,0,0.1);
			min-height: 120px;
			width: 180px;
			position: relative;
			transition: all .5s;
			cursor: pointer;

			&:hover {
				transform: scale(1.1);
			}

			&__value {
				position: absolute;
				bottom: 10px;
				left: 10px;
				right: 0;

				.name {
					font-weight: bolder;
					width: 150px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.desc {
					font-size: 12px;
					color: #BDBDBD;
				}
			}

			&__title {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { mdiFolder } from '@mdi/js'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import { watchDebounced } from '@vueuse/core'

const { t } = useI18n()

const store = useProjectStore()

const router = useRouter()
const route = useRoute()

const page = ref(1)

const searchProject = ref(null)

const totalData = ref(0)

const isMyFiles = ref(false)

const folders = ref([])

const loading = ref(false)

function detailFolder(folderInformation) {
	router.push({path: '/admin/production/files/' + route.params.year + '/' + folderInformation.client_portal})
}

async function getProjectsFolder() {
	loading.value = true
	const resp = await store.getProjectsFolder({
		year: route.params.year, 
		page: page.value || 1,
		name: searchProject.value || '',
		is_my_file: isMyFiles.value ? 1 : 0
	})
	loading.value = false

	if (resp.status < 300) {
		folders.value = resp.data.data.folders
		page.value = resp.data.data.pagination.page
		totalData.value = resp.data.data.pagination.total
		isMyFiles.value = resp.data.data.is_my_files == 0 ? false : true
	} else {
		folders.value = []
		totalData.value = 0
		page.value = 1
		isMyFiles.value = false
	}
}

onMounted(() => {
	getProjectsFolder()
})

watch(route, (values) => {
	getProjectsFolder()
})

watchDebounced(
	searchProject,
	() =>  getProjectsFolder(),
	{ debounce: 500, maxWait: 1000 }
)

function updatePage(page) {
	getProjectsFolder()
}

function myFiles() {
	isMyFiles.value = true
	getProjectsFolder()
}
</script>
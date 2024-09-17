<template>
	<div>
		<template v-if="loading">
			<div class="folders-wrapper">
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
			</div>
		</template>
		<template v-else>
			<div class="folders-wrapper" v-if="users.length">
				<div class="folders-item"
					v-for="(user, u) in users"
					:key="u"
					@click.prevent="detailImageTask(user)">
					<div class="folders-item__title">
						<v-icon
							:icon="mdiAccount"
							color="primary"
							size="50"></v-icon>
					</div>

					<div class="folders-item__value">
						<p class="name">{{ user.name }}</p>
						<p class="desc">{{ user.image }} {{ $t('images') }}</p>
					</div>
				</div>
			</div>
			<div v-else>
				<v-empty-state
	                :title="t('noDataToDispay')"
	                :text="t('noMediaInYeas', {year: $route.params.year})"
	                image="/paper.png"
	                ></v-empty-state>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
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
import { useProjectStore } from '@/stores/project'
import { useRoute, useRouter } from 'vue-router'
import { mdiAccount } from '@mdi/js'
import { useI18n } from 'vue-i18n'

const props = defineProps({
	search: {
		type: String,
		default: '',
	},
})

const { t } = useI18n() 

const store = useProjectStore()

const route = useRoute()

const router = useRouter()

const users = ref([])

const loading = ref(false)

function detailImageTask(user) {
	router.push(`/admin/production/files/${route.params.year}/${route.params.project}/images/user/${user.id}`)
}

async function getProjectFolderDetail() {
	var params = {
		type: 'user',
		year: route.params.year,
		project: route.params.project,
		name: props.search || ''
	}

	loading.value = true
	const resp = await store.getProjectFolderDetail(params)
	loading.value = false

	if (resp.status < 300) {
		users.value = resp.data.data
	}
}

onMounted(() => {
	getProjectFolderDetail()
})

watch(props, (values) => {
	if (values) {
		getProjectFolderDetail()
	}
})
</script>
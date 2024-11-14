<template>
	<master-card>
		<v-card-text>
			<template v-if="loading">
				<v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
			</template>
			<template v-else>
				<v-row>
					<v-col cols="12" md="2">
						<div class="file-sidebar">
							<div class="file-sidebar__item">
								<p class="menu-title">Folders</p>

								<div class="file-sidebar__list d-flex align-center ga-3 pointer"
									:class="{
										'active': year.active
									}"
									@click.prevent="selectYear(year)"
									v-for="(year, y) in years"
									:key="y">
									<v-icon
										:icon="mdiFolder"
										size="15"
										color="blue-grey-lighten-2"></v-icon>

									<p class="file-value">
										{{ year.year }}
									</p>
								</div>
							</div>
						</div>
					</v-col>
					<v-col cols="12" md="10">
						<router-view></router-view>
					</v-col>
				</v-row>
			</template>
		</v-card-text>
	</master-card>
</template>

<style lang="scss" scoped>
	.file-sidebar {
		padding: 4px 12px;

		&__item {
			margin-bottom: 15px;

			.menu-title {
				color: #757575;
				font-weight: bold;
				font-size: 14px;
			}
		}

		&__list {
			margin-top: 5px;
			padding-left: 14px;
			font-size: 13px;
			padding-top: 8px;
			padding-bottom: 8px;
			border-radius: 4px;
		}

		&__list.active {
			background: rgba(30, 136, 229, .4);
			font-weight: bolder;
		}
	}
</style>

<script setup>
import { mdiFolder } from '@mdi/js'
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'

const store = useProjectStore()

const router = useRouter()

const route = useRoute()

const loading = ref(false)

const years = ref([])

const selectedYear = ref(null)

function selectYear(yearData) {
	selectedYear.value = yearData.year
	mappingYear()

	router.push({path: '/admin/production/files/' + yearData.year})
}

function mappingYear() {
	years.value.map((item) => {
		item.active = false
		if (item.year == selectedYear.value) {
			item.active = true
		}

		return item
	})
}

async function initYears() {
	loading.value = true

	const resp = await store.getProjectYears()

	loading.value = false

	if (resp.status < 300) {
		years.value = resp.data.data

		// auto select first list
		selectedYear.value = years.value[0].year
		router.push({path: `/admin/production/files/${selectedYear.value}`})
		mappingYear()
	}
}

onMounted(() => {
	initYears()
	if (route.params.year) {
		selectedYear.value = route.params.year
		mappingYear()
	}
})

watch(route, (values) => {
	if (selectedYear.value) {
		if (values.path == '/admin/production/files') {
			initYears()
		}
	}
})
</script>
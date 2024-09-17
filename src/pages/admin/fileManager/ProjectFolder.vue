<template>
	<div>
		<div class="folder-title d-flex align-center justify-space-between">
			<div class="d-flex align-center ga-3">
				<v-icon
					:icon="mdiArrowLeft"
					size="20"
					class="pointer"
					@click.prevent="goBack($route.params.year)"></v-icon>

				<p>
					{{ $route.params.year }} - {{ $route.params.project }} {{ (imageRef) && (imageRef.taskName) ? ' - ' + imageRef.taskName : '' }}
				</p>
			</div>

			<div class="w-50">
				<field-input
					label="search"
					class="search-project"
					:is-solo="true"
					v-model="searchData"
					:is-required="false"
					density="compact"></field-input>
			</div>
		</div>

		<div class="filter mb-3">
			<v-btn-toggle
				v-model="filter"
				density="compact"
				color="deep-purple-accent-1"
				rounded="1"
				group
				variant="flat"
				base-color="grey-lighten-4">
				<v-btn value="task">
					By Task
				</v-btn>	
				<v-btn value="images">
					All Images
				</v-btn>	
				<v-btn value="user">
					By User
				</v-btn>	
			</v-btn-toggle>
		</div>

		<router-view v-slot="{ Component }">
			<component :search="fixSearchData" 
				:is="Component"
				ref="imageRef" />
		</router-view>
	</div>
</template>

<style lang="scss" scoped>
	.folder-title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 20px;
	}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { mdiFolder, mdiArrowLeft } from '@mdi/js'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { watchDebounced } from '@vueuse/core'

const store = useProjectStore()

const router = useRouter()

const route = useRoute()

const filter = ref('task')

const imageRef = ref(null)

const searchData = ref(null)

const fixSearchData = ref('')

const tasks = ref([])

function goBack(year) {
	console.log('iamge', imageRef.value)
	if (imageRef.value.taskName) {
		imageRef.value = null
		router.push({path: '/admin/production/files/' + year + '/' + route.params.project + '/task'})
	} else {
		router.push({path: '/admin/production/files/' + year})
	}
}

watch(filter, (values) => {
	if (values) {
		router.push({path: `/admin/production/files/${route.params.year}/${route.params.project}/${values}`})
	}
})

onMounted(() => {
	router.push({path: `/admin/production/files/${route.params.year}/${route.params.project}/${filter.value}`})
})

watchDebounced(
	searchData,
	() => { fixSearchData.value = searchData.value },
	{ debounce: 500 }
)
</script>
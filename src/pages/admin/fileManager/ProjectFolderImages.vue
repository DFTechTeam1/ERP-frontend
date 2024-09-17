<template>
	<div>
		<template v-if="images.length">
			<div class="folders-wrapper">
				<div class="folders-item"
					v-for="(image, ff) in images"
					:key="ff">
					<div class="image-item">
						<div class="img">
							<v-img
								:src="image.image"
								width="130"
								height="130"></v-img>
						</div>

						<div class="text-center mt-2">
							<p class="fw-bold">{{ image.image_name }}</p>
							<p class="owner">({{ image.owner }})</p>
						</div>
					</div>
				</div>
				<div class="folders-item"
					v-for="(nas, n) in links"
					:key="n"
					@click.prevent="gotoNas(nas)">
					<div class="image-item">
						<div class="img">
							<v-img
								src="/nas.png"
								width="130"
								height="130"></v-img>
						</div>

						<div class="text-center mt-2">
							<p class="fw-bold">{{ nas.image }}</p>
							<p class="owner">({{ nas.owner }})</p>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template v-else>
			<v-empty-state
                :title="t('noDataToDispay')"
                :text="t('noMediaInYeas', {year: $route.params.year})"
                image="/paper.png"
                ></v-empty-state>
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

			.image-item {
				text-align: center;

				.img {
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.owner {
					font-size: 12px;
				}
			}

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
import { useRoute } from 'vue-router'
import { mdiFolder } from '@mdi/js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 

const store = useProjectStore()

const route = useRoute()

const taskName = ref(null)

const userName = ref(null)

const images = ref([])

const links = ref([])

const loading = ref(false)

defineExpose({
	taskName
})

function gotoNas(nas) {
	window.open(nas.image, '_blank');
}

async function getProjectFolderDetail() {
	var params = {
		type: 'images',
		year: route.params.year,
		project: route.params.project,
	}

	if (route.params.task) {
		params.task = route.params.task
	}

	if (route.params.user) {
		params.user = route.params.user
	}

	loading.value = true
	const resp = await store.getProjectFolderDetail(params)
	loading.value = false

	if (resp.status < 300) {
		images.value = resp.data.data.image
		links.value = resp.data.data.nas_link

		if (resp.data.data.task) {
			taskName.value = resp.data.data.task
		}

		if (resp.data.data.user) {
			userName.value = resp.data.data.user
		}
	}
}

onMounted(() => {
	getProjectFolderDetail()
})

watch(route, (values) => {
	if (taskName.value || userName.value) { // this just happened when image task is loaded, and user want to see all images
		getProjectFolderDetail()
	}
})
</script>
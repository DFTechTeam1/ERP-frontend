<template>
	<div>
		<v-skeleton-loader type="table" v-if="(detailProject == null) && (!detailProject.entertain_teams.length)"></v-skeleton-loader>
		<div v-else class="px-3">
			<list-item :list="detailProject.entertain_teams"></list-item>
		</div>
	</div>
</template>

<script setup>
import { useProjectStore } from '@/stores/project'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia';
import ListItem from './components/ListItem.vue'

const store = useProjectStore()

const { detailProject } = storeToRefs(store);

const props = defineProps({
	detail: {
		default: null,
	},
})
</script>
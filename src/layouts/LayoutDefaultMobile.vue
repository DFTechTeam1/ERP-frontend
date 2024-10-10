<template>
	<div class="main-mobile-wrapper">
		<v-bottom-navigation
			v-model="nav"
			color="primary">
			<v-btn value="project">
				<v-icon :icon="mdiTools"></v-icon>

				{{ $t('projects') }}
			</v-btn>
			<v-btn value="task">
				<v-icon :icon="mdiFileDocumentCheckOutline"></v-icon>

				{{ $t('tasks') }}
			</v-btn>
		</v-bottom-navigation>
	</div>
</template>

<style lang="scss" scoped>
	.main-mobile-wrapper {
		background-color: #f6f6f6;
		width: 100%;
		height: 100%;
	}
</style>

<script setup>
import { mdiTools, mdiFileDocumentCheckOutline } from '@mdi/js'
import { ref } from 'vue'

const nav = ref('task')
</script>
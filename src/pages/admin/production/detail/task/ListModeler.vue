<template>
	<v-list-item
		v-for="(item, i) in props.pics"
		:key="i"
		prepend-avatar="/user.png"
		@click.prevent="$emit('select-item', item)">
		<template v-slot:title>
			<p class="w-100 d-flex align-center justify-space-between">
				{{ item.title }}
			</p>
		</template>

		<template v-slot:subtitle>
			<div class="mt-2" :style="{
                display: 'flex',
                flexWrap: 'wrap'
            }">
                <v-chip color="primary" size="small" class="ms-2">
                    {{ $t("taskOnSelectedProject", {number: item.task_in_selected_project}) }}
                </v-chip>
                <v-chip color="primary" size="small" class="ms-2">
                    {{ $t("taskOnNextWeek", {number: item.task_in_next_week}) }}
                </v-chip>
                <v-chip color="primary" size="small" class="ms-2">
                    {{ $t("taskOnCurrentWeek", {number: item.task_in_current_week}) }}
                </v-chip>
			</div>
		</template>	

		<template v-slot:append>
			<v-icon v-if="props.clearable"
				:icon="mdiClose"
				size="15"
				class="pointer"
				@click.prevent="$emit('clearable-event', item)"></v-icon>
		</template>
	</v-list-item>
</template>

<script setup>
	import { mdiClose } from '@mdi/js'

	const props = defineProps(['pics', 'clearable'])
	defineEmits(['select-item', 'clearable-event'])
</script>
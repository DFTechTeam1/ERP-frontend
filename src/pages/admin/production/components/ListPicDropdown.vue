<template>
	<v-list-item
		v-for="(item, i) in props.pics"
		:key="i"
		prepend-avatar="/user.png"
		@click.prevent="$emit('select-item', item)">
		<template v-slot:title>
			<p class="w-100 d-flex align-center justify-space-between">
				{{ item.name }}

				<div v-if="item.is_recommended">
					<v-chip color="success" density="compact">
						<v-icon :icon="mdiStarCheck"></v-icon>

						<span style="font-size: 10px;">Recommended</span>
					</v-chip>
				</div>
			</p>
		</template>

		<template v-slot:subtitle>
			<div class="mt-2">
				<v-chip color="red" density="compact">
					{{ item.projects.traveled }}
				</v-chip>
			</div>
			<div class="mt-2">
				<v-chip color="red" density="compact">
					{{ item.projects.projects }}
				</v-chip>
			</div>
			<div class="mt-2">
				<v-chip color="primary" density="compact">
					{{ item.projects.event_class }}
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
<template>
	<template v-if="list.length">
		<v-list-item
	        v-for="(team, t) in list"
	        :key="t"
	        :lines="team.loan ? 'three' : 'two'"
	        :title="team.name"
	        @click.prevent="detailEmployee(team)"
	        :border="t === list.length - 1 ? 'none' : 'bottom'">
	        <template v-slot:subtitle>
	            <v-chip class="team-position mt-1"
	                density="compact"
	                color="primary">
	                {{ team.position.name }}    
	            </v-chip>

	            <v-chip v-if="team.loan"
	                class="team-position mt-1"
	                color="red"
	                density="compact">
	                {{ $t('loan') }}
	            </v-chip>
	        </template>

	        <template v-slot:append>
	            <div class="d-flex align-center ga-2 task"
	            	v-if="haveTaskInformation">
	                Total <b>{{ team.total_task }}</b> {{ $t('totalTaskInProject') }}
	            </div>
	        </template>
	    </v-list-item>
	</template>
	<template v-else>
		<v-empty-state
            :title="t('noDataToDispay')"
            image="/paper.png"
            size="80"
            ></v-empty-state>
	</template>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
	list: {
		default: [],
	},
	haveTaskInformation: {
		default: false,
			type: Boolean,
	}
})
</script>
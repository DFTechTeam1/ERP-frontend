<template>
    <div>
        <v-table>
            <thead>
                <tr>
                    <th
                        v-for="(header, x) in headers"
                        :key="x">
                        {{ header.title }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <template
                    v-if="(detailProject && detailProject.teams.length)">
                    <tr
                        v-for="(team, t) in detailProject.teams"
                        :key="t">
                        <td>{{ team.name }}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                </template>

                <template v-else>
                    <tr>
                        <td colspan="4" class="text-center">
                            {{ $t('noTeams') }}
                        </td>
                    </tr>
                </template>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

const { t } = useI18n()

const store = useProjectStore()

const { detailProject } = storeToRefs(store);

const props = defineProps({
    detail: {
        default: null,
    },
})

const listTeams = ref([])
const totalItems = ref(0)
const itemsPerPage = ref(10)
const loading = ref(false)
const showClearFilter = ref(false)
const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: t('currentTask'),
        key: 'current_task',
        align: 'start',
        sortable: true
    },
    {
        title: t('lastUpdate'),
        key: 'last_update',
        align: 'start',
        sortable: true
    },
    {
        title: t('action'),
        key: 'uid',
        align: 'start',
        sortable: true
    },
])

onMounted(() => {
    console.log('team', props.detail);
})
</script>
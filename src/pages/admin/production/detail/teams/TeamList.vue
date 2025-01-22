<template>
    <v-skeleton-loader type="table" v-if="detailProject == null"></v-skeleton-loader>
    <div v-else class="px-3" style="height: 100%;">
        <template v-if="detailProject.teams.length">
            <v-list>
                <list-item :list="detailProject.teams" :haveTaskInformation="true"></list-item>
            </v-list>
        </template>
        <template v-else>
            <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <v-empty-state
                    :title="t('noDataToDispay')"
                    image="/paper.png"
                    size="80"
                    ></v-empty-state>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
    .team-position,
    .task {
        font-size: 12px;
    }

</style>

<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import ListItem from './components/ListItem.vue'

const { t } = useI18n()

const router = useRouter()

const store = useProjectStore()

const { detailProject } = storeToRefs(store);

const props = defineProps({
    detail: {
        default: null,
    },
})

const teams = ref([
    {
        title: 'Ilham Meru Gumilang',
        subtitle: '3D Generalis',
        props: {
            appendIcon: 'mdi-close',
        }
    },
    {
        type: 'divider',
        inset: false,
    },
])

const listTeams = ref([])
const totalItems = ref(0)
const itemsPerPage = ref(100)
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

watch(props, (values) => {
  console.log("wathcer team list", values);
    if (values && detailProject.value) {
        listTeams.value = detailProject.value.teams
    }
})

function detailEmployee(employee) {
    router.push({path: '/admin/employees/' + employee.uid + '/general'})
}
</script>

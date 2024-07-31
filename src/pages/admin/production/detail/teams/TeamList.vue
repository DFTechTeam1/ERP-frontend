<template>
    <v-skeleton-loader type="table" v-if="detailProject == null"></v-skeleton-loader>
    <div v-else>
        <table-list
            :has-shadow="false"
            :headers="headers"
            :items="detailProject.teams"
            :totalItems="detailProject.teams.length"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="false"
            :has-add-button="false"
            :has-checkbox="false"
            :has-filter="false"
        ></table-list>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useI18n } from 'vue-i18n'
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
    if (values && detailProject.value) {
        listTeams.value = detailProject.value.teams
    }
})
</script>
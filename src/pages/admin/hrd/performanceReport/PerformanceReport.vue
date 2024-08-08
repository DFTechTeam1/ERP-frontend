<template>
    <div>
        <breadcrumb-data
            :title="$t('performanceReport')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-row>
            <v-col
                cols="12"
                md="3">
                <FilterView :loading="loading"></FilterView>
            </v-col>

            <v-col
                cols="12"
                md="9">
                <CardReports :loading="loading"></CardReports>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FilterView from './FilterView.vue';
import CardReports from './CardReports.vue';
import { usePerformanceReportStore } from '@/stores/performanceReport';

const { t } = useI18n()

const store = usePerformanceReportStore()

const breadcrumbs = ref([
    {
        title: t('performanceReport'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

const loading = ref(false)

async function initEmployees() {
    loading.value = true
    await store.getMembers()
    loading.value = false
}

onMounted(() => {
    initEmployees()
})
</script>
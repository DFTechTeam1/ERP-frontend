<template>
    <master-card style="border-radius: 6px; position: relative; margin: 0 auto; display: flex; align-items: center;" min-height="220">
        <v-card-text class="text-center">
            <template v-if="isLoadingPerformance">
                <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
            </template>
            <template v-else>
                <p class="title text-center">{{ !memberReportResult ? '-' : memberReportResult.total_project }}</p>
    
                <p class="detail">
                    Total Project
                </p>
            </template>
        </v-card-text>
    </master-card>
</template>

<style scoped lang="scss">
.title {
    font-size: 32px;
    font-weight: bolder;
    margin-bottom: 20px;
}

.detail {
    font-size: 24px;
    color: #000;
}
</style>

<script setup>
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { storeToRefs } from 'pinia';

const store = usePerformanceReportStore()

const { memberReportResult, isLoadingPerformance } = storeToRefs(store)
</script>
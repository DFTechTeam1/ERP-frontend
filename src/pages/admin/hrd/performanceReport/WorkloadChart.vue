<template>
    <master-card style="border-radius: 6px;" min-height="220">
        <v-card-item>
            <v-card-title>
                {{ $t('realtimeWorkSummary') }}
            </v-card-title>
        </v-card-item>

        <v-card-text class="text-start">
            <template v-if="isLoadingPerformance">
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
            </template>
            <template v-else>
                <template v-if="!memberReportResult">
                    <div class="d-flex align-center justify-center">
                        {{ $t('pleaseSelectEmployee') }}
                    </div>
                </template>
                <template v-else>
                    <apexchart height="150" type="donut" :options="options" :series="memberReportResult.chart.series"
                        v-if="memberReportResult.chart.show_chart"></apexchart>

                    <div class="d-flex align-center justify-center" v-else>
                        {{ $t('doNotHaveGraphic') }}
                    </div>
                </template>
            </template>
        </v-card-text>
    </master-card>
</template>

<script setup>
import { ref } from 'vue';
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const store = usePerformanceReportStore()

const { t } = useI18n()

const { memberReportResult, isLoadingPerformance } = storeToRefs(store)

const options = ref({
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: true,
    },
    responsive: [{
        breakpoint: 600,
        options: {},
    }],
    plotOptions: {
        pie: {
            expandOnClick: true,
            donut: {
                labels: {
                    show: true,
                }
            },
        },
    },
    labels: [t('complete'), t('revise'), t('waitingApproval'), t('ongoing')],
});

const series = ref([44, 55, 41, 17, 15]);
</script>
<template>
    <master-card style="border-radius: 6px;" min-height="220">
        <v-card-item>
            <v-card-title>
                {{ $t('realtimeReport') }}
            </v-card-title>
        </v-card-item>

        <v-card-text>
            <template v-if="isLoadingPerformance">
                <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
            </template>
            <template v-else>
                <template v-if="!memberReportResult">
                    <div class="d-flex align-center justify-center">
                        {{ $t('pleaseSelectEmployee') }}
                    </div>
                </template>
                <template v-else>
                    <div class="first-row d-flex align-center justify-space-between">
                        <div class="profile-info d-flex align-items ga-3">
                            <v-avatar size="48px">
                                <v-img alt="avatar" src="/user.png"></v-img>
                            </v-avatar>
        
                            <div class="profile-detail">
                                <p class="name fw-bold">
                                    {{ memberReportResult.realtime_report.name }}
                                </p>
                                <v-chip color="primary"
                                    density="compact"
                                    style="font-size: 10px; margin-left: 0; margin-top: 5px;">
                                    {{ memberReportResult.realtime_report.position }}
                                </v-chip>
                            </div>
                        </div>
        
                        <div class="point-wrapper">
                            <div class="point-box">
                                <p class="text-center fw-bold">
                                    {{ memberReportResult.realtime_report.total_point }}
                                </p>
                                <v-divider class="mt-2 mb-2"></v-divider>
                                <p>Total Point</p>
                            </div>
                        </div>
                    </div>
        
                    <div class="second-row d-flex align-center justify-space-between mt-4">
                        <div class="info-box">
                            <p class="title mb-0 pb-0">
                                {{ $t('team') }}
                            </p>
                            <p class="value">
                                {{ memberReportResult.realtime_report.boss }}
                            </p>
                        </div>
                        <div class="info-box">
                            <p class="title mb-0 pb-0">
                                {{ $t('period') }}
                            </p>
                            <p class="value">
                                {{ memberReportResult.realtime_report.period }}
                            </p>
                        </div>
                    </div>
                </template>
            </template>
        </v-card-text>
    </master-card>
</template>

<style lang="scss" scoped>
.info-box {
    .title {
        font-size: 12px;
        color: #6b6a6a;
    }

    .value {
        font-weight: bolder;
        font-size: 14px;
    }
}

.point-box {
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    padding: 4px 6px;

    p:first-child {
        font-size: 13px;
    }

    p.last-child {
        font-size: 12px;
    }
}
</style>

<script setup>
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { storeToRefs } from 'pinia';

const store = usePerformanceReportStore()

const { memberReportResult, isLoadingPerformance } = storeToRefs(store)
</script>
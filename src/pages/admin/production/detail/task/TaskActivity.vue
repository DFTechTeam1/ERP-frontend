<template>
    <div class="activity mt-5">
        <div class="title-desc d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-5">
                <v-icon
                    :icon="mdiChartLineVariant"
                    size="20"></v-icon>
                <h3>{{ $t('activity') }}</h3>
            </div>
        </div>
        
        <div class="activity-wrapper">
            <template v-if="detailOfTask.logs.length">
                <div class="activity-item d-flex align-center ga-3"
                    v-for="(log, x) in detailOfTask.logs"
                    :key="x">
                    <v-avatar
                        size="small">
                        <v-img
                            src="/user.png"></v-img>
                    </v-avatar>
    
                    <div class="detail">
                        <p class="detail-information">{{ log.text }}</p>
                        <p class="detail-time">{{ log.time_created }}</p>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="text-center">
                    {{ $t('emptyLogs') }}
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.activity-wrapper {
    margin-top: 10px;

    .activity-item {
        margin-bottom: 10px;
    }

    .detail {
        .detail-information {
            font-size: 13px;
            line-height: 1.2;
            font-weight: 600;
        }

        .detail-time {
            font-size: 11px;
            font-weight: 200;
            margin-top: 2px;
        }
    }
}
</style>

<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiChartLineVariant } from '@mdi/js'
import { storeToRefs } from 'pinia';

const store = useProjectStore();

const { detailOfTask } = storeToRefs(store);
</script>
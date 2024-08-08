<template>
    <master-card style="border-radius: 6px;" min-height="220">
        <v-card-item>
            <v-card-title>
                {{ $t('detailPoint') }}
            </v-card-title>
        </v-card-item>

        <v-card-text>
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
                    <v-data-table
                        class="point-table-performance"
                        v-model:expanded="expanded"
                        :headers="headers"
                        :items="memberReportResult.point_detail"
                        items-per-page="1000"
                        item-value="project_name"
                        show-expand>
                        <template v-slot:expanded-row="{ columns, item }">
                        <tr>
                            <td :colspan="columns.length">
                                <v-list>
                                    <v-list-item lines="two" class="task-detail"
                                        v-for="(task, t) in item.tasks"
                                        :key="t">
                                        <v-list-item-title class="title">
                                            {{ task.name }}
                                        </v-list-item-title>
                                        <v-list-item-subtitl class="subtitle">
                                            {{ $t('assignedAt') }} {{ task.assigned_at }}
                                        </v-list-item-subtitl>
                                    </v-list-item>
                                </v-list>
                            </td>
                        </tr>
                        </template>
                    </v-data-table>
                </template>
            </template>
        </v-card-text>
    </master-card>
</template>

<style lang="scss">
.point-table-performance {
    .v-data-table-footer {
        display: none !important;
    }
}

.task-detail {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    min-height: auto !important;

    .title {
        font-size: 12px;
    }

    .subtitle {
        font-size: 10px;
    }
}
</style>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePerformanceReportStore } from '@/stores/performanceReport';
import { storeToRefs } from 'pinia';

const store = usePerformanceReportStore()

const { memberReportResult, isLoadingPerformance } = storeToRefs(store)

const { t } = useI18n()

const expanded = ref([])

const headers = ref([
    {
        title: t('name'),
        align: 'start',
        sortable: false,
        key: 'project_name',
    },
    { title: t('point'), key: 'total_point' },
    { title: t('additionalPoint'), key: 'additional_point' },
    { title: '', key: 'data-table-expand' },
])
</script>
<template>
    <v-card flat>
        <v-card-text>
            <v-row>
                <v-col cols="12"
                    md="8">
                    <v-expansion-panels variant="accordion"
                        v-for="(item, x) in detailOfEmployee.data.data.project_detail"
                        :key="x">
                        <v-expansion-panel>
                            <v-expansion-panel-title>
                                <div>
                                    <h4>{{ item.name }}</h4>
                                    <p class="mt-1" style="font-size: 12px;">{{ item.position }}</p>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <template v-if="!item.detail_task.length">
                                    <v-table>
                                        <tbody>
                                            <tr>
                                                <td style="width: 40%;">{{ $t('name') }}</td>
                                                <td style="width: 60%;" class="fw-bold">
                                                    <router-link :to="'/admin/production/project/' + item.id">
                                                        {{ item.name }}
                                                    </router-link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%;">{{ $t('projectDate') }}</td>
                                                <td style="width: 60%;" class="fw-bold">{{ item.project_date }}</td>
                                            </tr>
                                            <tr>
                                                <td style="width: 40%;">{{ $t('assignAt') }}</td>
                                                <td style="width: 60%;" class="fw-bold">{{ item.assign_at }}</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </template>
                                <template v-else>
                                    <div class="detail-task-wrapper">
                                        <div class="detail-task-info mb-2 pointer"
                                            v-for="(detailTask, dt) in item.detail_task"
                                            :key="dt">
                                            <p class="fw-bold detail-task-name">{{ detailTask.name }}</p>
                                            <p class="detail-task-detail text-grey-darken-2">{{ $t('assignAt') }} {{ detailTask.assign_at }}</p>
                                            <p class="detail-task-detail text-grey-darken-2"
                                                v-if="detailTask.start_working_at">{{ $t('startWorkingAt') }} {{ detailTask.start_working_at }}</p>
                                        </div>
                                    </div>
                                </template>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<style scoped lang="scss">
.detail-task-wrapper {
    padding-left: 10px;

    .detail-task-name {
        font-size: 14px;
        font-weight: bold;
        text-transform: capitalize;
    }

    .detail-task-detail {
        font-size: 12px;
    }
}
</style>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';

const store = useEmployeesStore();

const { detailOfEmployee } = storeToRefs(store);
</script>
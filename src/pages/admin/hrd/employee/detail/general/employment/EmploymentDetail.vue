<template>
    <div>
        <template v-if="!detailOfEmployee">
            <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
        </template>
        <template v-else>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('company') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.company_name }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('employeeID') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.employee_id }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('jobPosition') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.position.name }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('level') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.level_staff_text }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('status') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.status_text }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('joinDate') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.join_date_format }} <span class="length-of-service">{{ detailOfEmployee.data.data.length_of_service }}</span>
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('approvalLine') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.approval_line || '-' }}
                    </p>
                </v-col>
            </v-row>
        </template>
    </div>
</template>

<style scoped lang="scss">
.length-of-service {
    font-size: 12px !important;
    padding: 2px 6px;
    background: #e6e6e6;
    border-radius: 4px;
    font-weight: bold;
    margin-left: 5px;
}
</style>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';

const store = useEmployeesStore()

const { detailOfEmployee } = storeToRefs(store)
</script>
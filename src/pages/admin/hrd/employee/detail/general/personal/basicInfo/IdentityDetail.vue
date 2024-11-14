<template>
    <div>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('idNumber') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.id_number }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">NPWP</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.npwp_number || '-' }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">BPJS</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">{{ detailOfEmployee.data.data.bpjs_ketenagakerjaan_number || '-' }}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('address') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.address || '-' }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('currentAddress') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.current_address || '-' }}
                </p>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';

const store = useEmployeesStore()

const { detailOfEmployee } = storeToRefs(store)
</script>
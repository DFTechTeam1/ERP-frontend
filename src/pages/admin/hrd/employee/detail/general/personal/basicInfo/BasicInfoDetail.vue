<template>
    <div>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('name') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.name }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('nickname') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.nickname }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('phone') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.phone }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('email') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.email }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('placeOfBirth') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.place_of_birth }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('dateOfBirth') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.date_of_birth }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('gender') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.gender_text }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('martialStatus') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.martial_text }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('bloodType') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.blood_type || '-' }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="5">
                <p class="employee-detail-title">{{ $t('religion') }}</p>
            </v-col>
            <v-col cols="12" md="7">
                <p class="employee-detail-value">
                    {{ detailOfEmployee.data.data.religion }}
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
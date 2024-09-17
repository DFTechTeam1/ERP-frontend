<template>
    <div>
        <p class="detail-employee-title">
            {{ $t('employment') }}
        </p>

        <v-row style="padding-bottom: 10px; margin-top: 20px;">
            <v-col cols="12" md="3">
                <p class="employee-information-title">{{ $t('employmentData') }}</p>
                <p class="employee-information-sub">{{ $t('personalDataHelper') }}</p>
            </v-col>

            <v-col
                cols="12"
                md="8">
                <EmploymentDetail v-if="!isEditingEmployment" />
                <EmploymentForm
                    v-if="isEditingEmployment"
                    @close-event="isEditingEmployment = false"
                    :show-form="isEditingEmployment" />
            </v-col>

            <v-col cols="12" md="1">
                <v-btn variant="tonal" color="primary" v-if="!isEditingEmployment" @click.prevent="isEditingEmployment = true">{{ $t('edit') }}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import EmploymentDetail from './EmploymentDetail.vue';
import EmploymentForm from './EmploymentForm.vue';

const isEditingEmployment = ref(false)
</script>
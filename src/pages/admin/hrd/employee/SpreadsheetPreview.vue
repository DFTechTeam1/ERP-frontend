<template>
    <v-dialog v-model="show"
        persistent>
        <master-card
            max-height="800">
            <v-card-item class="position-fixed w-100 bg-surface border border-bottom" style="top: 0;">
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('previewEmployeeData') }}

                    <v-icon
                        :icon="mdiClose"
                        size="20"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text style="padding-bottom: 100px; padding-top: 70px;">
                <div class="information-wrapper mt-3 mb-3">
                    <v-chip
                        density="compact"
                        color="deep-orange-darken-1">
                        {{ $t('listAreWrong', {number: totalOfWrongImport}) }}
                    </v-chip>
                    <v-chip
                        class="ms-2"
                        density="compact"
                        color="green-darken-2">
                        {{ $t('listAreQualified', {number: totalOfCorrectImport}) }}
                    </v-chip>
                </div>

                <v-divider></v-divider>

                <v-table fixed-header height="500" class="mt-3">
                    <thead>
                        <tr>
                            <th>{{ $t('name') }}</th>
                            <th>{{ $t('employeeID') }}</th>
                            <th>{{ $t('nickname') }}</th>
                            <th>{{ $t('company') }}</th>
                            <th>{{ $t('position') }}</th>
                            <th>{{ $t('level') }}</th>
                            <th>{{ $t('status') }}</th>
                            <th>{{ $t('joinDate') }}</th>
                            <th style="width: 200px;">{{ $t('startReviewProbation') }}</th>
                            <th>{{ $t('probationStatus') }}</th>
                            <th>{{ $t('endProbationDate') }}</th>
                            <th>{{ $t('gender') }}</th>
                            <th>{{ $t('banks') }}</th>
                            <th>{{ $t('accountNumber') }}</th>
                            <th>{{ $t('accountHolderName') }}</th>
                            <th>{{ $t('emergencyContact') }}</th>
                            <th>{{ $t('emergencyContact') }} {{ $t('phone') }}</th>
                            <th>{{ $t('emergencyContact') }} {{ $t('relation') }}</th>
                            <th>{{ $t('education') }}</th>
                            <th>{{ $t('educationName') }}</th>
                            <th>{{ $t('educationMajor') }}</th>
                            <th>{{ $t('educationYear') }}</th>
                            <th>{{ $t('position') }}</th>
                            <th>{{ $t('level') }}</th>
                            <th>{{ $t('status') }}</th>
                            <th>{{ $t('joinDate') }}</th>
                        </tr>
                    </thead>
        
                    <tbody>
                        <template v-if="listOfPreviewImport.length">
                            <tr v-for="(item, key) in listOfPreviewImport"
                                :key="key"
                                :class="{
                                    'pointer': item.wrong_format,
                                    'bg-deep-orange-darken-1': item.wrong_format,
                                }">
                                <v-tooltip
                                    v-if="item.wrong_format"
                                    activator="parent"
                                    location="bottom">
                                    <p class="m-0 p-0" v-for="(error, e) in item.wrong_data" :key="e">{{ error }}</p>
                                </v-tooltip>
                                <td>{{ item.name }}</td>
                                <td>{{ item.employee_id }}</td>
                                <td>{{ item.nickname }}</td>
                                <td>{{ item.company_name }}</td>
                                <td>{{ item.position_raw }}</td>
                                <td>{{ item.level_staff_raw }}</td>
                                <td>{{ item.status_raw }}</td>
                                <td>{{ item.join_date }}</td>
                                <td>{{ item.start_review_probation_date }}</td>
                                <td>{{ item.probation_status_raw ? item.probation_status_raw : '-' }}</td>
                                <td>{{ item.end_probation_date ? item.end_probation_date : '-' }}</td>
                                <td>{{ item.gender_raw }}</td>
                                <td>{{ item.bank_detail[0].bank_name || '-' }}</td>
                                <td>{{ item.bank_detail[0].account_number || '-' }}</td>
                                <td>{{ item.bank_detail[0].account_holder_name || '-' }}</td>
                                <td>{{ item.relation_contact.name || '-' }}</td>
                                <td>{{ item.relation_contact.phone || '-' }}</td>
                                <td>{{ item.relation_contact.relation || '-' }}</td>
                                <td>{{ item.education_raw }}</td>
                                <td>{{ item.education_name }}</td>
                                <td>{{ item.education_major }}</td>
                                <td>{{ item.education_year }}</td>
                                <td>{{ item.position_raw }}</td>
                                <td>{{ item.level_staff_raw }}</td>
                                <td>{{ item.status_raw }}</td>
                                <td>{{ item.join_date }}</td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td class="text-center" colspan="13">{{ $t('emptyList') }}</td>
                            </tr>
                        </template>
                    </tbody>
                </v-table>

            </v-card-text>

            <v-card-actions class="position-fixed bg-surface w-100" style="bottom: 0;">
                <v-btn
                    class="mt-3"
                    variant="flat"
                    color="primary"
                    :disabled="loading"
                    @click.prevent="submitImport">
                    <template v-if="loading">{{ $t('processing') }}</template>
                    <template v-else>
                        {{ $t('save') }}
                    </template>
                </v-btn>
                <v-btn
                    class="mt-3"
                    variant="flat"
                    color="secondary"
                    :disabled="loading"
                    @click.prevent="$emit('close-event')">
                    {{ $t('cancel') }}
                </v-btn>
            </v-card-actions>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const show = ref(false)

const store = useEmployeesStore()

const loading = ref(false)

const showEditForm = ref(false)

const { listOfPreviewImport, totalOfWrongImport, totalOfCorrectImport } = storeToRefs(store)

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

async function submitImport() {
    loading.value = true
    const resp = await store.submitImport()
    loading.value = false

    if (resp.status < 300) {
        emit('close-event', true)
    }
}
</script>
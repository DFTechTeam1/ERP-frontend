<template>
    <div>
        <template v-if="!detailOfEmployee">
            <v-skeleton-loader
                type="list-item-three-line"></v-skeleton-loader>
        </template>
    
        <template v-else>
            <div class="mt-4">
                <v-row>
                    <v-col
                        cols="12"
                        md="6">
                        <table class="w-100">
                            <tbody>
                                <tr>
                                    <td class="title" style="width: 20%;">{{ $t('name') }}</td>
                                    <td style="width: 5%;">:</td>
                                    <td style="width: 60%;">{{ detailOfEmployee.data.data.name }} ({{ detailOfEmployee.data.data.nickname }})</td>
                                </tr>
                                <tr>
                                    <td class="title" style="width: 20%;">{{ $t('position') }}</td>
                                    <td style="width: 5%;">:</td>
                                    <td style="width: 60%;">{{ detailOfEmployee.data.data.position.name }}</td>
                                </tr>
                                <tr>
                                    <td class="title" style="width: 20%;">{{ $t('phone') }}</td>
                                    <td style="width: 5%;">:</td>
                                    <td style="width: 60%;">{{ detailOfEmployee.data.data.phone }}</td>
                                </tr>
                                <tr>
                                    <td class="title" style="width: 20%;">{{ $t('idNumber') }}</td>
                                    <td style="width: 5%;">:</td>
                                    <td style="width: 60%;">{{ detailOfEmployee.data.data.id_number }}</td>
                                </tr>
                                <tr>
                                    <td class="title" style="width: 20%;">{{ $t('religion') }}</td>
                                    <td style="width: 5%;">:</td>
                                    <td style="width: 60%; text-transform: capitalize;">{{ detailOfEmployee.data.data.religion }}</td>
                                </tr>
                                <tr>
                                    <td class="title" style="width: 20%;">{{ $t('dateOfBirth') }}</td>
                                    <td style="width: 5%;">:</td>
                                    <td style="width: 60%;">{{ detailOfEmployee.data.data.place_of_birth }}, {{ detailOfEmployee.data.data.date_of_birth_text }}</td>
                                </tr>
                                <tr>
                                    <td class="title" style="width: 20%;">{{ $t('martialStatus') }}</td>
                                    <td style="width: 5%;">:</td>
                                    <td style="width: 60%; text-transform: capitalize;">{{ detailOfEmployee.data.data.martial_status }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-col>
                    <v-col
                        cols="12"
                        md="6">
                        <table class="w-100">
                            <tbody>
                                <tr>
                                    <tr>
                                        <td class="title" style="width: 20%;">{{ $t('address') }}</td>
                                        <td style="width: 5%;">:</td>
                                        <td style="width: 60%;">{{ detailOfEmployee.data.data.full_address }}</td>
                                    </tr>
                                    <tr>
                                        <td class="title" style="width: 20%;">{{ $t('currentAddress') }}</td>
                                        <td style="width: 5%;">:</td>
                                        <td style="width: 60%;">{{ detailOfEmployee.data.data.current_address }}</td>
                                    </tr>
                                    <tr>
                                        <td class="title" style="width: 20%;">{{ $t('bloodType') }}</td>
                                        <td style="width: 5%;">:</td>
                                        <td style="width: 60%;">{{ detailOfEmployee.data.data.blood_type }}</td>
                                    </tr>
                                    <tr>
                                        <td class="title" style="width: 20%;">{{ $t('gender') }}</td>
                                        <td style="width: 5%;">:</td>
                                        <td style="width: 60%; text-transform: capitalize;">{{ detailOfEmployee.data.data.gender }}</td>
                                    </tr>
                                    <tr>
                                        <td class="title" style="width: 20%;">{{ $t('dependents') }}</td>
                                        <td style="width: 5%;">:</td>
                                        <td style="width: 60%; text-transform: capitalize;">{{ detailOfEmployee.data.data.dependant }}</td>
                                    </tr>
                                    <tr>
                                        <td class="title" style="width: 20%;">{{ $t('banks') }}</td>
                                        <td style="width: 5%;">:</td>
                                        <td style="width: 60%;">
                                            <template v-if="detailOfEmployee.data.data.bank_detail">
                                                <table class="w-100">
                                                    <thead>
                                                        <tr>
                                                            <th>{{ $t('bankName') }}</th>
                                                            <th>{{ $t('accountNumber') }}</th>
                                                            <th>{{ $t('accountHolderName') }}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr
                                                            v-for="(bank, i) in detailOfEmployee.data.data.bank_detail"
                                                            :key="i">
                                                            <td class="pl-2">{{ bank.bank_name }}</td>
                                                            <td class="pl-2">{{ bank.account_number }}</td>
                                                            <td class="pl-2">{{ bank.account_holder_name }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </template>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="title" style="width: 20%;">{{ $t('emergencyContact') }}</td>
                                        <td style="width: 5%;">:</td>
                                        <td style="width: 60%;">
                                            <template v-if="detailOfEmployee.data.data.emergency_contact">
                                                <table class="w-100">
                                                    <thead>
                                                        <tr>
                                                            <th>{{ $t('name') }}</th>
                                                            <th>{{ $t('phone') }}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="pl-2 text-center">{{ detailOfEmployee.data.data.emergency_contact.name }}</td>
                                                            <td class="pl-2 text-center">{{ detailOfEmployee.data.data.emergency_contact.phone }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </template>
                                        </td>
                                    </tr>
                                </tr>
                            </tbody>
                        </table>
                    </v-col>
                </v-row>
            </div>
        </template>
    </div>
</template>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';

const store = useEmployeesStore();

const { detailOfEmployee } = storeToRefs(store);
</script>

<style scoped lang="scss">
.title {
    font-weight: bold;
}

table tbody tr td {
    padding: 10px 0;
}
</style>
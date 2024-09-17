<template>
    <div class="basic-info-wrapper">
        <div class="text-end">
            <v-btn variant="outlined" color="primary" @click.prevent="showForm = true">
                {{ $t('addFamily') }}
            </v-btn>
        </div>

        <v-table>
            <thead>
                <tr>
                    <th>{{ $t('name') }}</th>
                    <th>{{ $t('relationship') }}</th>
                    <th>{{ $t('dateOfBirth') }}</th>
                    <th>{{ $t('idNumber') }}</th>
                    <th>{{ $t('gender') }}</th>
                    <th>{{ $t('job') }}</th>
                    <th>{{ $t('action') }}</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!listOfFamilies.length">
                    <tr v-if="!listOfFamilies.length">
                        <td colspan="7" class="text-center">
                            <v-empty-state
                                :title="t('noDataToDispay')"
                                :text="t('familyDataWillDisplayHere')"
                                image="/paper.png"
                                ></v-empty-state>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr v-for="(family,x) in listOfFamilies"
                        :key="x">
                        <td>{{ family.name }}</td>
                        <td>{{ family.relation }}</td>
                        <td>{{ family.date_of_birth }}</td>
                        <td>{{ family.id_number }}</td>
                        <td>{{ family.gender }}</td>
                        <td>{{ family.job || '-' }}</td>
                        <td>
                            <v-btn
                                :icon="mdiPencilOutline"
                                density="compact"
                                @click.prevent="editData(family)"
                                color="grey-lighten-2"></v-btn>
                            <v-btn
                                :icon="mdiTrashCanOutline"
                                density="compact"
                                class="ms-3"
                                @click.prevent="deleteData(family)"
                                color="grey-lighten-2"></v-btn>
                        </td>
                    </tr>
                </template>

            </tbody>
        </v-table>

        <FamilyForm :is-show="showForm" @close-event="closeForm"
            :family-data="editFamily" />

        <confirmation-modal
            :title="t('deleteFamily')"
            :text="t('deleteFamilyConfirmation')"
            :show-confirm="showCofirmDelete"
            :delete-ids="deleteIds"
            @actionBulkSubmit="doDeleteData"></confirmation-modal>
    </div>
</template>

<style lang="scss" scoped>
.basic-info-wrapper {
    padding: 0 16px;
}
</style>

<script setup>
import { useI18n } from 'vue-i18n';
import FamilyForm from './FamilyForm.vue';
import { ref } from 'vue';
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js';

const { t } = useI18n()

const store = useEmployeesStore()

const { listOfFamilies } = storeToRefs(store)

const editFamily = ref(null)

const showForm = ref(false)

const route = useRoute()

const showCofirmDelete = ref(false)

const deleteIds = ref([])

function closeForm(isRefresh = false) {
    showForm.value = false

    if (isRefresh) {
        store.initFamily(route.params.id)
    }

    editFamily.value = null
}

function editData(family) {
    showForm.value = true

    editFamily.value = family
}

function deleteData(family) {
    deleteIds.value = [{ids: family.uid}]

    showCofirmDelete.value = true
}

async function doDeleteData(ids) {
    await store.deleteFamily(ids[0].ids)

    store.initFamily(route.params.id)

    showCofirmDelete.value = false
}
</script>
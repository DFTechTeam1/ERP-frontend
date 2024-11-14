<template>
    <div>
        <p class="detail-employee-title">
            {{ $t('education') }}
        </p>

        <div class="basic-info-wrapper">
            <div class="text-end">
                <v-btn variant="outlined" color="primary" @click.prevent="showForm = true">
                    {{ $t('addEmergencyContact') }}
                </v-btn>
            </div>
    
            <v-table>
                <thead>
                    <tr>
                        <th>{{ $t('name') }}</th>
                        <th>{{ $t('phone') }}</th>
                        <th>{{ $t('relationship') }}</th>
                        <th>{{ $t('action') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!listOfEmergencyContact.length">
                        <tr>
                            <td colspan="4" class="text-center">
                                <v-empty-state
                                    :title="t('noDataToDispay')"
                                    :text="t('familyDataWillDisplayHere')"
                                    image="/paper.png"
                                    ></v-empty-state>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="(family,x) in listOfEmergencyContact"
                            :key="x">
                            <td>{{ family.name }}</td>
                            <td>{{ family.phone }}</td>
                            <td>{{ family.relation }}</td>
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
    
            <EducationForm :is-show="showForm" @close-event="closeForm"
                :emergency-data="editEmergency" />
    
            <confirmation-modal
                :title="t('deleteEmergency')"
                :text="t('deleteEmergencyConfirmation')"
                :show-confirm="showCofirmDelete"
                :delete-ids="deleteIds"
                @actionBulkSubmit="doDeleteData"></confirmation-modal>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.basic-info-wrapper {
    padding: 0 16px;
}
</style>

<script setup>
import { useI18n } from 'vue-i18n';
import EducationForm from './EducationForm.vue';
import { ref } from 'vue';
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js';

const { t } = useI18n()

const store = useEmployeesStore()

const { listOfEmergencyContact } = storeToRefs(store)

const editEmergency = ref(null)

const showForm = ref(false)

const route = useRoute()

const showCofirmDelete = ref(false)

const deleteIds = ref([])

function closeForm(isRefresh = false) {
    showForm.value = false

    if (isRefresh) {
        store.initEmergency(route.params.id)
    }

    editEmergency.value = null
}

function editData(family) {
    showForm.value = true

    editEmergency.value = family
}

function deleteData(family) {
    deleteIds.value = [{ids: family.uid}]

    showCofirmDelete.value = true
}

async function doDeleteData(ids) {
    await store.deleteEmergency(ids[0].ids)

    store.initEmergency(route.params.id)

    showCofirmDelete.value = false
}
</script>

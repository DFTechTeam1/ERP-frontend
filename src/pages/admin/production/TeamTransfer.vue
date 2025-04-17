<template>
    <div>
        <breadcrumb-data :title="$t('teamTransfer')" :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items="listOfTransferTeam"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="false"
            :showClearFilter="showClearFilter"
            :fullCustomBody="true"
            :hasCheckbox="false"
            :hasFilter="false"
            :btnAddText="$t('requestOtherTeamMember')"
            :filter-tooltip="t('filter')"
            @add-data-event="showForm"
            @table-event="initTeamTransfers"
            @filter-action="showFilter"
            @clear-filter-action="clearFilter">

            <template v-slot:bodytable="{ value }">
                <tr :class="{'bg-red-lighten-5': !value.employee}">
                    <td class="text-center">
                        <template v-if="!value.employee">
                            <v-chip
                                color="warning"
                                density="compact"
                                >
                                {{ $t('needToChooseMember') }}
                            </v-chip>
                        </template>
                        <template v-else>
                            <div v-if="!value.alternative" class="text-center">
                                <p class="m-0 p-0">{{ value.employee.name }}</p>
                                <p class="m-0 p-0" style="font-weight: normal; font-size: 12px;">{{ value.employee.email }}</p>
                            </div>
                            <div v-else class="text-center">
                                <p class="m-0 p-0 text-red">{{ value.employee.name }}</p>
                                <v-icon
                                    :icon="mdiSwapVertical"></v-icon>
                                <p class="m-0 p-0">{{ value.alternative.name }}</p>
                            </div>
                        </template>
                    </td>
                    <td>
                        <p>{{ value.requestTo.name }}</p>
                    </td>
                    <td>{{ value.requestBy.name }}</td>
                    <td>{{ value.project }}</td>
                    <td>{{ value.reason }}</td>
                    <td>
                        <v-chip :color="value.status_color">
                            {{ value.status }}
                        </v-chip>
                    </td>
                    <td>
                        <v-menu
                            open-on-click>
                            <template v-slot:activator="{ props }">
                            <v-icon
                                v-bind="props"
                                :icon="mdiCogOutline"
                                color="blue"></v-icon>
                            </template>

                            <v-list>
                                <!-- <v-list-item
                                    class="pointer">
                                    <template v-slot:title>
                                        <router-link
                                            :to="'/admin/production/project/' + value.uid"
                                            style="color: #000; font-weight: bold;">
                                            <div
                                                class="d-flex align-center"
                                                style="gap: 8px; font-size: 12px;">
                                                <v-icon
                                                :icon="mdiEyeCircle"
                                                size="15"></v-icon>
                                                {{ $t('detail') }}
                                            </div>
                                        </router-link>
                                    </template>
                                </v-list-item> -->
                                <v-list-item
                                    class="pointer"
                                    v-if="value.have_cancel_action && !value.have_action && !value.is_approved"
                                    @click.prevent="cancelRequest(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiCloseOutline"
                                            size="15"></v-icon>
                                            {{ $t('cancel') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="value.have_cancel_action && !value.have_action && value.is_approved"
                                    @click.prevent="completeRequest(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiCheckOutline"
                                            size="15"></v-icon>
                                            {{ $t('completeTransfer') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="value.have_approve_action && !value.have_action && !value.is_approved && value.employee"
                                    @click.prevent="approveRequest(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiCheckOutline"
                                            size="15"></v-icon>
                                            {{ $t('approve') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    v-if="value.have_approve_action && !value.have_action && !value.is_approved && value.employee"
                                    class="pointer"
                                    @click.prevent="rejectProject(value)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiCloseOutline"
                                            size="15"></v-icon>
                                            {{ $t('reject') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    v-if="value.have_approve_action && !value.have_action && !value.is_approved && !value.employee"
                                    class="pointer"
                                    @click.prevent="chooseTeam(value)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiAccount"
                                            size="15"></v-icon>
                                            {{ $t('chooseTeam') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="!value.is_approved"
                                    @click.prevent="deleteTransfer(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiTrashCanOutline"
                                            size="15"></v-icon>
                                            {{ $t('delete') }}
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>

        </table-list>

        <request-team-form
            :is-show="showFormRequest"
            @close-event="closeFormRequest"></request-team-form>

        <confirmation-modal
            :title="$t('deleteRequestTeam')"
            :text="$t('deleteRequestTeamConfirmation')"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            :loading="loading"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>

        <confirmation-modal
            :title="$t('approveRequestTeam')"
            :text="$t('approveRequestTeamConfirmation')"
            :showConfirm="showApproveConfirm"
            :deleteIds="selectedIds"
            :loading="loading"
            @action-bulk-submit="doBulkApprove"></confirmation-modal>

        <confirmation-modal
            :title="$t('cancelRequestTeam')"
            :text="$t('cancelRequestTeamConfirmation')"
            :showConfirm="showConfirmationCancel"
            :deleteIds="selectedIds"
            :loading="loading"
            @action-bulk-submit="doBulkCancel"></confirmation-modal>

        <confirmation-modal
            :title="$t('completeRequestTeam')"
            :text="$t('completeRequestTeamConfirmation')"
            :showConfirm="showConfirmationComplete"
            :deleteIds="selectedIds"
            :loading="loading"
            @action-bulk-submit="doCompleteRequest"></confirmation-modal>

        <reject-form
            :is-show="showRejectForm"
            :transfer-uid="selectedRejectUid"
            :current-employee-uid="selectedRejectEmployeeUid"
            @close-event="closeRejectForm"></reject-form>

        <filter-form
            :is-show="showFilterForm"
            @close-event="closeFilter"></filter-form>

        <choose-team-form
            :transfer-uid="chooseTeamTransferUid"
            :is-show="showChooseTeamForm"
            @close-event="closeChooseTeam"></choose-team-form>
    </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/project'
import { mdiCheckOutline, mdiCloseOutline, mdiCogOutline, mdiEyeCircle, mdiTrashCanOutline, mdiSwapVertical, mdiAccount } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RequestTeamForm from './RequestTeam.vue'
import RejectForm from './RejectTeamTransfer.vue'
import FilterForm from './FilterTeamTransfer.vue'
import ChooseTeamForm from './teamTransfer/ChooseTeam.vue'

const { t } = useI18n()

const store = useProjectStore()

const { totalOfTransferTeam, listOfTransferTeam } = storeToRefs(store)

const breadcrumbs = ref([
    {
        title: t('teamTransfer'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
])

const loading = ref(false)

const showChooseTeamForm = ref(false)

const chooseTeamTransferUid = ref('')

const showRejectForm = ref(false)

const showFilterForm = ref(false)

const selectedRejectUid = ref(null)

const selectedRejectEmployeeUid = ref(null)

const showFormRequest = ref(false)

const showConfirmationCancel = ref(false)

const showConfirmationComplete = ref(false)

const showApproveConfirm = ref(false)

const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: t('itendedPic'),
        key: 'requestTo.name',
        align: 'start',
        sortable: true
    },
    {
        title: t('picSubmit'),
        key: 'requestBy.name',
        align: 'start',
        sortable: true
    },
    {
        title: t('project'),
        key: 'project',
        align: 'start',
        sortable: true
    },
    {
        title: t('reason'),
        key: 'reason',
        align: 'start',
        sortable: true
    },
    {
        title: t('status'),
        key: 'status',
        align: 'start',
        sortable: true
    },
    {
        title: t('action'),
        key: 'uid',
        align: 'start',
        sortable: true
    },
]);

const totalItems = ref(0)

const itemsPerPage = ref(10)

const showClearFilter = ref(false)

const showConfirmation = ref(false)

const selectedIds = ref([])

function deleteTransfer(payload) {
    showConfirmation.value = true;
    selectedIds.value = [payload]
}

function cancelRequest(uid) {
    showConfirmationCancel.value = true
    selectedIds.value = [uid]
}

function approveRequest(uid) {
    showApproveConfirm.value = true
    selectedIds.value = [uid]
}

function showForm() {
    showFormRequest.value = true
}

function showFilter() {
    showFilterForm.value = true
}

function clearFilter() {

}

function closeFilter() {
    showFilterForm.value = false
}

function closeFormRequest(isRefresh = false) {
    showFormRequest.value = false

    if (isRefresh) {
        initTeamTransfers()
    }
}

async function initTeamTransfers(payload = '') {
    loading.value = true;
    await store.getTransferTeams(payload);
    loading.value = false;

    console.log('totalOfTransferTeam', totalOfTransferTeam.value)
    totalItems.value = totalOfTransferTeam.value;
}

async function doBulkDelete(payload) {
  loading.value = true;
  let deleteData = await store.deleteRequestTeam(payload[0]);
  loading.value = false;

  if ((deleteData.status != undefined) && (deleteData.status < 300)) {
      showConfirmation.value = false;
      selectedIds.value = [];
      initTeamTransfers();
  }
}

async function doBulkCancel(payload) {
  loading.value = true;
  let deleteData = await store.bulkCancelRequestTeam(payload);
  loading.value = false;

  if ((deleteData.status != undefined) && (deleteData.status < 300)) {
      showConfirmationCancel.value = false;
      selectedIds.value = [];
      initTeamTransfers();
  }
}

async function doBulkApprove(payload) {
  loading.value = true;
  let approveData = await store.approveRequestTeam(payload[0]);
  loading.value = false;

  if ((approveData.status != undefined) && (approveData.status < 300)) {
      showApproveConfirm.value = false;
      selectedIds.value = [];
      initTeamTransfers();
  }
}

function completeRequest(uid) {
    showConfirmationComplete.value = true
    selectedIds.value = [uid]
}

function rejectProject(list) {
    selectedRejectUid.value = list.uid
    selectedRejectEmployeeUid.value = list.employee.uid
    showRejectForm.value = true
}

function closeRejectForm(isRefresh = false) {
    selectedRejectUid.value = null
    showRejectForm.value = false

    if (isRefresh) {
        initTeamTransfers()
    }
}

async function doCompleteRequest(payload) {
  loading.value = true;
  const resp = await store.completeRequestTeam(payload[0])
  loading.value = false;

  if (resp.status < 300) {
      showConfirmationComplete.value = false
      selectedIds.value = []
      initTeamTransfers()
  }
}

function chooseTeam(detailRequest) {
    showChooseTeamForm.value = true
    chooseTeamTransferUid.value = detailRequest.uid
}

function closeChooseTeam(isRefresh) {
    showChooseTeamForm.value = false

    if (isRefresh) {
      initTeamTransfers()
    }
}
</script>

<template>
    <div>
        <breadcrumb-data
            :title="$t('project')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items="listOfProjects"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="false"
            :showClearFilter="showClearFilter"
            :fullCustomBody="true"
            :custom-filter-button="true"
            :hasCheckbox="false"
            :btnAddText="$t('createProject')"
            :allowed-create-button="useCheckPermission('create_project')"
            :filter-tooltip="t('filterProject')"
            :show-filter-result="false"
            @bulk-delete-event="bulkDelete"
            @add-data-event="showForm"
            @table-event="initProjects"
            @filter-action="showFilter"
            @clear-filter-action="clearFilter">

            <template v-slot:custom-filter-button>
              <v-btn
                variant="outlined"
                :color="thisMonthFilterColor"
                density="compact"
                @click.prevent="filterButton('month')">
                <v-icon
                  v-if="thisMonthFilterActive"
                  :icon="mdiCheckCircle"
                  size="15"
                  class="me-2"
                  color="success"></v-icon>
                {{ $t('thisMonth') }}
              </v-btn>

              <v-btn
                variant="outlined"
                :color="todayFilterColor"
                density="compact"
                @click.prevent="filterButton('today')">
                <v-icon
                  v-if="todayFilterActive"
                  :icon="mdiCheckCircle"
                  size="15"
                  class="me-2"
                  color="success"></v-icon>
                {{ $t('today') }}
              </v-btn>

              <v-btn
                variant="outlined"
                :color="allFilterColor"
                density="compact"
                @click.prevent="filterButton('all')">
                <v-icon
                  v-if="allFilterActive"
                  :icon="mdiCheckCircle"
                  size="15"
                  class="me-2"
                  color="success"></v-icon>
                {{ $t('all') }}
              </v-btn>
            </template>

            <template v-slot:filter-result>
                <v-chip density="compact" color="purple-darken-3"
                    :append-icon="mdiClose">
                    filter result
                </v-chip>
            </template>

            <template v-slot:bodytable="{ value }">
                <tr>
                    <td>
                        <router-link
                            :to="'/admin/production/project/' + value.uid"
                            style="color: #000; font-weight: bold;">{{ value.name }}</router-link>
                    </td>
                    <td>
                        <p class="fw-bold">{{ value.project_date }}</p>
                    </td>
                    <td>{{ value.venue }}</td>
                    <td>
                        <template v-if="value.no_pic">
                            <v-chip
                                density="compact"
                                color="grey-lighten-1">
                                {{ value.pic }}
                            </v-chip>
                        </template>
                        <template v-else>
                            {{ value.pic }}
                        </template>
                    </td>
                    <td>{{ value.event_type }}</td>
                    <td>
                        <v-chip :color="value.status_color">
                            {{ value.status }}
                        </v-chip>
                    </td>
                    <td>
                        <p class="fw-bold">{{ value.led_area }} m<sup>2</sup></p>
                    </td>
                    <td>
                        <v-chip
                            :color="value.event_class_color">
                            {{ value.event_class }}
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
                                    class="pointer"
                                    @click.prevent="editEmployee(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiPencil"
                                            size="15"></v-icon>
                                            {{ $t('edit') }}
                                        </div>
                                    </template>
                                </v-list-item> -->
                                <v-list-item
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
                                </v-list-item>
                                <!-- <v-list-item
                                    class="pointer"
                                    @click.prevent="addAsUser(value.uid)"
                                    v-if="!value.user">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiAccountPlus"
                                            size="15"></v-icon>
                                            {{ $t('addAsUser') }}
                                        </div>
                                    </template>
                                </v-list-item> -->
                                <v-list-item
                                    class="pointer"
                                    v-if="useCheckPermission('delete_project')"
                                    @click.prevent="deleteProject(value.uid)">
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
                                <v-list-item
                                    class="pointer"
                                    v-if="useCheckPermission('change_project_status') && !value.project_is_complete"
                                    @click.prevent="changeStatus(value, value.status_raw)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiTransfer"
                                            size="15"></v-icon>
                                            {{ $t('changeStatus') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="value.project_is_complete && value.need_return_equipment"
                                    @click.prevent="returnEquipment(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiTransfer"
                                            size="15"></v-icon>
                                            {{ $t('returnEquipment') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="useCheckPermission('assign_vj') && !value.project_is_complete && !value.have_vj && !value.no_pic"
                                    @click.prevent="assignVJ(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiDisc"
                                            size="15"></v-icon>
                                            {{ $t('assignVJ') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="useCheckPermission('assign_vj') && !value.project_is_complete && value.have_vj && !value.no_pic"
                                    @click.prevent="removeAllVJ(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiTrashCan"
                                            size="15"></v-icon>
                                            {{ $t('removeAllVj') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="!value.is_final_check && !value.no_pic && useCheckPermission('final_check')"
                                    @click.prevent="showFinalCheck(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiCheckOutline"
                                            size="15"></v-icon>
                                            {{ $t('finalCheck') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="value.no_pic"
                                    @click.prevent="showScheduler(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiPencilCircleOutline"
                                            size="15"></v-icon>
                                            {{ $t('assignPic') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    v-if="!value.no_pic && useCheckPermission('assign_pic')"
                                    @click.prevent="showSubtitute(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiSwapHorizontal"
                                            size="15"></v-icon>
                                            {{ $t('subtitutePic') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <!-- <v-list-item
                                    class="pointer"
                                    v-if="useCheckPermission('assign_vj') && !value.project_is_complete && value.have_vj"
                                    @click.prevent="assignVJ(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiTransfer"
                                            size="15"></v-icon>
                                            {{ $t('changeVJ') }}
                                        </div>
                                    </template>
                                </v-list-item> -->
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>

        </table-list>

        <confirmation-modal
            :title="titleConfirmationDelete"
            :text="textConfirmationDelete"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>

        <filter-project
            :show="isShowFilter"
            @filter-event="doFilter"
            @close-event="cancelFilter"></filter-project>

        <status-form
            :is-show="isChangeStatusConfirm"
            :base-status="projectCurrentStatus"
            :uid="projectToChangeStatus"
            :project="projectDetail"
            @close-event="closeChangeStatus"></status-form>

        <AssignVJ :project-uid="selectedProjectForVJ" :is-show="showVJForm" @close-event="closeVjForm"></AssignVJ>

        <final-check :is-show="showFinalCheckForm" @close-event="closeFinalCheck" :project-uid="projectUidFinalCheck"></final-check>

        <return-equipment-form :is-show="showReturnEquipmentForm"
            :project-uid="projectUidReturnEquipment"
            @close-event="closeReturnEquipment"></return-equipment-form>

        <FinderManager :is-show="showFinderManager"
            @close-event="closeFinderManager"
            :project-uid="projectUidFinderManager" />

        <SubtitutePic :is-show="showSubtitutePic"
            @close-event="closeSubtitutePic"
            :project-uid="projectUidSubtitutePic"></SubtitutePic>
    </div>
</template>

<style scoped lang="scss">
.email {
    font-size: 11px;
}
</style>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import FinderManager from './FinderManager.vue'
import SubtitutePic from './SubtitutePic.vue'

import {
  mdiClose,
  mdiCheckOutline,
  mdiCogOutline,
  mdiDisc,
  mdiEyeCircle,
  mdiTransfer,
  mdiTrashCan,
  mdiTrashCanOutline,
  mdiPencilCircleOutline,
  mdiSwapHorizontal, mdiCheckCircle
} from '@mdi/js';
import FilterProject from './FilterProject.vue';
import StatusForm from './ChangeStatusForm.vue'
import AssignVJ from './AssignVJ.vue';
import { useCheckPermission } from '@/compose/checkPermission'
import FinalCheck from './FinalCheck.vue'
import ReturnEquipmentForm from './ReturnEquipment.vue'
import TableList from "@/components/TableList.vue";

const { t } = useI18n();

const router = useRouter();

const store = useProjectStore();

const filterProjectItem = ref(null)

const showFinderManager = ref(false)

const showSubtitutePic = ref(false)

const projectUidFinderManager = ref(null)

const projectUidSubtitutePic = ref(null)

const {
    listOfProjects,
    totalOfProjects,
 } = storeToRefs(store);

const titleConfirmationDelete = ref(t('deleteProject'))
const textConfirmationDelete = ref(t('deleteProjectConfirmation'))
const showConfirmation = ref(false);
const confirmFunction = ref('delete')
const isChangeStatusConfirm = ref(false)
const projectToChangeStatus = ref(null)
const projectDetail = ref(null)
const projectCurrentStatus = ref(null)
const selectedIds = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const loading = ref(true);
const thisMonthFilterActive = ref(true)
const todayFilterColor = ref('grey-lighten-2')
const thisMonthFilterColor = ref('blue-lighten-2')
const allFilterColor = ref('grey-lighten-2')
const todayFilterActive = ref(false)
const allFilterActive = ref(false)
const showClearFilter = ref(false);
const showReturnEquipmentForm = ref(false)
const projectUidReturnEquipment = ref(null)
const isShowFilter = ref(false);
const searchParam = ref(null)
const selectedProjectForVJ = ref(null)
const showVJForm = ref(false)
const showFinalCheckForm = ref(false)
const projectUidFinalCheck = ref(null)
const breadcrumbs = ref([
    {
        title: t('project'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);
const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: t('date'),
        key: 'project_date',
        align: 'start',
        sortable: true
    },
    {
        title: t('venue'),
        key: 'venue',
        align: 'start',
        sortable: true
    },
    {
        title: t('pic'),
        key: 'pic',
        align: 'start',
        sortable: true
    },
    {
        title: t('eventType'),
        key: 'event_type',
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
        title: t('ledArea'),
        key: 'led_area',
        align: 'start',
        sortable: true
    },
    {
        title: t('eventClass'),
        key: 'classification',
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

function filterButton(type) {
  if (type === 'month') {
    thisMonthFilterActive.value = !thisMonthFilterActive.value

    thisMonthFilterColor.value = 'blue-lighten-2'
    todayFilterColor.value = 'grey-lighten-2'
    allFilterColor.value = 'grey-lighten-2'

    todayFilterActive.value = false
    allFilterActive.value = false
  } else if (type === 'today') {
    todayFilterActive.value = !todayFilterActive.value

    thisMonthFilterColor.value = 'grey-lighten-2'
    todayFilterColor.value = 'blue-lighten-2'
    allFilterColor.value = 'grey-lighten-2'

    thisMonthFilterActive.value = false
    allFilterActive.value = false
  } else {
    todayFilterActive.value = false
    thisMonthFilterActive.value = false
    allFilterActive.value = !allFilterActive.value

    thisMonthFilterColor.value = 'grey-lighten-2'
    todayFilterColor.value = 'grey-lighten-2'
    allFilterColor.value = 'blue-lighten-2'
  }

  initProjects()
}

function showScheduler(projectUid) {
    projectUidFinderManager.value = projectUid
    showFinderManager.value = true
}

function showSubtitute(projectUid) {
    projectUidSubtitutePic.value = projectUid
    showSubtitutePic.value = true
}

function returnEquipment(projectUid) {
    showReturnEquipmentForm.value = true

    projectUidReturnEquipment.value = projectUid
}

function showForm() {
    router.push({path: '/admin/production/project/create'});
}

function assignVJ(uid) {
    showVJForm.value = true

    selectedProjectForVJ.value = uid
}

function removeAllVJ(projectUid) {
    showConfirmation.value = true;
    selectedIds.value = [projectUid]

    textConfirmationDelete.value = t('rmeoveVjConfirmation')
    titleConfirmationDelete.value = t('removeVjTitle')

    confirmFunction.value = 'vj'
}

function closeFinalCheck(isRefresh = false) {
    showFinalCheckForm.value = false

    if (isRefresh) {
        initProjects()
    }
}

function showFinalCheck(uid) {
    projectUidFinalCheck.value = uid

    showFinalCheckForm.value = true
}

function deleteProject(uid) {
    bulkDelete({value: [{uid: uid}]});
}

async function doBulkDelete(payload) {
    let deleteData
    if (confirmFunction.value == 'delete') {
        deleteData = await store.bulkDelete(payload.value);
    } else if (confirmFunction.value == 'vj') {
        deleteData = await store.removeVJ(payload[0])
    }

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initProjects();
    }
}

async function initProjects(payload = '') {
    if (payload === '') {
      payload = {page: 1, itemsPerPage: 10}
    }

    if (payload === '' && searchParam.value !== '') {
        payload = {filter: searchParam.value}
    } else if (payload !== '' && searchParam.value !== '') {
      payload.filter = searchParam.value;
    }

    payload.filter_month = thisMonthFilterActive.value
    payload.filter_today = todayFilterActive.value

    loading.value = true;
    await store.initProjects(payload);
    loading.value = false;
    totalItems.value = totalOfProjects.value;
}

function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload

    confirmFunction.value = 'delete'
}

function closeVjForm(payload) {
    showVJForm.value = false

    if (payload) {
        initProjects()
    }
}

function showFilter() {
    isShowFilter.value = true;
}

function clearFilter() {
    searchParam.value = '';
    thisMonthFilterActive.value = true
    todayFilterActive.value = false
    allFilterActive.value = false

    thisMonthFilterColor.value = 'blue-lighten-2'
    todayFilterColor.value = 'grey-lighten-2'
    allFilterColor.value = 'grey-lighten-2'

    initProjects();
    showClearFilter.value = false;
}

function doFilter(payload) {
    searchParam.value = payload;
    thisMonthFilterActive.value = false
    todayFilterActive.value = false
    allFilterActive.value = false

    thisMonthFilterColor.value = 'grey-lighten-2'
    todayFilterColor.value = 'grey-lighten-2'
    allFilterColor.value = 'grey-lighten-2'

    initProjects();
    isShowFilter.value = false;
    showClearFilter.value = true;
}

function cancelFilter() {
    searchParam.value = null;
    isShowFilter.value = false;
    showClearFilter.value = false;
}

function changeStatus(project, currentStatus) {
    isChangeStatusConfirm.value = true
    projectToChangeStatus.value = project.uid
    projectCurrentStatus.value = currentStatus
    projectDetail.value = project
}

function closeChangeStatus(isRefresh = false) {
    isChangeStatusConfirm.value = false
    projectToChangeStatus.value = null
    projectCurrentStatus.value = null

    if (isRefresh) {
        initProjects()
    }
}

function closeReturnEquipment(isRefresh = false) {
    showReturnEquipmentForm.value = false

    if (isRefresh) {
        initProjects()
    }
}

function closeSubtitutePic(isRefresh = false) {
    showSubtitutePic.value = false
    projectUidSubtitutePic.value = null

    if (isRefresh) {
        initProjects()
    }
}

function closeFinderManager(isRefresh = false) {
    showFinderManager.value = false
    projectUidFinderManager.value = null

    if (isRefresh) {
        initProjects()
    }
}

onMounted(() => {

})
</script>

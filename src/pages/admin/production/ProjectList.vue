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
            :hasCheckbox="false"
            :btnAddText="$t('createProject')"
            :filter-tooltip="t('filterProject')"
            @bulk-delete-event="bulkDelete"
            @add-data-event="showForm"
            @table-event="initProjects"
            @filter-action="showFilter"
            @clear-filter-action="clearFilter">

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
                    <td>{{ value.marketing }}</td>
                    <td>{{ value.venue }}</td>
                    <td>{{ value.pic }}</td>
                    <td>{{ value.event_type }}</td>
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
                                <v-list-item
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
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    @click.prevent="detailInventory(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiEyeCircle"
                                            size="15"></v-icon>
                                            {{ $t('detail') }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-list-item
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
                                </v-list-item>
                                <v-list-item
                                    class="pointer"
                                    @click.prevent="deleteEmployee(value.uid)">
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

        <confirmation-modal
            :title="$t('deleteEmployee')"
            :text="$t('deleteEmployeeConfirmation')"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>

        <confirmation-modal
            :title="$t('addAsUser')"
            :text="$t('addAsUserConfirmation')"
            :showConfirm="showConfirmationAddtoUser"
            :deleteIds="selectedAddUserId"
            @action-bulk-submit="doAddUser"></confirmation-modal>

        <filter-employee 
            :show="isShowFilter"
            @filter-event="doFilter"
            @close-event="cancelFilter"></filter-employee>
    </div>
</template>

<style scoped lang="scss">
.email {
    font-size: 11px;
}
</style>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { 
    mdiCogOutline, 
    mdiEyeCircle, 
    mdiPencil, 
    mdiTrashCanOutline,
    mdiAccountPlus
 } from '@mdi/js';
import FilterEmployee from './FilterProject.vue';

const { t } = useI18n();

const router = useRouter();

const store = useProjectStore();

const { 
    listOfProjects,
    totalOfProjects,
 } = storeToRefs(store);

const showConfirmation = ref(false);
const showConfirmationAddtoUser = ref(false);
const selectedIds = ref([]);
const selectedAddUserId = ref(null);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const loading = ref(true);
const showClearFilter = ref(false);
const isShowFilter = ref(false);
const searchParam = ref(null);
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
        title: t('marketing'),
        key: 'marketing',
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

function showForm() {
    router.push({path: '/admin/production/project/create'});
}

function deleteEmployee(uid) {
    bulkDelete({value: [{uid: uid}]});
}

async function doAddUser(payload) {
    console.log('payload add user', payload);

    await store.addToUser(payload);
    showConfirmationAddtoUser.value = false;
}

async function doBulkDelete(payload) {
    let deleteData = await store.bulkDelete(payload.value);

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initProjects();
    }
}

async function initProjects(payload = '') {
    if (payload == '' && searchParam.value != '') {
        payload = {filter: searchParam.value}
    } else if (payload != '' && searchParam.value != '') {
        payload.filter = searchParam.value;
    }

    loading.value = true;
    await store.initProjects(payload);
    loading.value = false;
    totalItems.value = totalOfProjects.value;
}

function addAsUser(id) {
    showConfirmationAddtoUser.value = true;
    selectedAddUserId.value = {user_id: id};
}

function editEmployee(uid) {
    router.push({path: '/admin/employees/edit/' + uid});
}

function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload
}

function showFilter() {
    isShowFilter.value = true;
}

function clearFilter() {
    searchParam.value = '';
    initProjects();
    showClearFilter.value = false;
}

function doFilter(payload) {
    searchParam.value = payload;
    initProjects();
    isShowFilter.value = false;
    showClearFilter.value = true;
}

function cancelFilter() {
    searchParam.value = null;
    isShowFilter.value = false;
    showClearFilter.value = false;
}
</script>
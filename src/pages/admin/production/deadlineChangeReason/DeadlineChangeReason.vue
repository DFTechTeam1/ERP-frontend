<script setup>
import FormView from './FormView.vue';
import { mdiCogOutline, mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { showNotification } from '@/compose/notification';
import { useCheckPermission } from '@/compose/checkPermission';
import { useDeadlineChangeReasonStore } from '@/stores/deadlineChangeReason';

const { t } = useI18n();

const store = useDeadlineChangeReasonStore();

const {
    totalOfDeadlineChangeReasons,
    lisfOfDeadlineChangeReasons
} = storeToRefs(store);

const breadcrumbs = ref([
    {
        title: t('deadlineChangeReason'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

const itemsPerPage = ref(10);
const totalItems = ref(0);

const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: false,
        minWidth: '150px'
    },
    {
        title: t('action'),
        key: 'uid',
        align: 'end',
        sortable: false,
        width: '50px'
    },
]);

const loading = ref(false);

const showForm = ref(false);

const selectedItem = ref({});

const canCreateDeal = useCheckPermission('create_quotation_item');

const showConfirmation = ref(false);

const selectedIds = ref([]);

const createDeal = () => {
    showForm.value = true;
};

const closeForm = (isUpdate) => {
    selectedItem.value = {};

    if (isUpdate) {
        initDeadlineChangeReason();
    }

    showForm.value = false;
}

const editReason = (uid) => {
    selectedItem.value = lisfOfDeadlineChangeReasons.value.find(item => item.id === uid);
    showForm.value = true;
};

const confirmDeleteData = (uid) => {
    showConfirmation.value = true;
    selectedIds.value = [uid];
};

const initDeadlineChangeReason = async(payload = '') => {
    if (payload === '') {
        payload = {page: 1, itemsPerPage: 10}
    }

    store.setReasonParam({
        page: payload.page,
        itemsPerPage: payload.itemsPerPage,
        sortBy: payload.sortBy,
    });

    loading.value = true;
    const resp = await store.initDeadlineChangeReason();
    loading.value = false;

    totalItems.value = totalOfDeadlineChangeReasons.value;
    itemsPerPage.value = parseInt(payload.itemsPerPage || 10);
};

const deleteReason = async (uid) => {
    loading.value = true;
    const resp = await store.deleteReason(uid);
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        initDeadlineChangeReason();

        showConfirmation.value = false;
    } else {
        showNotification(resp.response.data.message, 'error');
    }
};
</script>

<template>
    <div>
        <breadcrumb-data
            :title="$t('deadlineChangeReason')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :is-sticky-action="true"
            :headers="headers"
            :items-per-page="itemsPerPage"
            :total-items="totalOfDeadlineChangeReasons"
            :loading="loading"
            :has-checkbox="false"
            :has-filter="false"
            :items="lisfOfDeadlineChangeReasons"
            :custom-status="true"
            :allowed-create-button="canCreateDeal"
            @table-event="initDeadlineChangeReason"
            @add-data-event="createDeal">

            <template v-slot:action="{ value, items }">
                <v-menu open-on-click>
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props"
                            :icon="mdiCogOutline"
                            color="blue"></v-icon>
                    </template>

                    <v-list>
                        <v-list-item class="pointer"
                            @click.prevent="editReason(value.id)"
                            v-if="value.can_edit">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiPencilOutline"
                                        size="13"></v-icon>
                                    <span>{{ t('edit') }}</span>
                                </div>
                            </template>
                        </v-list-item>

                        <v-list-item class="pointer"
                            @click.prevent="confirmDeleteData(value.id)"
                            v-if="value.can_delete">
                            <template v-slot:title>
                                <div class="d-flex align-center"
                                    style="gap: 8px; font-size: 12px;">
                                    <v-icon
                                        :icon="mdiTrashCanOutline"
                                        size="13"></v-icon>
                                    <span>{{ t('delete') }}</span>
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </table-list>

        <form-view
            :is-show="showForm"
            @close-event="closeForm"
            :selected-item="selectedItem"></form-view>

        <confirmation-modal
            :title="t('delete')"
            :text="t('confirmationdeleteReason')"
            :showConfirm="showConfirmation"
            :loading="loading"
            :deleteIds="selectedIds"
            @action-bulk-submit="deleteReason"></confirmation-modal>
    </div>
</template>
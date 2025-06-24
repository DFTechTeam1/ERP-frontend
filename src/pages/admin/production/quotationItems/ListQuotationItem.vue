<script setup>
import FormView from './FormView.vue';
import { mdiCogOutline, mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { showNotification } from '@/compose/notification';
import { useCheckPermission } from '@/compose/checkPermission';
import { useQuotationItemStore } from '@/stores/quotationItem';

const { t } = useI18n();

const store = useQuotationItemStore();

const {
    totalOfQuotationItems,
    listOfQuotationItems
} = storeToRefs(store);

const breadcrumbs = ref([
    {
        title: t('quotationItems'),
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
        initQuotationItems();
    }

    showForm.value = false;
}

const editQuotationItem = (uid) => {
    selectedItem.value = listOfQuotationItems.value.find(item => item.uid === uid);
    showForm.value = true;
};

const confirmDeleteData = (uid) => {
    showConfirmation.value = true;
    selectedIds.value = [uid];
};

const initQuotationItems = async(payload = '') => {
    if (payload === '') {
        payload = {page: 1, itemsPerPage: 10}
    }

    store.setQuotationParam({
        page: payload.page,
        itemsPerPage: payload.itemsPerPage,
        sortBy: payload.sortBy,
    });

    loading.value = true;
    const resp = await store.initQuotationItems();
    loading.value = false;

    totalItems.value = totalOfQuotationItems.value;
    itemsPerPage.value = parseInt(payload.itemsPerPage || 10);
};

const deleteQuotationItem = async (uid) => {
    loading.value = true;
    const resp = await store.deleteQuotationItem(uid);
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        initQuotationItems();

        showConfirmation.value = false;
    } else {
        showNotification(resp.response.data.message, 'error');
    }
};
</script>

<template>
    <div>
        <breadcrumb-data
            :title="$t('quotationItems')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :is-sticky-action="true"
            :headers="headers"
            :items-per-page="itemsPerPage"
            :total-items="totalOfQuotationItems"
            :loading="loading"
            :has-checkbox="false"
            :has-filter="false"
            :items="listOfQuotationItems"
            :custom-status="true"
            :allowed-create-button="canCreateDeal"
            @table-event="initQuotationItems"
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
                            @click.prevent="editQuotationItem(value.uid)"
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
                            @click.prevent="confirmDeleteData(value.uid)"
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
            :text="t('confirmationdeleteQuotationItem')"
            :showConfirm="showConfirmation"
            :loading="loading"
            :deleteIds="selectedIds"
            @action-bulk-submit="deleteQuotationItem"></confirmation-modal>
    </div>
</template>
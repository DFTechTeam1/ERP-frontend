<template>
    <div>
        <breadcrumb-data
            :title="$t('inventoryTypes')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <table-list
            :headers="headers"
            :items="listOfInventoryTypes"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="true"
            :hasAddDropdown="true"
            :btnAddText="$t('createInventoryType')"
            @bulk-delete-event="bulkDelete"
            @add-data-event="showForm"
            @table-event="initInventoryTypes">

            <template v-slot:addDropdown>
                <v-list>
                    <v-list-item class="d-flex align-center ga-3 pointer" @click.prevent="showImportForm = true">
                        <v-icon
                            :icon="mdiImport"
                            size="15"></v-icon>

                        {{ $t('textImport') }}
                    </v-list-item>
                    <v-list-item class="d-flex align-center ga-3 pointer" @click.prevent="showForm">
                        <v-icon
                            :icon="mdiPaperRoll"
                            size="15"></v-icon>

                        {{ $t('manualInput') }}
                    </v-list-item>
                </v-list>
            </template>

            <template v-slot:action="{ value }">
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
                            @click.prevent="editInventoryType(value)">
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
                            @click.prevent="deleteSupplier(value)">
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
            </template>
        </table-list>

        <!-- modal form -->
        <v-dialog
            v-model="isShowForm"
            max-width="600"
            persistent>
            <v-form @submit="validateData">
                <v-card
                    :title="formTitle">
                    <v-card-text>
                        <v-row
                            dense>
                            <v-col
                                cols="12">
                                <v-text-field
                                    variant="outlined"
                                    v-model="name"
                                    v-bind="nameAttrs"
                                    :error-messages=errors.name
                                    :class="{
                                        'mb-3': errors.name
                                    }"
                                    :label="$t('inventoryType')">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            height="auto"
                            size="small"
                            class="btn-secondary pt-3 pb-3 mt-3"
                            @click.prevent="isShowForm = false">
                            <template v-if="isLoading">
                                {{ $t('processing') }}
                            </template>
                            <template v-else>
                                {{ $t('close') }}
                            </template>
                        </v-btn>

                        <v-btn
                            height="auto"
                            type="submit"
                            size="small"
                            class="btn-primary pt-3 pb-3 mt-3">
                            <template v-if="isLoading">
                                {{ $t('processing') }}
                            </template>
                            <template v-else>
                                {{ $t('save') }}
                            </template>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <confirmation-modal
            :title="$t('deleteInventoryType')"
            :text="$t('deleteInventoryTypeConfirmation')"
            :showConfirm="showConfirmation"
            :deleteIds="selectedIds"
            @action-bulk-submit="doBulkDelete"></confirmation-modal>


        <import-excel :is-show="showImportForm" 
            @close-event="closeImportForm"
            @submit-event="importFile"
            download-template-url="/download/template/inventoryType"
            :error-list="errorImport"
            :loading="loadingImport"></import-excel>
    </div>
</template>

<script setup>
import { useInventoryTypeStore } from '@/stores/inventoryType'
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { mdiCogOutline, mdiImport, mdiPaperRoll, mdiPencil, mdiTrashCanOutline } from '@mdi/js';
import { watch } from 'vue';
import * as yup from 'yup'
import { useForm } from 'vee-validate';
import { useError } from '@/compose/handleError'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useInventoryTypeStore();

const itemsPerPage = ref(10);

const totalItems = ref(0);

const showConfirmation = ref(false);

const isShowForm = ref(false);

const loading = ref(true);

const showImportForm = ref(false)

const loadingImport = ref(false)

const errorImport = ref([])

const detailData = ref(null);

const formTitle = ref(t('createBrand'));

const selectedIds = ref([]);

const { 
    listOfInventoryTypes,
    totalOfInventoryTypes,
 } = storeToRefs(store);

const isLoading = ref(false);

const { errors, handleSubmit, defineField, resetForm, setErrors } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
    }),
})

const validateData = handleSubmit(async values => {
    isLoading.value = true;
    values.detailData = detailData.value ? detailData.value.data.data : null;
    const storeResult = await store.storeData(values)
    isLoading.value = false;

    useError(storeResult, setErrors);

    if (storeResult.status < 300) {
        isShowForm.value = false;
        initInventoryTypes();
    }
});

const [name, nameAttrs] = defineField('name');

const headers = ref([
    {
        title: 'Name',
        key: 'name',
        align: 'start',
        width: 30,
        sortable: true
    },
    {
        title: 'Action',
        key: 'uid',
        align: 'start',
        width: '50',
        sortable: false
    },
]);

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('inventoryTypes'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

async function initInventoryTypes(payload) {
    loading.value = true;
    await store.initInventoryTypes(payload);
    loading.value = false;
    totalItems.value = totalOfInventoryTypes.value;
}

async function editInventoryType(uid) {
    formTitle.value = t('editInventoryType');
    detailData.value = await store.detailData({uid: uid});

    if (detailData.value.status < 300) {
        isShowForm.value = true;
        name.value = detailData.value.data.data.name;
    }
}

function deleteSupplier(uid) {
    bulkDelete({value: [{uid: uid}]});
}

function showForm() {
    formTitle.value = t('createInventoryType');
    isShowForm.value = true;
}

function bulkDelete(payload) {
    showConfirmation.value = true;
    selectedIds.value = payload
}

async function doBulkDelete(payload) {
    let deleteData = await store.bulkDelete(payload.value);

    if ((deleteData.status != undefined) && (deleteData.status < 300)) {
        showConfirmation.value = false;
        selectedIds.value = [];
        initInventoryTypes();
    }
}

function closeImportForm() {
    showImportForm.value = false
    errorImport.value = []
}

async function importFile(payload) {
    loadingImport.value = true
    const resp = await store.importFile(payload)
    loadingImport.value = false

    if (resp.status < 300) {
        if (resp.data.data.error.length) {
            errorImport.value = resp.data.data.error
        } else {
            closeImportForm()
        }
        initInventoryTypes()
    }
}

watch(isShowForm, (value) => {
    if (!value) {
        resetForm();
        detailData.value = null;
    }
});
</script>
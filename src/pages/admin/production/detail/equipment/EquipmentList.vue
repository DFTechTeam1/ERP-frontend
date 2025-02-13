<template>
    <div>
        <div class="d-flex align-end justify-end"
            v-if="canRequestEquipment && (detailProject) && (!detailProject.project_is_complete)">
            <v-btn
                variant="flat"
                color="primary"
                class="mb-5"
                @click.prevent="showForm">
                {{ $t('addEquipment') }}
            </v-btn>
        </div>
        <template v-if="!detailProject">
            <v-skeleton-loader
                type="table"></v-skeleton-loader>
        </template>
        <template v-else>
            <v-table>
                <thead>
                    <tr>
                        <th
                            class="fw-bold"
                            style="font-size: 16px;"
                            v-for="(header, i) in headers"
                            :key="i">
                            {{ header.title }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!detailProject.equipments.length">
                        <td colspan="4" class="text-center">
                            {{ $t('equipmentIsEmpty') }}
                        </td>
                    </tr>
                    <tr v-else
                        v-for="(item, x) in detailProject.equipments"
                        :key="x">
                        <td>{{ item.inventory.name }}</td>
                        <td>{{ item.qty }}</td>
                        <td>
                            <v-chip
                                :color="item.status_color">
                                {{ item.status_text }}
                            </v-chip>
                        </td>
                        <td>
                            <div class="d-flex align-items ga-4"
                                v-if="item.can_take_action"
                                @click.prevent="cancelItem(item)">
                                <span
                                    v-if="canRejectItem">
                                    <v-icon
                                        :icon="mdiClose"
                                        size="20"
                                        class="pointer"
                                        color="red"></v-icon>

                                    <v-tooltip
                                        activator="parent"
                                        location="end">
                                        {{ $t('cancel') }}
                                    </v-tooltip>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </template>

        <form-view
            :is-show="isShowForm"
            @close-event="isShowForm = false"></form-view>

        <confirmation-modal
            :text="t('cancelEquipmentConfirmation')"
            :title="t('cancelItem')"
            :show-confirm="showConfirmCancel"
            :delete-ids="selectedIdsToCancel"
            @actionBulkSubmit="doCancelEquipment"></confirmation-modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import FormView from './FormView';
import { mdiClose } from '@mdi/js';
import { onMounted } from 'vue';
import { useGetRole } from '@/compose/getRole';
import { useCheckPermission } from '@/compose/checkPermission';
import { useRoute } from 'vue-router';

const { t } = useI18n()

const store = useProjectStore()

const route = useRoute();

const { detailProject } = storeToRefs(store);

const loading = ref(false);

const isShowForm = ref(false);

const showConfirmCancel = ref(false);

const selectedIdsToCancel = ref([]);

const role = ref(null);

const canRejectItem = ref(false);

const canAcceptItem = ref(false);

const canRequestEquipment = ref(false);

const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: t('quantity'),
        key: 'qty',
        align: 'start',
        sortable: true
    },
    {
        title: t('status'),
        key: 'status_text',
        align: 'start',
        sortable: true
    },
    {
        title: t('action'),
        key: 'uid',
        align: 'start',
        sortable: true
    },
])

function showForm() {
    isShowForm.value = true;
}

onMounted(() => {
    role.value = useGetRole();

    canRejectItem.value = useCheckPermission('reject_request_equipment');
    canAcceptItem.value = useCheckPermission('accept_request_equipment');
    canRequestEquipment.value = useCheckPermission('request_inventory_event');
})

function cancelItem(item) {
    selectedIdsToCancel.value = [item.uid]
    showConfirmCancel.value = true;
}

async function doCancelEquipment(payload) {
    const resp = await store.cancelItem({id: payload[0]}, route.params.id);

    if (resp.status < 300) {
        selectedIdsToCancel.value = [];
        showConfirmCancel.value = false;
    }
}
</script>
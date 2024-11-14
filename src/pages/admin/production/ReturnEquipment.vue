<template>
    <v-dialog v-model="show"
        persistent
        max-width="600">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('returnEquipment') }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <template v-if="loadingPrepare">
                    <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                    <p class="text-center">
                        {{ $t('preparingData') }}
                    </p>
                </template>
                <template v-else>
                    <v-table>
                        <thead>
                            <tr>
                                <th>{{ $t('name') }}</th>
                                <th v-if="isReported">{{ $t('condition') }}</th>
                                <th>{{ $t('action') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(list, l) in listOfDetailRequestEquipment"
                                :key="l">
                                <td>{{ list.inventory_name }}</td>
                                <td v-if="isReported">
                                    <v-chip
                                        v-if="list.returnCondition && list.returnCondition.is_good_condition"
                                        density="compact"
                                        color="success">
                                        {{ $t('goodCondition') }}
                                    </v-chip>
                                    <v-chip
                                        v-if="list.returnCondition && !list.returnCondition.is_good_condition"
                                        density="compact"
                                        color="red">
                                        {{ $t('broke') }}
                                    </v-chip>

                                    <p>
                                        <v-chip
                                            v-if="list.returnCondition && !list.returnCondition.is_good_condition"
                                            density="compact"
                                            class="mt-1">
                                            {{ list.returnCondition.detail_condition }}
                                        </v-chip>
                                    </p>
                                </td>
                                <td>
                                    <v-btn
                                        variant="flat"
                                        density="compact"
                                        @click.prevent="showAction(list)"
                                        color="purple-lighten-3">
                                        <template v-if="list.returnCondition">
                                            {{ $t('changeCondition') }}
                                        </template>
                                        <template v-else>
                                            {{ $t('takeAction') }}
                                        </template>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-btn
                        class="mt-4 w-100"
                        variant="flat"
                        color="primary"
                        :disabled="loading"
                        @click.prevent="doReturn">
                        <template v-if="loading">
                            {{ $t('processing') }}
                        </template>
                        <template v-else>
                            {{ $t('return') }}
                        </template>
                    </v-btn>
                </template>
            </v-card-text>
        </master-card>

        <action :is-show="showActionForm" :equipment="equipmentToTakeAction"
            :project-uid="props.projectUid"
            @close-event="closeAction"></action>
    </v-dialog>
</template>

<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import Action from './ReturnEquipmentAction.vue'

const emit = defineEmits(['close-event'])

const store = useProjectStore()

const { listOfDetailRequestEquipment } = storeToRefs(store)

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    projectUid: {
        type: String,
        default: '',
    },
})

const showActionForm = ref(false)

const equipmentToTakeAction = ref(null)

const show = ref(false)

const loadingPrepare = ref(false)

const loading = ref(false)

const isReported = ref(false)

function showAction(equipment) {
    showActionForm.value = true

    equipmentToTakeAction.value = equipment
}

async function initEquipment() {
    loadingPrepare.value = true
    await store.listRequestEquipment(props.projectUid)

    loadingPrepare.value = false
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }

    if (values.isShow) {
        initEquipment()
    }
})

function closeAction(isReportedData = false) {
    showActionForm.value = false

    if (isReportedData) {
        isReported.value = isReportedData
    }
}

async function doReturn() {
    var payload = listOfDetailRequestEquipment.value.map((elem) => {
        return {
            uid: elem.uid,
            return_condition: elem.returnCondition,
        }
    })

    loading.value = true
    const resp = await store.returnEquipment(payload, props.projectUid)
    loading.value = false

    if (resp.status < 300) {
        emit('close-event', true)
    }
}
</script>
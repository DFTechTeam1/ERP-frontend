<template>
    <v-dialog v-model="show"
        persistent
        max-width="600">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('finalCheck') }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text style="padding: 0 !important;">
                <template v-if="loadingPrepare">
                    <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                    <p class="text-center">
                        {{ $t('preparingData') }}
                    </p>
                </template>
                <template v-else>
                    <v-stepper-vertical>
                        <template v-slot:default="{ step }">
                            <v-stepper-vertical-item
                                :complete="step > 1"
                                :title="t('taskStatus')"
                                value="1">
                                {{ prepareItem.tasks.text }}
                                <div class="list-check-task d-flex align-center ga-4 mt-3">
                                    <p class="title fw-bold">- {{ $t('totalTask') }}</p>
                                    <p class="value">{{ prepareItem.tasks.total }}</p>
                                </div>
                                <div class="list-check-task d-flex align-center ga-4">
                                    <p class="title fw-bold">- {{ $t('completedTask') }}</p>
                                    <p class="value">{{ prepareItem.tasks.completed }}</p>
                                </div>
                                <div class="list-check-task d-flex align-center ga-4">
                                    <p class="title fw-bold">- {{ $t('unfinishedTask') }}</p>
                                    <p class="value">{{ prepareItem.tasks.unfinished }}</p>
                                </div>
                            </v-stepper-vertical-item>
                            <v-stepper-vertical-item
                                :complete="step > 2"
                                :title="t('showreelStatus')"
                                value="2">
                                {{ prepareItem.showreels.text }}
                            </v-stepper-vertical-item>
                            <v-stepper-vertical-item
                                :complete="step > 3"
                                :title="t('VJ')"
                                value="3">
                                {{ prepareItem.vj.text }}
                            </v-stepper-vertical-item>
                            <v-stepper-vertical-item
                                :complete="step > 4"
                                :title="t('equipmentCheck')"
                                value="4">
                                {{ $t('listEquipmentWillBeBrought') }}:
                                <v-table style="font-size: 12px;">
                                    <thead>
                                        <tr>
                                            <th>{{ $t('name') }}</th>
                                            <th>{{ $t('quantity') }}</th>
                                            <th>{{ $t('status') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        <template v-if="prepareItem.inventories.length">
                                            <tr v-for="(equipment, e) in prepareItem.inventories"
                                                :key="e">
                                                <td>{{ equipment.name }}</td>
                                                <td>{{ equipment.qty }} Pcs</td>
                                                <td>
                                                    <v-chip :color="equipment.status_color" density="compact">
                                                        {{ equipment.status }}
                                                    </v-chip>
                                                </td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td colspan="3" class="text-center">{{ $t('noEquipment') }}</td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </v-table>
    
                                <template v-slot:next="{ next }">
                                    <v-btn color="primary" :text="t('readyToGo')" v-if="!loading" @click.prevent="eventReady"></v-btn>
                                    <v-btn color="primary" :text="t('processing')" v-if="loading" @click.prevent="eventReady"></v-btn>
                                </template>
                            </v-stepper-vertical-item>
                        </template>
                    </v-stepper-vertical>
                </template>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const store = useProjectStore()

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    projectUid: {
        type: String,
    },
})

const show = ref(false)

const prepareItem = ref(null)

const loading = ref(false)

const loadingPrepare = ref(false)

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }

    if (values.isShow) {
        initFinalCheck()
    }
})

async function initFinalCheck() {
    loadingPrepare.value = true
    const resp = await store.finalCheckItem(props.projectUid)
    loadingPrepare.value = false

    if (resp.status < 300) {
        prepareItem.value = resp.data.data
    }
}

async function eventReady() {
    loading.value = true
    const resp = await store.eventReady(props.projectUid)
    loading.value = false

    if (resp.status < 300) {
        emit('close-event', true)
    }
}
</script>
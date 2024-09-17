<template>
    <div>
        <breadcrumb-data
            :title="$t('inventories')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('detail') }}

                    <v-icon
                        :icon="mdiCameraOutline"
                        size="20"
                        class="pointer"
                        v-if="!showCamera"
                        @click="showCamera = true"></v-icon>
                    <v-icon
                        :icon="mdiTable"
                        size="20"
                        class="pointer"
                        v-if="showCamera"
                        @click="showCamera = false"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <template v-if="loading">
                    <v-skeleton-loader
                        width="100%"
                        type="list-item-two-line"></v-skeleton-loader>
                </template>
                <template v-else>
                    <div class="scanner-camera d-flex align-center justify-center">
                        <qrcode-stream @camera-on="onReady" @detect="detectQrcode"
                            @error="onError"
                            v-if="showCamera"
                            :paused="pauseCamera"
                            class="scanner-box"></qrcode-stream>
                    </div>

                    <v-table class="table-list">
                        <thead>
                            <tr>
                                <th class="w-50">{{ $t('name') }}</th>
                                <!-- <th v-if="!mobile"></th> -->
                                <th class="w-25"
                                    :class="{
                                        'w-50': mobile
                                    }">{{ $t('action') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,i) in listOfDetailRequestEquipment"
                            :key="i"
                            class="position-relative">
                                <td>
                                    <div class="d-flex align-center ga-3">
                                        <v-avatar
                                            color="grey-lighten-3">
                                            <v-img
                                                :src="item.inventory_image"></v-img>
                                        </v-avatar>
                                        <div>
                                            <p 
                                                :class="{
                                                    'text-red': item.is_cancel
                                                }"
                                                class="fw-bold" 
                                                style="font-size: 16px;">{{ item.inventory_name }}</p>
                                            <p 
                                                color="grey-darken-1"
                                                :class="{
                                                    'text-red': item.is_cancel
                                                }">{{ item.qty }} Pcs</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <template v-if="item.is_cancel">
                                        <v-chip
                                            color="red">
                                            {{ $t('cancelByPM') }}
                                        </v-chip>
                                    </template>
                                    <template v-else-if="item.is_checked_pic">
                                        <v-chip
                                            :color="item.status_color">
                                            {{ item.status }}
                                        </v-chip>
                                    </template>
                                    <template v-else>
                                        <v-btn
                                            color="success"
                                            variant="text"
                                            @click.prevent="acceptData(item, 'approved')">
                                            <template v-if="item.approved">
                                                <v-chip
                                                    color="success"
                                                    density="compact">
                                                    {{ $t('approved') }}
                                                </v-chip>
                                            </template>
                                            <template v-else>
                                                <v-icon
                                                    :icon="mdiCheck"
                                                    size="20"
                                                    color="success"></v-icon>
                                            </template>
                                        </v-btn>
                                        <v-btn
                                            color="red"
                                            variant="text"
                                            @click.prevent="rejectData(item, 'reject')">
                                            <template v-if="item.reject">
                                                <v-chip
                                                    color="red"
                                                    density="compact">
                                                    {{ $t('reject') }}
                                                </v-chip>
                                            </template>
                                            <template v-else>
                                                <v-icon
                                                    :icon="mdiClose"
                                                    size="20"
                                                    color="red"></v-icon>
                                            </template>
                                        </v-btn>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <v-btn
                        variant="flat"
                        color="primary"
                        class="w-100 mt-4"
                        :disabled="loadingSubmit"
                        @click.prevent="submitData">
                        {{ $t('submit') }}
                    </v-btn>
                </template>
            </v-card-text>
        </v-card>
    </div>
</template>

<style lang="scss">
.input-reason .v-input__details {
    display: none !important;
}

.table-list table tbody tr td {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
}

.scanner-camera {
    width: 512px !important;
    height: auto;
    margin: auto;
}
</style>

<script setup>
import { mdiCameraOutline, mdiCheck, mdiClose, mdiTable } from '@mdi/js';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { QrcodeStream } from 'vue-qrcode-reader'
import { watch } from 'vue';
import { showNotification } from '@/compose/notification';

const store = useProjectStore();

const { listOfDetailRequestEquipment } = storeToRefs(store);

const { mobile } = useDisplay();

const { t } = useI18n();

const route = useRoute();

const loadingSubmit = ref(true);

const loading = ref(false);

const showCamera = ref(false)

const pauseCamera = ref(false)

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('requestEquipment'),
        disabled: false,
        href: '/admin/inventories/request-equipment',
    },
    {
        title: t('detail'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
]);

onMounted(() => {
    getDetailEquipment();
});

function onReady(capabilities) {
    console.log('capabilities', capabilities);
}

function onError(error) {
    console.log('error',error);
    if (error.name === 'NotAllowedError') {
      // user denied camera access permission
    } else if (error.name === 'NotFoundError') {
      // no suitable camera device installed
    } else if (error.name === 'NotSupportedError') {
      // page is not served over HTTPS (or localhost)
    } else if (error.name === 'NotReadableError') {
      // maybe camera is already in use
    } else if (error.name === 'OverconstrainedError') {
      // did you request the front camera although there is none?
    } else if (error.name === 'StreamApiNotSupportedError') {
      // browser seems to be lacking features
    }
  }

async function detectQrcode(decode) {
    pauseCamera.value = true
    const resp = await decode
    pauseCamera.value = false
    
    var totalSearch = []
    for(let a = 0; a < listOfDetailRequestEquipment.value.length; a++) {
        var search = listOfDetailRequestEquipment.value[a].items.indexOf(resp[0].rawValue)
        totalSearch.push(search)

        if (search > -1) {
            if (
                (!listOfDetailRequestEquipment.value[a].is_checked_pic && !listOfDetailRequestEquipment.value[a].is_cancel)
            ) {
                acceptData(listOfDetailRequestEquipment.value[a], 'approved', listOfDetailRequestEquipment.value[a].items[search])
                break
            } else {
                var errMsg = listOfDetailRequestEquipment.value[a].is_checked_pic ? t('itemAlreadyChecked') : t('itemIsCancel')
                showNotification(errMsg, 'warning')
            }
        }
    }

    if (totalSearch.length == listOfDetailRequestEquipment.value.length) {
        var unique = totalSearch.filter((value, index, arr) => {
            return arr.indexOf(value) === index
        })

        if (unique.length == 1) {
            showNotification(t('itemNotFoundInRequestList'), 'error')
        }
    }
}

async function getDetailEquipment() {
    var projectId = route.params.projectId;
    loading.value = true;
    await store.listRequestEquipment(projectId);
    loading.value = false;
}

function acceptData(item, type = 'approved', code = '') {
    console.log('code', code);
    console.log('item', item);
    item.selected_code = code
    store.modifyRequestEquipment(item, type);
    loadingSubmit.value = false;
}

function rejectData(item) {
    store.modifyRequestEquipment(item, 'reject');
    loadingSubmit.value = false;
}

async function submitData() {
    var selected = listOfDetailRequestEquipment.value.map((elem) => {
        return {
            id: elem.uid,
            status: elem.approved ? 1 : 3,
            selected_code: elem.selected_code,
        };
    });

    console.log('selected', selected);

    const resp = await store.updateRequestEquipment(route.params.projectId, {items: selected});

    if (resp.status < 300) {
        loadingSubmit.value = true;
    }
}
</script>
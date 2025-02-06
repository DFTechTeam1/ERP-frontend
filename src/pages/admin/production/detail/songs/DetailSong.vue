<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DetailChangesSong from './DetailChangesSong.vue';
import { useCheckPermission } from '@/compose/checkPermission';

const { t } = useI18n();

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    songUid: {
        type: String
    }
});

const emit = defineEmits(['close-event']);

const show = ref(false);

const expandLogs = ref(false);

const loadingPrepare = ref(false);

const detailData = ref(null);

function closeDialog(type) {
    emit('close-event', type);
}

async function getDetail() {
    detailData.value = null;
    loadingPrepare.value = true;
    const resp = await store.detailSong(detailProject.value.uid, props.songUid);
    loadingPrepare.value = false;
    
    if (resp.status < 300) {
        detailData.value = resp.data.data;
    }
}

watch(props, async (values) => {
    if (values) {
        show.value = values.isShow;

        if (values.isShow && values.songUid) {
            await getDetail();
        }
    }
});
</script>

<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        <master-card>
            <template v-if="loadingPrepare">
                <div style="padding: 20px;">
                    <v-skeleton-loader width="100%" :height="20" class="mb-10"></v-skeleton-loader>
                    <v-skeleton-loader :height="150" class="mb-3" width="100%"></v-skeleton-loader>
                    <v-skeleton-loader :height="150" width="100%"></v-skeleton-loader>
                </div>
            </template>

            <template v-else>
                <v-card-item>
                    <v-card-title class="d-flex align-center justify-space-between">
                        <p>
                            {{ $t('detailSong') }}
    
                            <v-chip
                                size="small"
                                :color="detailData.status_color">
                                {{ detailData.status_format }}
                            </v-chip>
                        </p>
    
                        <v-icon
                            :icon="mdiClose"
                            size="15"
                            @click.prevent="closeDialog(false)"></v-icon>
                    </v-card-title>
                </v-card-item>
    
                <v-card-text>
                    <table>
                        <tbody>
                            <tr>
                                <td>{{ $t('name') }}</td>
                                <td>:</td>
                                <td>{{ detailData.project.name }}</td>
                            </tr>
                            <tr>
                                <td>{{ $t("projectDate") }}</td>
                                <td>:</td>
                                <td>{{ detailData.project.project_date }}</td>
                            </tr>
                            <tr>
                                <td>{{ $t("song") }}</td>
                                <td>:</td>
                                <td class="fw-bold">{{ detailData.name }}</td>
                            </tr>
                            <tr>
                                <td>{{ $t("assigned") }}</td>
                                <td>:</td>
                                <td>
                                    <template v-if="detailData.worker">
                                        <span class="fw-bold">{{ detailData.worker.name }}</span> - {{ detailData.worker.employee_id }}
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
    
                    <v-divider class="mt-5 mb-5"
                        v-if="(detailData.is_request_edit || detailData.is_request_delete) && (useCheckPermission('approve_request_song') || useCheckPermission('reject_request_song'))"></v-divider>
    
                    <detail-changes-song
                        :detail-data="detailData"
                        v-if="(detailData.is_request_edit || detailData.is_request_delete) && (useCheckPermission('approve_request_song') || useCheckPermission('reject_request_song'))"
                        @close-event="$emit('close-event', false)" />
    
                    <v-divider class="mt-5 mb-5"></v-divider>
    
                    <div class="log-wrapper mt-3">
                        <p class="mb-5">{{ $t('activity') }}</p>
    
                        <template v-if="detailData.logs.main.length">
                            <div class="log-wrapper">
                                <div class="log-item"
                                    v-for="(log, l) in detailData.logs.main"
                                    :key="l">
                                    <v-avatar color="surface-variant"></v-avatar>
        
                                    <div class="log-detail">
                                        <p class="log-text">{{ log.text }}</p>
                                        <p class="log-time">{{ log.time }}</p>
                                    </div>
                                </div>

                                
                            </div>
                            <v-expand-transition>
                                <div class="log-wrapper" v-if="expandLogs">
                                    <div class="log-item"
                                        v-for="(logMore, lMore) in detailData.logs.more"
                                        :key="lMore">
                                        <v-avatar color="surface-variant"></v-avatar>
                                        <div class="log-detail">
                                            <p class="log-text">{{ logMore.text }}</p>
                                            <p class="log-time">{{ logMore.time }}</p>
                                        </div>
                                    </div>
                                </div>
                            </v-expand-transition>
                            <p class="more-activity"
                                @click.prevent="expandLogs = !expandLogs"
                                v-if="detailData.logs.more.length"
                                :class="{
                                    'expand-width': expandLogs
                                }">
                                <template v-if="!expandLogs">
                                    {{ $t("seeMoreActivity") }}
                                </template>
                                <template v-else>
                                    {{ $t("hideActivity") }}
                                </template>
                            </p>
                        </template>

                        <template v-else>
                            <div class="d-flex"
                                :style="{
                                    fontSize: '12px',
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }">
                                {{ $t('emptyLogs') }}
                            </div>
                        </template>
                    </div>
                </v-card-text>
            </template>
        </master-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.request-body {
    display: flex;
    align-items: center;
    justify-content: start;
}
.request-detail {
    text-align: center;
    display: flex;
    align-items: center;
    gap: 15px;
    
    .request-title {
        font-size: 13px;
        margin: 12px 0;
    }
}

.more-activity {
    font-size: 10px;
    color: #29B6F6;
    cursor: pointer;
    width: auto;
    max-width: 105px;
    line-height: 1.2;
    border-bottom: 1px solid #29B6F6;
}

.more-activity.expand-width {
    max-width: 80px !important;
}

.log-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    .log-detail {
        .log-text {
            font-size: 13px;
        }

        .log-time {
            font-size: 11px;
        }
    }
}

table {
    tbody {
        tr {
            td {
                padding: 8px;
            }

            td:first-child {
                font-size: 14px;
                font-weight: bold;
            }

            td:last-child {
                font-size: 13px;
                padding-left: 20px;
            }
        }
    }
}
</style>
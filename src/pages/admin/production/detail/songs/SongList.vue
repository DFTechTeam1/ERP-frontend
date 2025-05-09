<script setup>
import { mdiAccount, mdiCheckBold, mdiCheckCircle, mdiClose, mdiCogOutline, mdiDotsVertical, mdiEyeCircle, mdiMusic, mdiPencil, mdiSourceBranchPlus } from '@mdi/js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SongForm from './SongForm.vue';
import SingleSongForm from './SingleSongForm.vue';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { showNotification } from '@/compose/notification';
import DistributeForm from './DistributeForm.vue';
import DetailSong from './DetailSong.vue';
import ReportDone from './ReportDone.vue';

const { t } = useI18n();

const props = defineProps({
    songs: Array
});

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const distributeSongUid = ref(null);

const showDistributeForm = ref(false);

const loading = ref(false);

const showDetailSong = ref(false);

const showSongForm = ref(false);

const showReportForm = ref(false);

const selectedReportId = ref(null);

const showEditForm = ref(false);

const showConfirmationDelete = ref(false);

const detailSongUid = ref(null);

const editSongItem = ref(null);

const selectedIds = ref([]);

async function doBulkDelete(ids) {
    loading.value = true;
    const resp = await store.deleteSong(detailProject.value.uid, ids[0]);
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        showConfirmationDelete.value = false;
        selectedIds.value = [];
    } else {
        showNotification(resp.response.data.message, 'error');
    }
}

function deleteSong(songUid) {
    showConfirmationDelete.value = true;
    selectedIds.value.push(songUid);
}

function editData(songUid) {
    const selected = props.songs.filter((item) => {
        return item.uid == songUid;
    });

    if (selected.length) {
        editSongItem.value = selected[0];

        showEditForm.value = true;
    }
}

function closeDistributeSong() {
    showDistributeForm.value = false;
    distributeSongUid.value = null;
}

function openDistributeForm(song) {
    showDistributeForm.value = true;
    distributeSongUid.value = song.uid;
}

function doDetailSong(songUid) {
    showDetailSong.value = true;
    detailSongUid.value = songUid;
}

function closeReportForm() {
    showReportForm.value = false;
}

function openReportForm(song) {
    showReportForm.value = true;
    selectedReportId.value = song.uid;
}

async function startWork(songUid) {
    loading.value = true;
    const resp = await store.startWorkSong(detailProject.value.uid, songUid);
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
    } else {
        showNotification(resp.response.data.message, 'error');
    }
}
</script>

<template>
    <div style="overflow-y: scroll; height: 320px;">
        <template v-if="props.songs.length">
            <v-list lines="three" :disabled="loading">
                <v-list-item
                    v-for="(song, songKey) in props.songs"
                    :key="songKey"
                    :title="song.name"
                    :class="{
                        'border-bottom': songKey != props.songs.length - 1,
                        'bg-blue-grey-lighten-5': song.my_own
                    }">
                    <template v-slot:prepend>
                        <v-icon
                            :icon="mdiMusic"
                            size="20"></v-icon>
                    </template>

                    <template v-slot:append>
                        <div class="d-flex align-center"
                            :style="{
                                gap: '10px'
                            }">
                            <v-menu
                                open-on-click>
                                <template v-slot:activator="{ props }">
                                    <v-icon
                                        v-bind="props"
                                        :icon="mdiDotsVertical"
                                        color="blue"></v-icon>
                                </template>

                                <v-list>
                                    <v-list-item
                                        :disabled="song.is_request_edit || song.is_request_delete ? true : false"
                                        @click.prevent="editData(song.uid)"
                                        v-if="song.can_edit"
                                        class="pointer">
                                        <template v-slot:title>
                                            <v-icon
                                                :icon="mdiPencil"
                                                size="20"
                                                color="primary"
                                                class="me-2"></v-icon>
                                            {{ $t("edit") }}
                                        </template>
                                    </v-list-item>
                                    <v-list-item
                                        :disabled="song.is_request_edit || song.is_request_delete ? true : false"
                                        @click.prevent="deleteSong(song.uid) "
                                        v-if="song.can_delete"
                                        class="pointer">
                                        <template v-slot:title>
                                            <v-icon
                                                :icon="mdiClose"
                                                size="20"
                                                color="red"
                                                class="me-2"></v-icon>
                                            {{ $t("delete") }}
                                        </template>
                                    </v-list-item>
                                    <v-list-item
                                        v-if="song.can_distribute"
                                        @click.prevent="openDistributeForm(song)"
                                        class="pointer">
                                        <template v-slot:title>
                                            <v-icon
                                                :icon="mdiSourceBranchPlus"
                                                size="20"
                                                color="primary"
                                                class="me-2"></v-icon>
                                            {{ $t("distribute") }}
                                        </template>
                                    </v-list-item>
                                    <v-list-item
                                        class="pointer"
                                        @click.prevent="doDetailSong(song.uid)">
                                        <template v-slot:title>
                                            <v-icon
                                                :icon="mdiEyeCircle"
                                                size="20"
                                                color="primary"
                                                class="me-2"></v-icon>
                                            {{ $t("detailSong") }}
                                        </template>
                                    </v-list-item>
                                    <v-list-item
                                        v-if="song.can_start_work"
                                        class="pointer"
                                        @click.prevent="startWork(song.uid)">
                                        <template v-slot:title>
                                            <v-icon
                                                :icon="mdiCheckCircle"
                                                size="20"
                                                color="success"
                                                class="me-2"></v-icon>
                                            {{ $t("startWork") }}
                                        </template>
                                    </v-list-item>
                                    <v-list-item
                                        v-if="song.can_approve_work"
                                        class="pointer"
                                        @click.prevent="openReportForm(song)">
                                        <template v-slot:title>
                                            <v-icon
                                                :icon="mdiCheckCircle"
                                                size="20"
                                                color="success"
                                                class="me-2"></v-icon>
                                            {{ $t("reportAsDone") }}
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </template>

                    <template v-slot:subtitle>
                        <div>
                            <v-chip
                                class="mt-1"
                                :color="song.status_color"
                                flat
                                size="small">
                                {{ song.status_text }}
                            </v-chip>
                            <v-chip
                                v-if="song.status_request"
                                class="mt-1 ms-1"
                                color="lime-darken-3"
                                flat
                                size="small">
                                {{ song.status_request }}
                            </v-chip>
                        </div>

                        <div class="mt-2"
                            v-if="song.task">
                            <v-chip
                                size="small">
                                <v-icon
                                    :icon="mdiAccount"
                                    size="15"
                                    class="me-2"></v-icon>
                                <span>{{ song.task.employee.nickname }}</span>
                            </v-chip>
                        </div>
                    </template>
                </v-list-item>
            </v-list>

            <report-done
                :song-uid="selectedReportId"
                :is-show="showReportForm"
                @close-event="closeReportForm" />

            <song-form :is-show="showSongForm"
                @close-event="showSongForm = false" />

            <single-song-form
                :is-show="showEditForm"
                @close-event="showEditForm = false"
                :edit-data="editSongItem" />

            <distribute-form
                @close-event="closeDistributeSong"
                :is-show="showDistributeForm"
                :song-uid="distributeSongUid"
                :project-uid="detailProject.uid" />

            <detail-song
                :song-uid="detailSongUid"
                :is-show="showDetailSong"
                @close-event="showDetailSong = false" />

            <confirmation-modal
                :title="t('confirmDeleteSong')"
                :text="t('textConfirmDeleteSong')"
                :showConfirm="showConfirmationDelete"
                :deleteIds="selectedIds"
                :loading="loading"
                @action-bulk-submit="doBulkDelete"></confirmation-modal>
        </template>

        <v-empty-state
            v-else
            :title="t('emptySongList')"
            :text="t('songWillAppearHere')"
            size="100"
            image="/paper.png"></v-empty-state>
    </div>
</template>

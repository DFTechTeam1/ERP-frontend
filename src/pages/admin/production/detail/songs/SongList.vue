<script setup>
import { mdiAccount, mdiCheckBold, mdiClose, mdiCogOutline, mdiEyeCircle, mdiMusic, mdiPencil, mdiSourceBranchPlus } from '@mdi/js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SongForm from './SongForm.vue';
import SingleSongForm from './SingleSongForm.vue';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { showNotification } from '@/compose/notification';
import { useCheckPermission } from '@/compose/checkPermission';

const { t } = useI18n();

const props = defineProps({
    songs: Array
});

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const showSongForm = ref(false);

const showEditForm = ref(false);

const showConfirmationDelete = ref(false);

const editSongItem = ref(null);

const selectedIds = ref([]);

async function doBulkDelete(ids) {
    const resp = await store.deleteSong(detailProject.value.uid, ids[0]);

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
</script>

<template>
    <div style="overflow: scroll; height: 320px;">
        <template v-if="props.songs.length">
            <v-list lines="three">
                <v-list-item
                    v-for="(song, songKey) in props.songs"
                    :key="songKey"
                    :title="song.name"
                    :class="{
                        'border-bottom': songKey != props.songs.length - 1
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
                            <v-icon
                                :icon="mdiPencil"
                                size="18"
                                :disabled="song.disabled"
                                v-if="useCheckPermission('edit_request_song')"
                                @click.prevent="editData(song.uid)"
                                color="primary"
                                class="pointer"></v-icon>
                            <v-icon
                                :icon="mdiClose"
                                size="18"
                                v-if="useCheckPermission('delete_request_song')"
                                :disabled="song.disabled"
                                color="red"
                                @click.prevent="deleteSong(song.uid)"
                                class="pointer"></v-icon>

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
                                            v-if="!song.task"
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
                                            v-if="song.is_request_edit || song.is_request_delete"
                                            class="pointer">
                                            <template v-slot:title>
                                                <v-icon
                                                    :icon="mdiEyeCircle"
                                                    size="20"
                                                    color="success"
                                                    class="me-2"></v-icon>
                                                {{ $t("detailChanges") }}
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
                                {{ song.status_format }}
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
                                <span>Ilham</span>
                            </v-chip>
                        </div>
                    </template>
                </v-list-item>
            </v-list>

            <song-form :is-show="showSongForm"
                @close-event="showSongForm = false" />
            <single-song-form
                :is-show="showEditForm"
                @close-event="showEditForm = false"
                :edit-data="editSongItem" />

            <confirmation-modal
                :title="t('confirmDeleteSong')"
                :text="t('textConfirmDeleteSong')"
                :showConfirm="showConfirmationDelete"
                :deleteIds="selectedIds"
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
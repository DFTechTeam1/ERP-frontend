<script setup>
import { showNotification } from '@/compose/notification';
import { useProjectStore } from '@/stores/project';
import { mdiAccount, mdiArrowLeftCircle, mdiClose, mdiCloseCircle, mdiPlusCircle } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(['close-event']);

const store = useProjectStore();

const { t } = useI18n();

const {
    detailProject,
    listOfDetailEntertainmentWorkload
} = storeToRefs(store);

const show = ref(false);

const loadingPrepare = ref(false);

const loadingChoose = ref(false);

const loading = ref(false);

const showSongForm = ref(false);

const detailUser = ref(null);

const songList = ref([]);

async function getWorkload() {
    loadingPrepare.value = true;
    const resp = await store.getEntertainmentTeamDetailWorkload(detailProject.value.uid);
    loadingPrepare.value = false;
}

function showDetailUser(user) {
    detailUser.value = null;
    loadingChoose.value = true;
    showSongForm.value = false;

    setTimeout(() => {
        const selected = listOfDetailEntertainmentWorkload.value.filter((filter) => {
            return filter.uid === user.uid;
        });

        if (selected.length) {
            detailUser.value = selected[0];
            if (detailUser.value.nextSong == undefined) {
                detailUser.value.nextSong = [];
            }
        }

        loadingChoose.value = false;
    }, 500);
}

function closeSongForm() {
    showSongForm.value = false;
    songList.value = [];
}

async function removePicSong(projectUid, songUid) {
  loading.value = true;
  const resp = await store.removeSongPic(projectUid, songUid);
  loading.value = false;

  if (resp.status < 300) {
    showNotification(resp.data.message);
    // emit('close-event');
    getWorkload();
    showSongForm.value = false;
    detailUser.value = null;
  } else {
    showNotification(resp.response.data.message, 'error');
  }
}

function openSongForm() {
    // get all selected song
    var allSelectedSong = [];
    for (let a = 0; a < listOfDetailEntertainmentWorkload.value.length; a++) {
        if (listOfDetailEntertainmentWorkload.value[a].tasks.length) {
            for (let b = 0; b < listOfDetailEntertainmentWorkload.value[a].tasks.length; b++) {
                allSelectedSong.push(listOfDetailEntertainmentWorkload.value[a].tasks[b]);
            }
        }

        if ((listOfDetailEntertainmentWorkload.value[a].nextSong != undefined) && (listOfDetailEntertainmentWorkload.value[a].nextSong.length)) {
            if (detailUser.value.uid !== listOfDetailEntertainmentWorkload.value[a].uid) {
                for (let c = 0; c <listOfDetailEntertainmentWorkload.value[a].nextSong.length; c++) {
                    allSelectedSong.push(listOfDetailEntertainmentWorkload.value[a].nextSong[c]);
                }
            }
        }
    }

    let currentSong = detailProject.value.songs;
    currentSong = currentSong.concat(allSelectedSong);

    songList.value = currentSong.filter((item, _, self) =>
        self.filter(obj => obj.uid === item.uid && obj.name === item.name).length === 1
    );

    songList.value.map((elem) => {
        // make 'active' key if do not exists
        if (elem.active == undefined) {
            elem.active = false;
        }

        return elem;
    });

    showSongForm.value = true;
}

function selectSong(song) {
    var newSong = [];

    for (let a = 0; a < songList.value.length; a++) {
        newSong.push(songList.value[a]);

        if (songList.value[a].uid == song.uid) {
            newSong[a].active = !songList.value[a].active;
        }
    }

    songList.value = newSong;
}

function chooseSongForUser() {
    var activeSong = songList.value.filter((filter) => {
        return filter.active;
    });

    detailUser.value.nextSong = activeSong;

    showSongForm.value = false;

    // update detail workload state
    var newUserFormat = listOfDetailEntertainmentWorkload.value.map((elem) => {
        if (elem.uid === detailUser.value.uid) {
            elem = detailUser.value;
        }

        return elem;
    });

    store.updateDetailEntertainmentWorkload(newUserFormat);
}

function closeDialog() {
    detailUser.value = null;
    loadingChoose.value = false;
    songList.value = [];
    showSongForm.value = false;
    store.updateDetailEntertainmentWorkload([]);

    emit('close-event');
}

async function submitBulkAssign() {
    let formatted = [];
    for (let a = 0; a < listOfDetailEntertainmentWorkload.value.length; a++) {
        if ((listOfDetailEntertainmentWorkload.value[a].nextSong != undefined) && (listOfDetailEntertainmentWorkload.value[a].nextSong.length)) {
            var songUid = [];
            for (let b = 0; b < listOfDetailEntertainmentWorkload.value[a].nextSong.length; b++) {
                songUid.push(listOfDetailEntertainmentWorkload.value[a].nextSong[b].uid);
            }
            formatted.push({
                uid: listOfDetailEntertainmentWorkload.value[a].uid,
                songs: songUid
            });
        }
    }

    loading.value = true;
    const resp = await store.bulkAssignSong({workers: formatted}, detailProject.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        closeDialog();
    } else {
        showNotification(resp.response.data.message, 'error');
    }
}

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        if (values.isShow) {
            getWorkload();
        }
    }
});
</script>

<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="700">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t("bulkDistributeSong") }}

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        color="red"
                        @click.prevent="closeDialog"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <template v-if="loadingPrepare">
                    <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                </template>
                <template v-else>
                    <v-row
                        class="pa-4"
                        justify="space-between"
                        >
                        <v-col cols="5">
                            <v-list>
                                <v-list-item
                                    v-for="(user, u) in listOfDetailEntertainmentWorkload"
                                    :key="u"
                                    @click.prevent="showDetailUser(user)"
                                    :title="user.name">
                                    <template v-slot:prepend>
                                        <v-avatar color="grey-lighten-1"
                                            size="20">
                                            <v-icon :icon="mdiAccount"
                                                size="15"></v-icon>
                                        </v-avatar>
                                    </template>
                                    <template v-slot:append>
                                        <v-badge
                                            color="error"
                                            :content="user.tasks.length"
                                            inline
                                            ></v-badge>
                                    </template>
                                </v-list-item>
                            </v-list>

                            <v-btn size="small"
                                variant="flat"
                                color="primary"
                                class="w-100"
                                type="button"
                                :loading="loading"
                                @click.prevent="submitBulkAssign">
                                <template v-if="loading">{{ $t("processing") }}</template>
                                <template v-else>{{ $t("save") }}</template>
                            </v-btn>
                        </v-col>

                        <v-divider vertical></v-divider>

                        <v-col
                            class="d-flex text-center"
                        >
                            <v-scroll-y-transition mode="out-in">
                                <div v-if="!detailUser"
                                    :style="{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%'
                                    }">
                                    <template v-if="loadingChoose">
                                        <v-skeleton-loader width="100%" type="card"></v-skeleton-loader>
                                    </template>
                                    <template v-else>
                                        {{ $t("selectUser") }}
                                    </template>
                                </div>
                                <div v-else
                                    :style="{
                                        width: '100%'
                                    }">
                                    <v-avatar
                                        size="88"
                                    >
                                        <v-img
                                        src="/user.png"
                                        class="mb-6"
                                        ></v-img>
                                    </v-avatar>
                                    <h3 class="text-h5 mb-2">
                                        {{ detailUser.name }}
                                    </h3>
                                    <div class="text-blue mb-2">
                                        {{ detailUser.email }}
                                    </div>
                                    <div class="text-blue subheading font-weight-bold">
                                        <v-chip size="small">
                                            {{ detailUser.employee_id }}
                                        </v-chip>
                                    </div>

                                    <v-divider class="my-3"></v-divider>

                                    <v-row
                                        class="text-left"
                                        tag="v-card-text">
                                        <v-col
                                            class="text-left me-4 mb-2"
                                            cols="12"
                                            tag="strong"
                                        >
                                            <!-- Template form song -->
                                            <template v-if="showSongForm">
                                                <div class="d-flex align-center justify-space-between">
                                                    {{ $t("chooseSong") }}:

                                                    <v-tooltip :text="t('back')">
                                                        <template v-slot:activator="{ props }">
                                                            <v-icon
                                                                @click.prevent="closeSongForm"
                                                                v-bind="props"
                                                                :icon="mdiArrowLeftCircle"
                                                                size="20"
                                                                class="pointer"
                                                                color="#4f545c"></v-icon>
                                                        </template>
                                                    </v-tooltip>
                                                </div>

                                                <template v-if="songList.length">
                                                    <v-chip
                                                        v-for="(song, s) in songList"
                                                        :key="s"
                                                        size="small"
                                                        class="me-1 pointer"
                                                        :color="song.active ? 'primary' : ''"
                                                        @click.prevent="selectSong(song)">
                                                        {{ song.name }}
                                                    </v-chip>
                                                    <div class="text-end">
                                                        <v-btn size="small"
                                                            type="button"
                                                            color="primary"
                                                            class="mt-3 me-3"
                                                            :disabled="loading"
                                                            @click.prevent="chooseSongForUser">
                                                            {{ $t("saveSong") }}
                                                        </v-btn>
                                                    </div>
                                                </template>
                                            </template> <!-- END Template form song -->

                                            <!-- Template song list -->
                                            <template v-if="!showSongForm">
                                                <div class="d-flex align-center justify-space-between">
                                                    {{ $t("songList") }}:

                                                    <v-tooltip :text="t('assignMoreSong')">
                                                        <template v-slot:activator="{ props }">
                                                            <v-icon
                                                                @click.prevent="openSongForm"
                                                                v-bind="props"
                                                                :icon="mdiPlusCircle"
                                                                size="20"
                                                                class="pointer"
                                                                color="#4f545c"></v-icon>
                                                        </template>
                                                    </v-tooltip>
                                                </div>

                                                <template v-if="detailUser.tasks.length">
                                                    <v-list>
                                                        <v-list-item
                                                            v-for="(song, s) in detailUser.tasks"
                                                            :key="s"
                                                            :style="{
                                                                minHeight: '10px'
                                                            }"
                                                            :title="song.name">
                                                            <template v-slot:prepend>
                                                                <div class="number me-2">{{ parseInt(s) + 1 }}.</div>
                                                            </template>

                                                            <template v-slot:append>
                                                              <v-icon
                                                                :icon="mdiCloseCircle"
                                                                size="20"
                                                                class="pointer"
                                                                @click.prevent="removePicSong(detailProject.uid, song.uid)"
                                                                :color="loading ? 'grey' : '#fc0349'"></v-icon>
                                                            </template>
                                                        </v-list-item>
                                                    </v-list>
                                                </template>

                                                <template v-else>
                                                    <div :style="{
                                                        fontSize: '12px',
                                                        marginTop: '10px'
                                                    }">{{ $t("emptySong") }}</div>
                                                </template>
                                            </template> <!-- END Template song list -->

                                            <!-- Template for next song assign -->
                                            <template v-if="detailUser.nextSong.length && !showSongForm">
                                                {{ $t("nextSongAssign") }}:

                                                <v-list>
                                                    <v-list-item
                                                            v-for="(nextSong, n) in detailUser.nextSong"
                                                            :key="n"
                                                            :style="{
                                                                minHeight: '10px'
                                                            }"
                                                            :title="nextSong.name">
                                                            <template v-slot:prepend>
                                                                <div class="number me-2">{{ parseInt(n) + 1 }}.</div>
                                                            </template>
                                                        </v-list-item>
                                                </v-list>
                                            </template> <!-- END Template for next song assign -->
                                        </v-col>
                                    </v-row>
                                </div>

                            </v-scroll-y-transition>
                        </v-col>
                    </v-row>
                </template>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<script setup>
import { useDashboardStore } from '@/stores/dashboard';
import { mdiArrowRight, mdiCalendarAlert } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const store = useDashboardStore();

const {
    listOfProjectSongs
} = storeToRefs(store);

async function getProjectSong() {
    await store.getProjectSong();
}

onMounted(() => {
    getProjectSong();
});
</script>

<template>
    <master-card>
        <v-card-item>
            <v-card-title class="d-flex align-center justify-space-between">
                {{ $t("songs") }}

                <span class="detail" @click.prevent="$router.push({path: '/admin/production/projects'})"
                :style="{
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: '#29B6F6'
                }">
                    {{ $t('seeDetail') }}
                    <v-icon
                        :icon="mdiArrowRight"
                        size="10"></v-icon>
                </span>
            </v-card-title>
        </v-card-item>

        <v-card-text>
            <template v-if="listOfProjectSongs.length">
                <v-list
                    lines="two">
                    <v-virtual-scroll
                        :max-height="400"
                        :items="listOfProjectSongs">
                        <template v-slot:default="{ item, index }">
                            <v-list-item
                                @click.prevent="$router.push({path: '/admin/production/project/' + item.uid})"
                                :title="item.name">
                                <template v-slot:subtitle>
                                    <v-chip
                                        size="small"
                                        color="primary"
                                        class="mb-1">
                                        {{ item.assign_song.length }} Song - On Progress
                                    </v-chip>
                                    <v-chip
                                        v-if="item.assign_song.length"
                                        size="small"
                                        color="red">
                                        {{ item.unassign_song.length }} Song - Waiting
                                    </v-chip>
                                </template>

                                <template v-slot:append>
                                    <span :style="{
                                        fontSize: '12px'
                                    }">{{ item.project_date }}</span>
                                </template>
                            </v-list-item>

                            <v-divider v-if="index != parseInt(listOfProjectSongs.length) - 1"></v-divider>
                        </template>

                    </v-virtual-scroll>
                </v-list>
            </template>
            <template v-else>
                <v-empty-state
                    title="You have project ahead"
                    :icon="mdiCalendarAlert"
                    ></v-empty-state>
            </template>
        </v-card-text>
    </master-card>
</template>

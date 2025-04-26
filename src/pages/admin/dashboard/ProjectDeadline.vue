<template>
    <v-card
        class="card-dashboard"
        variant="elevated">
        <v-card-item>
            <v-card-title class="d-flex align-center justify-space-between">
                <span class="fw-bold">{{ $t('currentDeadline') }}</span>

                <span class="detail" @click.prevent="projectList">
                    {{ $t('seeDetail') }}
                    <v-icon
                        :icon="mdiArrowRight"
                        size="10"></v-icon>
                </span>
            </v-card-title>
        </v-card-item>

        <v-card-text>
            <template v-if="loading">
                <v-skeleton-loader
                    class="mb-3"
                    type="list-item-avatar-three-line"></v-skeleton-loader>
                <v-skeleton-loader
                    class="mb-3"
                    type="list-item-avatar-three-line"></v-skeleton-loader>
            </template>
            <template v-else>
                <template v-if="listOfProjectDeadline.length">
                    <v-list
                        style="border-radius: 8px;">
                        <v-list-item class="mb-4 deadline-item"
                            v-for="(item, x) in listOfProjectDeadline"
                            :key="x"
                            :base-color="item.color"
                            @click.prevent="detailProject(item)">
                            <template v-slot:prepend>
                                <v-avatar>
                                    <v-icon
                                        size="40"
                                        :icon="mdiCalendarAccount"></v-icon>
                                </v-avatar>
                            </template>

                            <template v-slot:title>
                                {{ item.name }}
                            </template>

                            <template v-slot:subtitle>
                                {{ item.project_date }}
                            </template>

                            <template v-slot:append>
                                <v-chip>
                                    {{ item.date_count }}
                                </v-chip>
                            </template>
                        </v-list-item>
                    </v-list>
                </template>

                <template v-else>
                    <v-empty-state
                        title="You have no deadline project"
                        :icon="mdiCalendarAlert"
                        ></v-empty-state>
                </template>
            </template>
        </v-card-text>
    </v-card>
</template>

<style lang="scss" scoped>
.detail {
    font-size: 12px;
    cursor: pointer;
    color: #29B6F6;
}

.deadline-item {
    border-radius: 12px !important;
    cursor: pointer;

    &:hover {
        border-radius: 12px;
        background-color: #e6e6e6;
    }
}
</style>

<script setup>
import { useDashboardStore } from '@/stores/dashboard';
import { mdiArrowRight, mdiCalendarAccount, mdiCalendarAlert } from '@mdi/js'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const store = useDashboardStore()

const loading = ref(false)

const { listOfProjectDeadline } = storeToRefs(store)

async function initProjectDeadline() {
    loading.value = true
    await store.getProjectDeadline()
    loading.value = false
}

function detailProject(item) {
    router.push('/admin/production/project/' + item.uid)
}

function projectList() {
    router.push('/admin/production/projects')
}

onMounted(() => {
    initProjectDeadline()
})
</script>

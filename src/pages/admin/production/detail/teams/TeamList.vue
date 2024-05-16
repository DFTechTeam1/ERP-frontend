<template>
    <div>
        <table-list
            :headers="headers"
            :items="listTeams"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="true"
            :showClearFilter="showClearFilter"
            :fullCustomBody="true"
            :hasCheckbox="false"
            :btnAddText="$t('assignMember')"
            @add-data-event="showForm"
            @table-event="initTeams">

            <template v-slot:bodytable="{ value }">
                <tr>
                    <td>
                        <div class="d-flex align-items" style="gap: 10px;">
                            <div class="image">
                                <v-avatar
                                    :image="'/user.png'"
                                    size="40"></v-avatar>
                            </div>

                            <div class="team-data">
                                <p class="name">{{ value.name }}</p>
                                <p class="email">{{ value.email }}</p>
                            </div>
                        </div>
                    </td>
                    <td>{{ value.current_task }}</td>
                    <td>{{ value.last_update }}</td>
                    <td>
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
                                    class="pointer"
                                    @click.prevent="deleteEmployee(value.uid)">
                                    <template v-slot:title>
                                        <div
                                            class="d-flex align-center"
                                            style="gap: 8px; font-size: 12px;">
                                            <v-icon
                                            :icon="mdiTrashCanOutline"
                                            size="15"></v-icon>
                                            {{ $t('delete') }}
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>

        </table-list>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useI18n } from 'vue-i18n'
import { mdiCogOutline, mdiTrashCanOutline } from '@mdi/js';

const { t } = useI18n()

const store = useProjectStore()

const listTeams = ref([])
const totalItems = ref(0)
const itemsPerPage = ref(10)
const loading = ref(false)
const showClearFilter = ref(false)
const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: t('currentTask'),
        key: 'current_task',
        align: 'start',
        sortable: true
    },
    {
        title: t('lastUpdate'),
        key: 'last_update',
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

function initTeams() {
    listTeams.value = store.getTeams()

    totalItems.value = listTeams.value.length
}

function showForm() {

}
</script>
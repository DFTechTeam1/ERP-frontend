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
            :btnAddText="$t('requestEquipment')"
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
                    <td>{{ value.qty }}</td>
                    <td>
                        <v-chip
                            :color="value.status_color">
                            {{ value.status_text }}
                        </v-chip>
                    </td>
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

        <form-view
            :is-show="isShowForm"></form-view>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useI18n } from 'vue-i18n'
import { mdiCogOutline, mdiTrashCanOutline } from '@mdi/js';
import FormView from './FormView';

const { t } = useI18n()

const store = useProjectStore()

const listTeams = ref([])
const totalItems = ref(0)
const itemsPerPage = ref(10)
const loading = ref(false)
const isShowForm = ref(false)
const showClearFilter = ref(false)
const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true
    },
    {
        title: t('quantity'),
        key: 'qty',
        align: 'start',
        sortable: true
    },
    {
        title: t('status'),
        key: 'status_text',
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
    listTeams.value = store.getEquipments()

    totalItems.value = listTeams.value.length
}

function showForm() {
    isShowForm.value = true;
}
</script>
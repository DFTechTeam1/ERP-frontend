<script setup>
import { useCheckPermission } from '@/compose/checkPermission';
import { useProjectStore } from '@/stores/project';
import { mdiCheckCircle, mdiCogOutline, mdiEyeCircle, mdiSwapHorizontal } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FilterProject from '../FilterProject.vue';

const { t } = useI18n();

const store = useProjectStore();

const {
    listOfProjects,
    isHaveFilterData,
    keyKeepProjectParams,
    totalOfProjects
} = storeToRefs(store);

const itemsPerPage = ref(10);

const totalItems = ref(0);

const loading = ref(false);

const isShowFilter = ref(false);

const showClearFilter = ref(false);

const searchParam = ref(null);

const headers = ref([
    {
        title: t('name'),
        key: 'name',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('date'),
        key: 'project_date',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('venue'),
        key: 'venue',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('pic'),
        key: 'pic',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('eventType'),
        key: 'event_type',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('status'),
        key: 'status',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('ledArea'),
        key: 'led_area',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('eventClass'),
        key: 'classification',
        align: 'start',
        sortable: true,
        available: true
    },
    {
        title: t('songs'),
        key: 'songs',
        align: 'start',
        sortable: false,
        available: true
    },
    {
        title: t('equipments'),
        key: 'number_of_equipments',
        align: 'start',
        sortable: false,
        available: true
    },
    {
        title: t('action'),
        key: 'uid',
        align: 'start',
        sortable: false,
        available: true
    },
]);

function toggleColumns(column, target = false) {
    const selected = headers.value.map((item) => {
        if (item.key === column) {
            item.available = target;
        }

        return item; 
    });

    headers.value = selected;
}

async function initProjects(payload = '') {
    if (!keyKeepProjectParams.value) {
      if (payload === '') {
        payload = {page: 1, itemsPerPage: 10}
      }

      store.setProjectDurationFilter({
        month: thisMonthFilterActive.value,
        today: todayFilterActive.value,
        year: thisYearFilterActive.value,
      });

      store.setProjectParams({
        page: payload.page,
        itemsPerPage: payload.itemsPerPage,
        sortBy: payload.sortBy,
      })
    }

    
    loading.value = true;
    await store.initProjects();
    loading.value = false;
    totalItems.value = totalOfProjects.value;
    itemsPerPage.value = parseInt(payload.itemsPerPage || 10);

    store.setForceUpdatePages(true);
    store.setKeepProjectParams(false);
}

function showFilter() {
    isShowFilter.value = true;
}

function clearFilter() {
    searchParam.value = '';

  store.setProjectDurationFilter({
    month: true,
    today: false,
    year: false,
  });
  store.setFilterData(false);

  toggleFilterButton('month');

    // store.setProjectDurationFilter({
    //   month: thisMonthFilterActive.value,
    //   today: todayFilterActive.value
    // });
    store.setSearchParamProject({});

    store.setForceUpdatePages(false);

    initProjects();
    showClearFilter.value = isHaveFilterData.value;
}

const todayFilterColor = ref('grey-lighten-2');
const thisYearFilterActive = ref(false);
const yearFilterColor = ref('grey-lighten-2');
const thisMonthFilterColor = ref('blue-lighten-2');
const allFilterColor = ref('grey-lighten-2');
const thisMonthFilterActive = ref(true);
const todayFilterActive = ref(false);
const allFilterActive = ref(false);

function toggleFilterButton(type) {
  if (type === 'year') {
    thisYearFilterActive.value = true;

    yearFilterColor.value = 'blue-lighten-2'
    thisMonthFilterColor.value = 'grey-lighten-2'
    todayFilterColor.value = 'grey-lighten-2'
    allFilterColor.value = 'grey-lighten-2'

    thisMonthFilterActive.value = false;
    todayFilterActive.value = false
    allFilterActive.value = false
  } else if (type === 'month') {
    thisMonthFilterActive.value = true;

    thisMonthFilterColor.value = 'blue-lighten-2'
    yearFilterColor.value = 'grey-lighten-2'
    todayFilterColor.value = 'grey-lighten-2'
    allFilterColor.value = 'grey-lighten-2'

    thisYearFilterActive.value = false;
    todayFilterActive.value = false
    allFilterActive.value = false
  } else if (type === 'today') {
    todayFilterActive.value = true;

    thisMonthFilterColor.value = 'grey-lighten-2'
    yearFilterColor.value = 'grey-lighten-2'
    todayFilterColor.value = 'blue-lighten-2'
    allFilterColor.value = 'grey-lighten-2'

    thisYearFilterActive.value = false;
    thisMonthFilterActive.value = false
    allFilterActive.value = false
  } else {
    todayFilterActive.value = false
    thisMonthFilterActive.value = false
    thisYearFilterActive.value = false;
    allFilterActive.value = !thisMonthFilterActive.value && !todayFilterActive.value

    thisMonthFilterColor.value = 'grey-lighten-2'
    yearFilterColor.value = 'grey-lighten-2'
    todayFilterColor.value = 'grey-lighten-2'
    allFilterColor.value = 'blue-lighten-2'
  }
}

function filterButton(type) {
  toggleFilterButton(type);

  store.setForceUpdatePages(false);

  initProjects()
}

function doFilter(payload) {
  searchParam.value = payload;
  thisMonthFilterActive.value = false
  todayFilterActive.value = false
  allFilterActive.value = false

  thisMonthFilterColor.value = 'grey-lighten-2'
  todayFilterColor.value = 'grey-lighten-2'
  allFilterColor.value = 'grey-lighten-2'

  // clear button filter
  store.setProjectDurationFilter({
    month: thisMonthFilterActive.value,
    today: todayFilterActive.value,
    year: thisYearFilterActive.value,
  });

  store.setSearchParamProject(searchParam.value);

  store.setForceUpdatePages(false);
  store.setFilterData(true);

  initProjects();
  isShowFilter.value = false;
  showClearFilter.value = isHaveFilterData.value;
}

function cancelFilter() {
    searchParam.value = null;
    isShowFilter.value = false;
    showClearFilter.value = false;
}
</script>

<template>
    <div>
        <table-list
            :headers="headers"
            :items="listOfProjects"
            :totalItems="totalItems"
            :loading="loading"
            :itemsPerPage="itemsPerPage"
            :filterSearch="false"
            :showClearFilter="isHaveFilterData"
            :fullCustomBody="true"
            :custom-filter-button="true"
            :hasCheckbox="false"
            :btnAddText="$t('createProject')"
            :allowed-create-button="useCheckPermission('create_project')"
            :filter-tooltip="t('filterProject')"
            :show-filter-result="false"
            :custom-header="true"
            @table-event="initProjects"
            @filter-action="showFilter"
            @clear-filter-action="clearFilter">

            <template v-slot:headerTable="{ headers, isSorted, getSortIcon, toggleSort }">
                <tr>
                    <template v-for="(header, h) in headers[0]"
                    :key="h">
                    <th
                        v-if="header.available"
                        class="v-data-table__td v-data-table-column--align-start v-data-table__th--sortable v-data-table__th"
                        rowspan="1">
                        <span class="mr-2 cursor-pointer" @click="() => toggleSort(header)">{{ header.title }}</span>
                        <template v-if="isSorted(header)">
                            <v-icon :icon="getSortIcon(header)"></v-icon>
                        </template>
                        <v-icon v-if="header.removable" icon="$close" @click="() => remove(header.key)"></v-icon>
                    </th>
                    </template>
                </tr>                
            </template>

            <template v-slot:custom-filter-button>
                <v-btn
                variant="outlined"
                :color="thisMonthFilterColor"
                density="compact"
                @click.prevent="filterButton('month')">
                <v-icon
                    v-if="thisMonthFilterActive"
                    :icon="mdiCheckCircle"
                    size="15"
                    class="me-2"
                    color="success"></v-icon>
                {{ $t('thisMonth') }}
                </v-btn>

                <v-btn
                variant="outlined"
                :color="yearFilterColor"
                density="compact"
                @click.prevent="filterButton('year')">
                <v-icon
                    v-if="thisYearFilterActive"
                    :icon="mdiCheckCircle"
                    size="15"
                    class="me-2"
                    color="success"></v-icon>
                {{ $t('thisYear') }}
                </v-btn>

                <v-btn
                variant="outlined"
                :color="todayFilterColor"
                density="compact"
                @click.prevent="filterButton('today')">
                <v-icon
                    v-if="todayFilterActive"
                    :icon="mdiCheckCircle"
                    size="15"
                    class="me-2"
                    color="success"></v-icon>
                {{ $t('today') }}
                </v-btn>

                <v-btn
                variant="outlined"
                :color="allFilterColor"
                density="compact"
                @click.prevent="filterButton('all')">
                <v-icon
                    v-if="allFilterActive"
                    :icon="mdiCheckCircle"
                    size="15"
                    class="me-2"
                    color="success"></v-icon>
                {{ $t('all') }}
                </v-btn>
            </template>

            <template v-slot:filter-result>
                <v-chip density="compact" color="purple-darken-3"
                    :append-icon="mdiClose">
                </v-chip>
            </template>

            <template v-slot:bodytable="{ value }">
                <tr>
                    <template v-for="(header, hKey) in headers"
                        :key="hKey">
                        <td v-if="header.available">
                            <template v-if="header.key === 'name'">
                                <router-link
                                :to="'/admin/production/project/' + value.uid"
                                style="color: #000; font-weight: bold;">{{ value[header.key] }}</router-link>        
                            </template>
                            <template v-else-if="header.key === 'project_date'">
                                <p class="fw-bold">{{ value.project_date }}</p>
                            </template>
                            <template v-else-if="header.key === 'pic'">
                                <template v-if="value.no_pic">
                                    <v-chip
                                        density="compact"
                                        color="grey-lighten-1">
                                        {{ value.pic }}
                                    </v-chip>
                                </template>
                                <template v-else>
                                    {{ value.pic }}
                                </template>
                            </template>
                            <template v-else-if="header.key === 'status'">
                                <v-chip :color="value.status_color">
                                    {{ value.status }}
                                </v-chip>
                            </template>
                            <template v-else-if="header.key === 'led_area'">
                                <p class="fw-bold">{{ value.led_area }} m<sup>2</sup></p>
                            </template>
                            <template v-else-if="header.key === 'classification'">
                                <v-chip
                                    :color="value.event_class_color">
                                    {{ value.event_class }}
                                </v-chip>
                            </template>
                            <template v-else-if="header.key === 'songs'">
                                <v-chip
                                    v-if="!value.songs.length"
                                    size="small"
                                    color="red">
                                    0 Song
                                </v-chip>
                                <v-chip
                                    v-else
                                    size="small"
                                    color="info">
                                    {{ value.songs.length }} Songs
                                </v-chip>
                            </template>
                            <template v-else-if="header.key === 'number_of_equipments'">
                                <v-chip
                                    v-if="!value.number_of_equipments.length"
                                    size="small"
                                    color="red">
                                    0 {{ $t("equipments") }}
                                </v-chip>
                                <v-chip
                                    v-else
                                    size="small"
                                    color="info">
                                    {{ value.number_of_equipments.length }} {{ $t("equipments") }}
                                </v-chip>
                            </template>
                            <template v-else-if="header.key === 'uid'">
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
                                            class="pointer">
                                            <template v-slot:title>
                                                <router-link
                                                    :to="'/admin/production/project/' + value.uid"
                                                    style="color: #000; font-weight: bold;">
                                                    <div
                                                        class="d-flex align-center"
                                                        style="gap: 8px; font-size: 12px;">
                                                        <v-icon
                                                        :icon="mdiEyeCircle"
                                                        size="15"></v-icon>
                                                        {{ $t('detail') }}
                                                    </div>
                                                </router-link>
                                            </template>
                                        </v-list-item>
                                        <v-list-item
                                            class="pointer"
                                            v-if="!value.no_pic && useCheckPermission('assign_pic')"
                                            @click.prevent="showSubtitute(value.uid)">
                                            <template v-slot:title>
                                                <div
                                                    class="d-flex align-center"
                                                    style="gap: 8px; font-size: 12px;">
                                                    <v-icon
                                                    :icon="mdiSwapHorizontal"
                                                    size="15"></v-icon>
                                                    {{ $t('subtitutePic') }}
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </template>
                            <template v-else>
                                {{ value[header.key] }}
                            </template>
                        </td>
                    </template>
                </tr>
            </template>

        </table-list>

        <filter-project
            :show="isShowFilter"
            @filter-event="doFilter"
            @close-event="cancelFilter"></filter-project>
    </div>
</template>
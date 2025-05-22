<script setup>
import { useDashboardStore } from '@/stores/dashboard';
import { mdiArrowRight, mdiCalendarAlert, mdiDotsVertical, mdiEllipse } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, RadialLinearScale } from 'chart.js'
import { Doughnut, PolarArea } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import moment from 'moment';
import { computed } from 'vue';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, Title);
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Title);

const store = useDashboardStore();

const chartTitle = ref('');

const optionPolar = ref({
  responsive: true,
  maintainAspectRatio: true,
  onClick: (event, element, chart) => {
    console.log("check", element);
    selectedEmployee.value = employees.value[element[0].index].workload;
  },
  plugins: {
    title: {
      display: true,
      text: chartTitle
    }
  }
});

const dataPolar = ref({
  labels: [],
  datasets: [
    {
      label: 'Workload',
      backgroundColor: [],
      pointBackgroundColor: 'rgba(255,99,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)',
      data: []
    }
  ]
});

async function getWorkload() {
  loading.value = true;
  let param = {
    month: selectedMonth.value
  }
  const resp = await store.getEntertainmentSongWorkload(param);
  loading.value = false;

  if (resp.status < 300) {
    employees.value = resp.data.data.employees;
    dataPolar.value = resp.data.data.chart.data;
    isChartEmpty.value = resp.data.data.is_empty;
    chartTitle.value = resp.data.data.chart_title;
  }
}

const show = ref(false);

const loading = ref(false);

const menu = ref(false);

const selectedMonth = ref(null);

const selectedEmployee = ref([]);

const chooseDate = (value) => {
  selectedMonth.value = moment(value.year + '-' + (parseInt(value.month) + 1) + '-01', 'YYYY-MM-DD').format('YYYY-MM');
  datePickerRef.value.closeMenu();
  menu.value = false;
  show.value = false;
  getWorkload();
  selectedEmployee.value = [];
}

const isMenuOpen = async (value) => {
  if (value) {
    await nextTick();
    datePickerRef.value.openMenu();
  }
}

const isChartEmpty = ref(true);

const datePickerRef = ref(null);

const headers = ref([
  { title: 'Project', align: 'start', key: 'name' },
  { title: 'Song', align: 'end', key: 'speed' }
]);

const employees = ref([]);

const tableRows = computed(() => {
  let rows = []
  selectedEmployee.value.forEach((project, projectIndex) => {
    project.totalSongs = project.songs.length
    project.songs.forEach((song, songIndex) => {
      rows.push({
        id: `${projectIndex}-${songIndex}`,
        song,
        project,
        isFirstInGroup: songIndex === 0
      })
    })
  })
  return rows
})

onMounted(() => {
    getWorkload();
});
</script>

<template>
    <master-card style="transition: height 2s" class="mt-5">
        <v-card-item>
            <v-card-title class="d-flex align-center justify-space-between">
              {{ $t("entertainmentWorkload") }}

              <!-- filter by month and year -->
              <v-menu
                v-model="menu"
                @update:model-value="isMenuOpen"
                :close-on-content-click="false"
                location="end">
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="plain"
                    v-bind="props">
                    <v-icon :icon="mdiDotsVertical"></v-icon>
                  </v-btn>
                </template>

                <v-card min-width="300" min-height="380">
                  <v-card-text>
                    <label for="">Choose Month</label>
                    <vue-date-picker class="mt-1"
                      ref="datePickerRef"
                      v-model="selectedMonth"
                      month-picker
                      :month-change-on-scroll="false"
                      always-clearable
                      :auto-apply="true"
                      @update:model-value="chooseDate"></vue-date-picker>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-card-title>
        </v-card-item>

        <v-card-text>
          <template v-if="!isChartEmpty">
            <v-row style="height: 100%; max-height: 500px;">
              <v-col sm="12" :md="selectedEmployee.length ? '6' : '12'">
                <template v-if="loading">
                  <v-skeleton-loader type="list-item-two-line" class="mb-2" width="100%" height="50"></v-skeleton-loader>
                  <v-skeleton-loader type="ossein" width="100%" height="200"></v-skeleton-loader>
                </template>
                <template v-else>
                  <div style="width: 100%; height: 100%;" :class="{
                    'center-chart': !selectedEmployee.length
                  }">
                    <PolarArea :data="dataPolar" :options="optionPolar" :class="{
                      'full': selectedEmployee.length
                    }" class="chart-song" />
                  </div>
                </template>
              </v-col>

              <v-col sm="12" md="6" lg="6" v-if="selectedEmployee.length">
                <v-data-table-virtual
                  :headers="headers"
                  :items="tableRows"
                  height="400"
                  item-value="name"
                  fixed-header
                >
                  <template v-slot:item="{ item }">
                    <tr :style="{
                      fontSize: '12px'
                    }">
                      <td v-if="item.isFirstInGroup" :rowspan="item.project.totalSongs" class="text-center" :style="{
                        fontWeight: 'bold'
                      }">
                        <span>{{ item.project.name }}</span><br>
                        <span>{{ item.project.project_date }}</span>
                      </td>
                      <td class="text-end">
                        {{ item.song }}
                      </td>
                    </tr>
                  </template>
                </v-data-table-virtual>
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <v-empty-state
              title="All VJs don't have a schedule yet"
              :icon="mdiCalendarAlert"
              ></v-empty-state>
          </template>
        </v-card-text>
    </master-card>
</template>

<style lang="scss">
.chart-song {
  height: auto !important;
  width: 50% !important;
}

.chart-song.full {
  width: 100% !important;
}

.center-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

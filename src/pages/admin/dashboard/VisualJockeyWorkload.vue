<script setup>
import { useDashboardStore } from '@/stores/dashboard';
import { mdiArrowRight, mdiCalendarAlert, mdiDotsVertical, mdiEllipse } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import moment from 'moment';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, Title);

const store = useDashboardStore();

const dataDonut = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: []
    },
  ],
});

const employeeDetail = ref([]);

const selectedEmployee = ref([]);

const chartTitle = ref('01 May - 31 May 2025')

const optionDonut = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    datalabels: {
      color: '#000',
      formatter: (value, index) => {
        const label = dataDonut.value.labels[index.dataIndex];
        return value == 0 ? '' : label + ' - ' + value;
      }
    },
    title: {
      display: true,
      text: chartTitle,
    },
  },
  onClick: (event, element, chart) => {
    if (element.length) {
      let index = element[0].index
      selectedEmployee.value = employeeDetail.value[index].workload;
      show.value = true;
    }
  }
})

async function getWorkload() {
  loading.value = true;
  let param = {
    month: selectedMonth.value
  }
  const resp = await store.getVjWorkload(param);
  loading.value = false;

  if (resp.status < 300) {
    chartTitle.value = resp.data.data.chartTitle;
    dataDonut.value.labels = resp.data.data.chartData.labels;
    dataDonut.value.datasets = resp.data.data.chartData.datasets;
    isChartEmpty.value = resp.data.data.isEmpty;
    employeeDetail.value = resp.data.data.employees;
  }
}

const show = ref(false);

const loading = ref(false);

const menu = ref(false);

const selectedMonth = ref(null);

const chooseDate = (value) => {
  selectedMonth.value = moment(value.year + '-' + (parseInt(value.month) + 1) + '-01', 'YYYY-MM-DD').format('YYYY-MM');
  datePickerRef.value.closeMenu();
  menu.value = false;
  getWorkload();
}

const isMenuOpen = async (value) => {
  if (value) {
    await nextTick();
    datePickerRef.value.openMenu();
  }
}

const isChartEmpty = ref(true);

const datePickerRef = ref(null);

onMounted(() => {
    getWorkload();
});
</script>

<template>
    <master-card style="transition: height 2s">
        <v-card-item>
            <v-card-title class="d-flex align-center justify-space-between">
              {{ $t("visualJockeyWorkload") }}

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
            <v-row style="height: 100%;">
              <v-col sm="12" md="12">
                <template v-if="loading">
                  <v-skeleton-loader type="list-item-two-line" class="mb-2" width="100%" height="50"></v-skeleton-loader>
                  <v-skeleton-loader type="ossein" width="100%" height="200"></v-skeleton-loader>
                </template>
                <template v-else>
                  <div style="width: 100%; height: 100%;">
                    <Doughnut :data="dataDonut" :options="optionDonut" />
                  </div>
                </template>
              </v-col>

              <v-col sm="12" md="12" lg="12" v-if="show && selectedEmployee.length">
                <v-list lines="two">
                  <v-virtual-scroll
                    :max-height="300"
                    :items="selectedEmployee">
                    <template v-slot:default="{ item, index }">
                      <v-list-item>
                        <template v-slot:title>
                          <p>{{ item.name }}</p>
                        </template>

                        <template v-slot:subtitle>
                          <div class="ps-1 mt-1">
                            <div style="font-size: 12px;">{{ item.pic }}</div>
                          </div>
                        </template>

                        <template v-slot:append>
                          <v-chip
                            size="small"
                            color="primary">
                            {{ item.project_date }}
                          </v-chip>
                        </template>

                      </v-list-item>

                      <v-divider v-if="index != parseInt(selectedEmployee.length) - 1"></v-divider>
                    </template>
                  </v-virtual-scroll>
                </v-list>
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

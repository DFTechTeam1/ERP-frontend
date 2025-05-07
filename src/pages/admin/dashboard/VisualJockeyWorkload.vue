<script setup>
import { useDashboardStore } from '@/stores/dashboard';
import { mdiArrowRight, mdiCalendarAlert } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { Doughnut } from 'vue-chartjs';

const store = useDashboardStore();

const {
    listOfProjectSongs
} = storeToRefs(store);

async function getProjectSong() {
    await store.getProjectSong();
}

const polarSeries = ref([3,5,2,2]);
const polarOptions = ref({
  chart: {
    type: 'donut',
    events: {
      dataPointSelection: function (event, chartContext, config) {
        alert('oke')
        console.log('Clicked index:', config.dataPointIndex);
        console.log('Clicked label:', chartContext.w.globals.labels[config.dataPointIndex]);
      }
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return polarSeries.value[opts.seriesIndex] + ' Events'
    }
  },
  labels: ['Dhio', 'Nyoman', 'Mia', 'Dava'],
  legend: {
    show: true,
    position: 'top'
  }
});

const selectedEmployee = ref([
  {
    id: 1,
    name: "Mr. Tan Yi Hang & Ms. Sim Yi Ting",
    project_date: "21 February 2025",
    pic: "Rudhi, Nando, Edwin, Yanuar"
  },
  {
    id: 2,
    name: "Mr. Tan Yi Hang & Ms. Sim Yi Ting",
    project_date: "21 February 2025",
    pic: "Rudhi, Nando, Edwin, Yanuar"
  },
  {
    id: 3,
    name: "Mr. Tan Yi Hang & Ms. Sim Yi Ting",
    project_date: "21 February 2025",
    pic: "Rudhi, Nando, Edwin, Yanuar"
  },
  {
    id: 3,
    name: "Mr. Tan Yi Hang & Ms. Sim Yi Ting",
    project_date: "21 February 2025",
    pic: "Rudhi, Nando, Edwin, Yanuar"
  },
  {
    id: 3,
    name: "Mr. Tan Yi Hang & Ms. Sim Yi Ting",
    project_date: "21 February 2025",
    pic: "Rudhi, Nando, Edwin, Yanuar"
  },
  {
    id: 3,
    name: "Mr. Tan Yi Hang & Ms. Sim Yi Ting",
    project_date: "21 February 2025",
    pic: "Rudhi, Nando, Edwin, Yanuar"
  },
  {
    id: 3,
    name: "Mr. Tan Yi Hang & Ms. Sim Yi Ting",
    project_date: "21 February 2025",
    pic: "Rudhi, Nando, Edwin, Yanuar"
  },
]);

const show = ref(true);

onMounted(() => {
    getProjectSong();
});
</script>

<template>
    <master-card style="height: 400px">
        <v-card-item>
            <v-card-title class="d-flex align-center justify-space-between">
              {{ $t("visualJockeyWorkload") }}
            </v-card-title>
        </v-card-item>

        <v-card-text style="height: 350px">
          <template v-if="listOfProjectSongs.length">
            <v-row style="height: 100%;">
              <v-col sm="12" :md="show ? '6' : '12'" :lg="show ? '6' : '12'">
                <div style="width: 100%; height: 100%;">
                  <apexchart type="donut" :options="polarOptions" :series="polarSeries" width="100%" height="100%"></apexchart>
                  <!-- <Doughnut /> -->
                </div>
              </v-col>

              <v-col sm="12" md="6" lg="6">
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
              title="You have project ahead"
              :icon="mdiCalendarAlert"
              ></v-empty-state>
          </template>
        </v-card-text>
    </master-card>
</template>

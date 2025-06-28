<template>
    <div>
        <v-row>
          <v-col cols="12" md="8">
            <v-card
                width="100%"
                class="card-primary card-greeting card-h-200 card-dashboard mb-5">
                <template v-slot:title>
                    <v-row
                        align-content="center">
                        <v-col
                            md="6"
                            cols="12">
                                <div class="d-flex align-items-center"
                                  style="gap: 10px;">
                                  <v-avatar
                                    class="header-account"
                                    size="46">
                                    <v-img
                                    src="/user.png"
                                    alt="user"></v-img>
                                  </v-avatar>
                                  <span class="greeting-text">
                                      {{ $t('welcomeBack') }} {{ username }}!
                                  </span>
                                </div>

                                <div class="d-flex align-items-center greeting-project">
                                  <template v-if="loading">
                                    <div class="wrapper-info w-50 bg-transparent">
                                      <v-skeleton-loader type="list-item-two-line" class="bg-transparent"></v-skeleton-loader>
                                    </div>
                                    <div class="wrapper-info w-50 bg-transparent">
                                      <v-skeleton-loader type="list-item-two-line" class="bg-transparent"></v-skeleton-loader>
                                    </div>
                                  </template>
                                  <template v-else>
                                      <template
                                        v-for="(report, r) in listOfReports.left"
                                        :key="r">
                                        <div class="wrapper-info">
                                            <p class="value position-relative">
                                              <template v-if="report.is_hide_nominal && hideNominal">
                                                ***********
                                              </template>
                                              <template v-else>
                                                {{ report.value }}
                                              </template>

                                              <template v-if="report.is_hide_nominal != undefined">
                                                <v-icon
                                                  v-if="report.is_hide_nominal"
                                                  :icon="mdiEyeOffOutline"
                                                  class="icon-eye"
                                                  @click.prevent="changeAvailability(report, false)"
                                                  size="15"></v-icon>

                                                <v-icon
                                                  v-if="!report.is_hide_nominal"
                                                  :icon="mdiEyeOutline"
                                                  class="icon-eye"
                                                  @click.prevent="changeAvailability(report, true)"
                                                  size="15"></v-icon>
                                              </template>
                                            </p>
                                            <p class="text">
                                                {{ report.text }}
                                            </p>
                                        </div>
                                        <v-divider v-if="r == 0" :vertical="true" inset></v-divider>
                                      </template>
                                    </template>
                                </div>
                        </v-col>

                        <v-col
                            md="6"
                            cols="12">
                            <v-img
                                class="greeting-image"
                                src="/dashboard.svg"></v-img>
                        </v-col>
                    </v-row>
                </template>
            </v-card>

            <calendar-event />

            <!-- MAIN INTERNAL REPORT -->
            <project-timeline-report v-if="enableReportingChart"></project-timeline-report>

            <project-timeline-per-pic v-if="enableReportingChart"></project-timeline-per-pic>
            <!-- END MAIN INTERNAL REPORT -->

            <entertainment-workload v-if="useGetRole() == BaseRole.ProjectManagerEntertainment || useGetRole() == BaseRole.ProjectManagerAdmin || useGetRole() == BaseRole.Root || useGetRole() == BaseRole.Director"></entertainment-workload>
          </v-col>
          <v-col cols="12" md="4">
            <v-row v-if="useGetRole() == BaseRole.ProjectManagerEntertainment || useGetRole() == BaseRole.ProjectManagerAdmin || useGetRole() == BaseRole.Root || useGetRole() == BaseRole.Director">
              <v-col cols="12">
                <visual-jockey-workload></visual-jockey-workload>
              </v-col>
            </v-row>
            <template v-if="listOfReports.right">
                <v-row>
                    <v-col
                        md="6"
                        cols="12"
                        v-for="(right, rt) in listOfReports.right"
                        :key="rt">
                        <v-card
                            density="default"
                            width="100%"
                            variant="elevated"
                            class="card-project-chart card-h-200 card-dashboard">
                            <template v-if="right.value == 0">
                                <v-card-text class="d-flex align-center justify-center h-100">
                                    <div class="text-center">
                                        <p class="value">
                                            {{ right.value }}
                                        </p>
                                        <p class="text">
                                            {{ right.text }}
                                        </p>
                                    </div>
                                </v-card-text>
                            </template>
                            <template v-else>
                                <v-card-item>
                                    <v-card-title>
                                        <p class="value">
                                            {{ right.value }}
                                        </p>
                                        <p class="text">
                                            {{ right.text }}
                                        </p>
                                    </v-card-title>
                                </v-card-item>

                                <v-card-text>
                                    <apexchart height="120" type="donut" :options="right.options" :series="right.series"></apexchart>
                                </v-card-text>
                            </template>
                        </v-card>
                    </v-col>

                    <v-col
                        cols="12"
                        md="12"
                        v-if="useGetRole() == BaseRole.ProjectManager || useGetRole() == BaseRole.ProjectManagerAdmin || useGetRole() == BaseRole.Root || useGetRole() == BaseRole.Director">
                        <project-need-complete />
                    </v-col>
                </v-row>
            </template>
            <template v-else>
                <v-row>
                    <v-col
                        cols="12"
                        md="12">
                        <project-deadline />
                    </v-col>

                    <v-col
                        cols="12"
                        md="12"
                        v-if="useGetRole() == BaseRole.Entertainment || useGetRole() == BaseRole.ProjectManagerEntertainment || useGetRole() == BaseRole.Root || useGetRole() == BaseRole.Director">
                        <project-song />
                    </v-col>

                    <v-col
                        cols="12"
                        md="12"
                        v-if="useGetRole() == BaseRole.ProjectManager || useGetRole() == BaseRole.ProjectManagerAdmin || useGetRole() == BaseRole.Root || useGetRole() == BaseRole.Director">
                        <project-need-complete />
                    </v-col>
                </v-row>
            </template>

            <div v-if="listOfReports.right"
                class="mt-5">
                <project-deadline />
            </div>
          </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import ProjectDeadline from './ProjectDeadline.vue'
import ProjectSong from './ProjectSong.vue';
import ProjectTimelineReport from './ProjectTimelineReport.vue';
import ProjectTimelinePerPic from './ProjectTimelinePerPic.vue';
import { useBreakToken } from '@/compose/breakToken';
import { useDashboardStore } from '@/stores/dashboard';
import { storeToRefs } from 'pinia';
import { mdiArrowRight, mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { useGetRole } from '@/compose/getRole';
import BaseRole from '@/enums/system/BaseRole';
import ProjectNeedComplete from './ProjectNeedComplete.vue';
import { useProjectStore } from '@/stores/project';
import VisualJockeyWorkload from './VisualJockeyWorkload.vue';
import EntertainmentWorkload from './EntertainmentWorkload.vue';

const store = useDashboardStore()

const storeProject = useProjectStore();

const { listOfReports } = storeToRefs(store)

const username = ref('')

const loading = ref(false)

const enableReportingChart = ref(false);

async function getReport() {
    loading.value = true
    await store.getReport()
    loading.value = false
}

function changeAvailability(data, target) {
  console.log("data", data);

  listOfReports.value.left.map((item) => {
    if (item.text === data.text) {
      item.is_hide_nominal = target;
    }

    return item;
  });
}

async function initProjectsToBeCompleted() {
    await storeProject.getProjectNeedToBeComplete();
}

onMounted(() => {
    var user = useBreakToken('user')
    username.value = user.employee ? user.employee.name : 'admin'

    getReport();
    initProjectsToBeCompleted();
})

const hideNominal = ref(true);
</script>

<style lang="scss" scoped>
.card-dashboard {
    border-radius: 10px;
}

.card-project-chart {
    .value {
        font-size: 28px;
        line-height: 1;
        font-weight: bold;
    }

    .text {
        font-size: 14px;
    }
}
.card-h-200 {
    height: 200px;
    box-shadow: #919eab4d 0 0 2px,#919eab1f 0 12px 24px -4px!important;;
}
@media screen and (max-width: 600px) {
    .card-h-200 {
        height: auto !important;
    }
}
.card-primary {
    background-color: rgb(236, 242, 255);
    box-shadow: none !important;
}
.greeting-text {
    line-height: 1.5;
    text-wrap: wrap;
}
.greeting-project {
    margin-top: 15px;
    gap: 25px;

    .wrapper-info {

        .value {
            font-size: 18px;
            font-weight: bold !important;
        }

        .text {
            font-weight: 400 !important;
            font-size: 14px;
        }
    }
}
</style>

<style lang="scss">
.card-greeting .v-card-item {
    padding-bottom: 0 !important;
    padding-top: 2rem !important;
}

.icon-eye {
  position: absolute;
  top: -8px;
  right: -15px;
  cursor: pointer;
}
</style>

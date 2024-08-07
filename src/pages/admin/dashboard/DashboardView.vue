<template>
    <div>
        <v-row
            align-content="center">
            <v-col
                cols="12"
                md="8">
                <!-- <select v-model="$i18n.locale">
                    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
                  </select> -->
                <v-card
                    width="100%"
                    class="card-primary card-greeting card-h-200 card-dashboard">
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
                                            Welcome Back {{ username }}!
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
                                                    <p class="value">
                                                        {{ report.value }}
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
            </v-col>

            <template v-if="loading">
                <v-col
                    md="2"
                    cols="12">
                    <v-skeleton-loader type="card"></v-skeleton-loader>
                </v-col>
                <v-col
                    md="2"
                    cols="12">
                    <v-skeleton-loader type="card"></v-skeleton-loader>
                </v-col>
            </template>
            <template v-else>
                <v-col
                    md="2"
                    cols="12"
                    v-for="(right, rt) in listOfReports.right"
                    :key="rt">
                    <v-card
                        density="default"
                        width="100%"
                        variant="elevated"
                        class="card-project-chart card-h-200 card-dashboard">
                        <template v-slot:title>
                            <p class="value">
                                {{ right.value }}
                            </p>
                            <p class="text">
                                {{ right.text }}
                            </p>
                        </template>
    
                        <template v-slot:text>
                            <apexchart height="150" type="donut" :options="right.options" :series="right.series"></apexchart>
                        </template>
                    </v-card>
                </v-col>
            </template>

            <!-- <v-col
                md="2"
                cols="12">
                <v-card
                    density="default"
                    width="100%"
                    variant="elevated"
                    class="card-project-chart card-h-200 card-dashboard">
                    <template v-slot:title>
                        <p class="value">100</p>
                        <p class="text">Total Projects</p>
                    </template>

                    <template v-slot:text>
                        <apexchart height="150" type="donut" :options="options" :series="series"></apexchart>
                    </template>
                </v-card>
            </v-col> -->
        </v-row>

        <v-row>
            <!-- Calendar -->
            <v-col
                cols="12"
                md="8">
                <calendar-event />
            </v-col>
            <!-- End Calendar -->

            <v-col
                cols="12"
                md="4">
                <project-deadline />
            </v-col>
        </v-row>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import CalendarEvent from './CalendarEvent.vue'
import ProjectDeadline from './ProjectDeadline.vue'
import { useBreakToken } from '@/compose/breakToken';
import { useDashboardStore } from '@/stores/dashboard';
import { storeToRefs } from 'pinia';

const store = useDashboardStore()

const { listOfReports } = storeToRefs(store)

const username = ref('')

const loading = ref(false)

async function getReport() {
    loading.value = true
    await store.getReport()
    loading.value = false
}

onMounted(() => {
    username.value = useBreakToken('user').employee.name

    getReport()
})
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
            font-size: 22px;
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
</style>
  
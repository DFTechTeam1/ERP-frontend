<script setup>
import { showNotification } from '@/compose/notification';
import { useDashboardStore } from '@/stores/dashboard';
import { useEmployeesStore } from '@/stores/employees';
import { mdiClose, mdiDotsVertical } from '@mdi/js';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const store = useDashboardStore();

const {
    dataProjectClassTimeline
} = storeToRefs(store);

const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: !mobile.value,
        formatter: function(val, { seriesIndex, dataPointIndex, w }) {
            if (val != undefined) {
                if (seriesData.value[seriesIndex].raw[dataPointIndex] != undefined) {
                    return `${seriesData.value[seriesIndex].raw[dataPointIndex].day}d ${seriesData.value[seriesIndex].raw[dataPointIndex].hour}h ${seriesData.value[seriesIndex].raw[dataPointIndex].minute}m`;
                }
            }
        },
        style: {
            fontSize: '12px',
            colors: ['#000'],
        },
        textAnchor: 'middle',
    },
    xaxis: {
        categories: [],
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'right',
        offsetX: 0,
        offsetY: 50
    },
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
            }
        }
    }],
    tooltip: {
        enabled: true,
        custom: ({series, seriesIndex, dataPointIndex}) => {

            let val = `${seriesData.value[seriesIndex].raw[dataPointIndex].day}d ${seriesData.value[seriesIndex].raw[dataPointIndex].hour}h ${seriesData.value[seriesIndex].raw[dataPointIndex].minute}m`;

            return `<div class="main-chart-tooltip">
                <div class="header-tooltip">${seriesData.value[seriesIndex].name}</div>
                <div class="body-tooltip">
                    <span class="body-tooltip__title">Average Time: </span> ${val}
                </div>
                <div class="body-tooltip">
                    <span class="body-tooltip__title">Total Project: </span> ${seriesData.value[seriesIndex].raw[dataPointIndex].total_project}
                </div>
            </div>`;
        }
    }
});

const seriesData = ref([]);

const filterType = ref('monthly');

const menu = ref(false);

const formatResponseToChartData = () => {
    const availableSeries = [
        { name: 'S (Spesial)', data: [], raw: [] },
        { name: 'A (besar)', data: [], raw: [] },
        { name: 'B (Standard)', data: [], raw: [] },
        { name: 'C (Budget)', data: [], raw: [] },
        { name: 'D (Template)', data: [], raw: [] }
    ];

    // Create categories (month labels)
    const categories = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Process each month
    dataProjectClassTimeline.value.forEach(month => {
        // Add month label (e.g., "Jan 2025")
        if (filterType.value == 'monthly') {
            categories.push(`${monthNames[month.id - 1]} ${month.year}`);
        } else {
            categories.push(`Q${month.id}`);
        }
        
        // Initialize totals for percentage calculation
        const monthTotals = {};
        
        // First pass: calculate total execution time per month
        month.details.forEach(detail => {
            if (!monthTotals[detail.classification]) {
                monthTotals[detail.classification] = 0;
            }
            monthTotals[detail.classification] += detail.avg_execution_time_in_seconds * detail.total_project;
        });

        // Second pass: calculate percentages for each classification
        availableSeries.forEach(series => {
            const foundDetail = month.details.find(d => d.classification === series.name);
            
            if (foundDetail) {
                series.data.push(foundDetail.avg_execution_time_in_seconds);
                series.raw.push({
                    avg_execution_time_in_seconds: foundDetail.avg_execution_time_in_seconds,
                    day: foundDetail.day,
                    hour: foundDetail.hour,
                    minute: foundDetail.minute,
                    second: foundDetail.second,
                    total_project: foundDetail.total_project,
                });
            } else {
                // Push 0 if classification doesn't exist in this month
                series.data.push(0);
                series.raw.push({
                    avg_execution_time_in_seconds: null,
                    day: null,
                    hour: null,
                    minute: null,
                    second: null,
                })
            }
        });
    });

    seriesData.value = availableSeries;

    chartOptions.value.xaxis.categories = categories;
}

const datePickerRef = ref(null);

const date_filter = ref(null);

const loading = ref(false);

const filterIsOpen = async (values) => {
    await nextTick();
    if (values) {
        datePickerRef.value.openMenu();
    }
};

const closeFilter = async ({forceClose} = {forceClose: false}) => {
    if (forceClose) menu.value = false;

    if (date_filter.value) {
        // validation
        if (!date_filter.value[1] || !date_filter.value[0]) {
            return showNotification('Please choose a month / quartal range', 'error');
        }
    
        // setup payload
        if (date_filter.value) {
            let payload = {
                start_month: null,
                end_month: null,
                start_quartal: null,
                end_quartal: null,
                start_year: null,
                end_year: null,
                range_type: 'momth'
            };
    
            // do filter
            if (filterType.value == 'monthly') {
                payload.start_month = date_filter.value[0].month + 1;
                payload.end_month = date_filter.value[1].month + 1;
                payload.start_year = date_filter.value[0].year;
                payload.end_year = date_filter.value[1].year;
                payload.range_type = 'month';
            } else {
                const [startDate, endDate] = date_filter.value;
    
                // Get quarter for start date
                const startQuarter = Math.floor((startDate.getMonth() + 3) / 3);
                const startYear = startDate.getFullYear();
                
                // Get quarter for end date
                const endQuarter = Math.floor((endDate.getMonth() + 3) / 3);
                const endYear = endDate.getFullYear();
                
                payload.start_quartal = startQuarter;
                payload.end_quartal = endQuarter;
                payload.start_year = startYear;
                payload.end_year = endYear;
                payload.range_type = 'quartal';
            }
    
            // do filtering
            loading.value = true;
            const resp = await store.getGlobalProjectTimeline(payload);
            loading.value = false;

            if (resp.status < 300) {
                menu.value = false;
                date_filter.value = null;
                formatResponseToChartData();
            }
        }
    }
};

const changeFilterType = (type) => {
    filterType.value = type;

    // reset
    date_filter.value = null;
    datePickerRef.value.closeMenu();
    datePickerRef.value.openMenu();
}

const filterChart = () => {
    closeFilter();
};

const prepareData = async () => {
    loading.value = true;
    await Promise.all([
        closeFilter()
    ]);
    loading.value = false;
}

onMounted(() => {
    formatResponseToChartData();

    // init reporting
    date_filter.value = [
        {month: 0, year: moment().format('YYYY')},
        {month: 11, year: moment().format('YYYY')},
    ];
    filterType.value = 'monthly';

    prepareData();
});
</script>

<template>
    <master-card style="transition: height 2s" class="mt-5">
        <v-card-item>
            <v-card-title class="d-flex align-center justify-space-between">
                {{ $t("averageTaskExecution") }}

                <!-- filter by month and year -->
                 <v-btn
                    variant="plain">
                    <v-icon :icon="mdiDotsVertical"></v-icon>

                    <v-menu
                        v-model="menu"
                        :persistent="true"
                        :close-on-content-click="false"
                        :close-on-back="false"
                        @update:model-value="filterIsOpen"
                        activator="parent"
                        location="end">
    
                        <master-card width="600" height="500">
                            <v-card-item>
                                <v-card-title :style="{
                                    fontSize: '13px'
                                }"
                                class="d-flex justify-space-between align-center">
                                    Filter Data
    
                                    <v-icon :icon="mdiClose" color="red"
                                        class="pointer"
                                        @click.stop.prevent="closeFilter({forceClose: true})"></v-icon>
                                </v-card-title>
                            </v-card-item>
                            <v-card-text :style="{
                                padding: '8px 12px'
                            }">
                                <div class="d-flex bg-grey-lighten-2 w-100"
                                    :style="{
                                        padding: '4px',
                                        borderRadius: '6px'
                                    }">
                                    <v-btn density="compact"
                                        variant="flat"
                                        class="w-50"
                                        @click.prevent="changeFilterType('monthly')"
                                        :color="filterType == 'monthly' ? 'light' : 'grey-lighten-2'">
                                        Monthly
                                    </v-btn>
                                    <v-btn density="compact"
                                        variant="flat"
                                        class="w-50"
                                        @click.prevent="changeFilterType('quartal')"
                                        :color="filterType == 'quartal' ? 'light' : 'grey-lighten-2'">
                                        Quartal
                                    </v-btn>
                                </div>
    
                                <VueDatePicker
                                    :month-picker="filterType == 'monthly' ? true : false"
                                    :quarter-picker="filterType == 'quartal' ? true : false"
                                    class="mt-5"
                                    ref="datePickerRef"
                                    multi-calendars
                                    v-model="date_filter"
                                    @closed="filterChart"
                                    range></VueDatePicker>
                            </v-card-text>
                        </master-card>
                    </v-menu>
                </v-btn>
            </v-card-title>
        </v-card-item>
        <v-card-text>
            <template v-if="loading">
                <div class="d-flex" :style="{
                    gap: '12px',
                    alignItems: 'flex-end',
                    padding: '0 40px'
                }">
                    <v-skeleton-loader type="ossein" width="30" height="300"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="150"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="250"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="200"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="200"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="300"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="300"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="300"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="100"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="120"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="220"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="280"></v-skeleton-loader>
                    <v-skeleton-loader type="ossein" width="30" height="240"></v-skeleton-loader>
                </div>
            </template>
            <apexchart
                v-else
                type="bar" height="350" :options="chartOptions" :series="seriesData"></apexchart>
        </v-card-text>
    </master-card>
</template>

<style lang="scss">
.main-chart-tooltip {
    .header-tooltip {
        padding: 4px 8px;
        border-bottom: 1px solid #e6e6e6;
        background-color: #f6f6f6;
    }
    
    .body-tooltip {
        padding: 4px 8px;
        background-color: #fff;
        font-size: 12px;
    }
}
</style>
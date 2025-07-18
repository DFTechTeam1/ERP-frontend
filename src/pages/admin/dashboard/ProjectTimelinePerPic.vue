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

const employeeStore = useEmployeesStore();

const {
    listOfAllEmployees
} = storeToRefs(employeeStore);

const {
    dataProjectClassTimelinePerPic
} = storeToRefs(store);

const date_filter = ref(null);

const employee_id = ref(null);

const chartRef = ref(null);

const chartOptions = ref({
    chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: !mobile.value,
        formatter: function(val, { seriesIndex, dataPointIndex, w }) {
            if (val != undefined) {
                if (seriesData.value[seriesIndex].raw[dataPointIndex] != undefined) {
                    return `${seriesData.value[seriesIndex].raw[dataPointIndex].day}d`;
                }
            }
            return val;
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
    yaxis: {
        title: {
            text: employee_id.value ? employee_id.value.title : '',
            style: {
                fontSize: '12px'
            }
        },
        labels: {
            formatter: function(val) {
                return `${val.toFixed(0)}%`;
            }
        },
        max: 100
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
            </div>`;
        }
    }
});

const seriesData = ref([]);

const filterType = ref('monthly');

const menu = ref(false);

const employeeDataMap = ref({});

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
    dataProjectClassTimelinePerPic.value.forEach(month => {
        // Add month label (e.g., "Jan 2025")
        if (filterType.value == 'monthly') {
            categories.push(`${monthNames[month.id - 1]} ${month.year}`);
        } else {
            categories.push(`Q${month.id}`);
        }

        // Second pass: calculate percentages for each classification
        availableSeries.forEach(series => {
            const foundDetail = month.details.find(d => d.classification === series.name);
            
            if (foundDetail) {
                series.data.push(foundDetail.average_execution_time);
                series.raw.push({
                    average_execution_time: foundDetail.average_execution_time,
                    day: foundDetail.days,
                    hour: foundDetail.hours,
                    minute: foundDetail.minutes,
                    second: foundDetail.seconds,
                });
            } else {
                // Push 0 if classification doesn't exist in this month
                series.data.push(0);
                series.raw.push({
                    average_execution_time: null,
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

    if (employee_id.value) {
        chartOptions.value.yaxis = {
            title: {
                text: employee_id.value.title,
                style: {
                    fontSize: '12px'
                }
            },
        };
    }
}

const datePickerRef = ref(null);

const loading = ref(false);

const filterIsOpen = async (values) => {
    await nextTick();
    if (values) {
        datePickerRef.value.openMenu();
    }
};

const closeFilter = async ({forceClose} = {forceClose: false}) => {
    if (forceClose) menu.value = false;
    console.log('employee_id', employee_id.value);
    if (date_filter.value && employee_id.value) {
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
                range_type: 'momth',
                uid: employee_id.value.value
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
            const resp = await store.getGlobalProjectTimelinePerPic(payload);
            loading.value = false;

            if (resp.status < 300) {
                // menu.value = false;
                // date_filter.value = null;
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
}

const getAllLed = async () => {
    await employeeStore.getAll({min_level: 'staff'});
};

const prepareData = async () => {
    loading.value = true;
    await Promise.all([
        getAllLed(),
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
                {{ $t("averageTaskExecutionPerPIC") }}

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
    
                                <field-input
                                    input-type="select"
                                    label="Choose PIC"
                                    v-model="employee_id"
                                    :select-options="listOfAllEmployees"
                                    item-title="title"
                                    class="mt-5"
                                    density="compact"
                                    :is-return-object="true"
                                    item-value="value"></field-input>

                                <VueDatePicker
                                    :month-picker="filterType == 'monthly' ? true : false"
                                    :quarter-picker="filterType == 'quartal' ? true : false"
                                    ref="datePickerRef"
                                    multi-calendars
                                    v-model="date_filter"
                                    label="Choose Time Range"
                                    range></VueDatePicker>
                            </v-card-text>

                            <v-card-actions class="pl-3">
                                <div class="d-flex justify-end w-100">
                                    <v-btn
                                        variant="flat"
                                        color="primary"
                                        type="button"
                                        @click.prevent="closeFilter({forceClose: true})">
                                        Search
                                    </v-btn>
                                </div>
                            </v-card-actions>
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
                ref="chartRef"
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
<template>
    <div>
        <v-row
            align-content="center">
            <v-col
                cols="12"
                md="8">
                <v-card
                    width="100%"
                    class="card-primary card-greeting card-h-200">
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
                                            size="46"
                                            v-bind="props">
                                            <v-img
                                            src="/user.png"
                                            alt="user"></v-img>
                                        </v-avatar>
                                        <span class="greeting-text">
                                            Welcome Back Ilham Meru Gumilang!
                                        </span>
                                    </div>

                                    <div class="d-flex align-items-center greeting-project">
                                        <div class="wrapper-info">
                                            <p class="value">15</p>
                                            <p class="text">Total Projects</p>
                                        </div>
                                        <v-divider vertical="true"></v-divider>
                                        <div class="wrapper-info">
                                            <p class="value">3</p>
                                            <p class="text">Ongoing Projects</p>
                                        </div>
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

            <v-col
                md="2"
                cols="12">
                <v-card
                    density="comfortable"
                    width="100%"
                    class="card-project-chart card-h-200">
                    <template v-slot:title>
                        <p class="value">5</p>
                        <p class="text">Ongoing Projects</p>
                    </template>

                    <template v-slot:text>
                        <apexchart height="150" type="donut" :options="options" :series="series"></apexchart>
                    </template>
                </v-card>
            </v-col>

            <v-col
                md="2"
                cols="12">
                <v-card
                    density="comfortable"
                    width="100%"
                    class="card-project-chart card-h-200">
                    <template v-slot:title>
                        <p class="value">100</p>
                        <p class="text">Total Projects</p>
                    </template>

                    <template v-slot:text>
                        <apexchart height="150" type="donut" :options="options" :series="series"></apexchart>
                    </template>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const options = ref({
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
    responsive: [{
        breakpoint: 600,
        options: {},
    }],
    plotOptions: {
        pie: {
            expandOnClick: true,
            donut: {
                labels: {
                    show: true,
                }
            },
        },
    },
    labels: ['January', 'Febuary', 'March', 'April', 'May'],
});

const series = ref([44, 55, 41, 17, 15]);

onMounted(() => {
    console.log('route', route);
})

</script>

<style lang="scss" scoped>
.card-project-chart {
    .value {
        font-size: 32px;
        font-weight: bold;
    }

    .text {
        font-size: 14px;
    }
}
.card-h-200 {
    height: 250px;
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
            font-size: 26px;
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
  
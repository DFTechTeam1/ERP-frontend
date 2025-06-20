<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { mdiCircle } from '@mdi/js';
import { ref } from 'vue';

const props = defineProps({
    quotation: Object
});

// const quotation = ref({
//     office: {
//         logo: 'https://backend.orca.test/dfactory.png',
//         address: "Kacapiring 19 / 2nd level, Surabaya East Java",
//         phone: '8727727728',
//         email: 'dfactory.id@gmail.com',
//         name: "DFactory"
//     },
//     customer: {
//         name: "Prince Charles",
//         place: "Makassar"
//     },
//     quotation_number: '#DF010578',
//     event: {
//         project_date: "05 Mei 2025",
//         event_class: "S (Special)",
//         name: "Wedding Anniv Mr Budi Mrs The Lee Lee",
//         venue: "Hotel Gajahmada",
//         led: {
//             main: [
//                 {width: '10', height: '5'}
//             ],
//             prefunction: []
//         },
//         itemPreviews: ["LED Visual Content", "Opening Sequence Content"],
//         price: 120000000
//     },
//     note: "There is no note here",
//     rules: "<p>Rules one</p>"
// });
</script>

<template>
    <div>
        <div class="quotation-wrapper" v-if="props.quotation">
            <div class="col-logo">
                <div class="logo-box">
                    <img :src="props.quotation.office.logo" alt="">
                </div>
    
                <div class="office-information">
                    <span>
                        {{ props.quotation.office.address }}
                    </span> <br>
                    <span>
                        {{ props.quotation.office.phone }}
                    </span> <br>
                    <span>{{ props.quotation.office.email }}</span>
                </div>
            </div>
            <div class="col-content">
                <div class="content-header position-relative">
                    <div class="customer">
                        <p>Ditawarkan Kepada:</p>
    
                        <p>{{ props.quotation.customer.name }} {{ props.quotation.customer.place }}</p>
                    </div>
    
                    <div class="office">
                        <p>Ditawarkan Oleh:</p>
    
                        <p>
                            <span>{{ props.quotation.office.name }}</span> <br>
                            <span>{{ props.quotation.office.address }}</span>
                        </p>
                    </div>
    
                    <div class="numbering">
                        <div class="numbering-item">
                            <span>Quotation No</span>
                            <span>:</span>
                            <span>
                                {{ props.quotation.quotation_number }}
                            </span>
                        </div>
                        <div class="numbering-item">
                            <span>Date</span>
                            <span>:</span>
                            <span>
                                {{ props.quotation.event.project_date }}
                            </span>
                        </div>
                        <div class="numbering-item">
                            <span>Design Job</span>
                            <span>:</span>
                            <span :style="{
                                textTransform: 'uppercase'
                            }">
                                {{ props.quotation.event.event_class }}
                            </span>
                        </div>
                    </div>
                </div>
    
                <div class="content-sub-header">
                    <!-- event detail -->
                    <div class="event-detail">
                        <div class="event-detail-item">
                            <span>Detail Acara</span>
                            <span>:</span>
                            <span>{{ props.quotation.event.name }}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>Tanggal Event</span>
                            <span>:</span>
                            <span>{{ props.quotation.event.project_date }}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>Venue</span>
                            <span>:</span>
                            <span>{{ props.quotation.event.venue }}</span>
                        </div>
                    </div> <!-- end event detail -->
                </div>
    
                <div class="content-table">
                    <table class="table-item w-100">
                        <tbody>
                            <tr class="table-header">
                                <td>Deskripsi</td>
                                <td>Harga (Rp)</td>
                            </tr>
    
                            <tr>
                                <td>
                                    <div>
                                        <div class="led-content">
                                            <span>LED Visual Content</span> <br>
                                            <span>Content Media Size:</span> <br>
                                            <span class="main-led" v-if="(props.quotation.event) && (props.quotation.event.led) && (props.quotation.event.led.main.length)">
                                                <template v-for="(main, m) in props.quotation.event.led.main"
                                                    :key="m">
                                                    <span>Main Stage:</span> {{ main.width }} * {{ main.height }} m <br v-if="m != props.quotation.event.led.main.length - 1">
                                                </template>
                                            </span>
                                            <span class="main-led" v-if="(props.quotation.event) && (props.quotation.event.led) && (props.quotation.event.led.prefunction.length)">
                                                <br>
                                                <template v-for="(prefunc, p) in props.quotation.event.led.prefunction"
                                                    :key="p">
                                                    <span>Prefunction:</span> {{ prefunc.width }} * {{ prefunc.height }} m <br v-if="p != props.quotation.event.led.prefunction.length - 1">
                                                </template>
                                            </span>
                                        </div>
    
                                        <div class="item-content">
                                            <p class="title">Premium LED Visual</p>
                                            <p v-for="(item, i) in props.quotation.event.itemPreviews" :key="i"><v-icon :icon="mdiCircle" size="4" class="mr-1 mb-1"></v-icon> {{ item }}</p>
                                        </div>

                                        <div class="note-preview" v-if="props.quotation.note">
                                            <p class="title">Note:</p>
                                            <p v-html="props.quotation.note"></p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span>{{ formatPrice(props.quotation.event.price) }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
    
                <div class="quotation-rules" style="font-size: 12px; padding-left: 20px; margin-top: 20px;">
                    <div v-html="props.quotation.rules"></div>
                </div>
            </div>
    
        </div>
    </div>
</template>

<style scoped lang="scss">
.quotation-wrapper {
    display: flex;
}

.col-logo {
    width: 15%;

    .logo-box {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #e6e6e6;
        margin-bottom: 10px;

        img {
            width: 80px;
            height: auto;
        }
    }

    .office-information {
        width: 100%;
        font-size: 12px;
    }
}

.col-content {
    width: 85%;
    padding-left: 20px;

    .content-table {
        font-size: 12px;
        margin-top: 30px;

        .table-item {
            border: 1px solid #000;
            border-collapse: collapse;

            tbody {
                tr {
                    td {
                        padding: 10px 14px;
                        border-right: 1px solid #000;
                    }
                }

                tr:first-child {
                    td {
                        border-bottom: 1px solid #000;
                    }

                    td:last-child {
                        text-align: center;
                    }
                }

                tr:last-child {
                    td:last-child {
                        text-align: center;
                        font-weight: bolder;
                        align-content: baseline;
                    }
                }

                .item-content {
                    margin-top: 50px;

                    .title {
                        font-weight: bolder;
                    }
                }
            }
        }
    }

    .content-header {
        display: flex;
        align-items: baseline;
        width: 100%;
        gap: 20px;

        .customer {
            font-size: 12px;
            width: 25%;
            margin-top: 100px;

            p:first-child {
                margin-bottom: 10px;
            }

            p:nth-child(2) {
                width: 70%;
            }
        }
        
        .office {
            font-size: 12px;
            width: 55%;
            margin-top: 100px;
    
            p:first-child {
                margin-bottom: 10px;
            }

            p:nth-child(2) {
                width: 40%;
                span:first-child {
                    font-weight: bold;
                    font-size: 14px;
                }
            }
        }

        .numbering {
            font-size: 12px;
            width: 25%;
            position: absolute;
            right: 0;

            .numbering-item {
                display: flex;
                gap: 5px;
                margin-bottom: 5px;
                
                span {
                    width: 100%;
                }

                span:nth-child(2) {
                    width: 20px;
                }
            }

            .numbering-item:first-child {
                font-size: 13px;
                font-weight: bold;
            }
        }
    }

    .content-sub-header {
        margin-top: 50px;

        .event-detail {
            .event-detail-item {
                display: flex;
                width: 100%;
                font-size: 13px;
                margin-bottom: 14px;

                span:nth-child(1) {
                    width: 15%;
                    font-weight: bold;
                }
                span:nth-child(2) {
                    width: 3%;
                }
                span:nth-child(3) {
                    width: 70%;
                }
            }

            .event-detail-item:nth-child(2) {
                span:nth-child(3) {
                    font-weight: bold;
                }
            }
        }
    }

    .note-preview {
        font-size: 12px;
        margin-top: 20px;

        .title {
            font-weight: bold;
        }
    }
}
</style>
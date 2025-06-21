<script setup>
import { useProjectStore } from '@/stores/project';
import { mdiCircle, mdiCurrencyUsd, mdiDatabase, mdiFile } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();

const route = useRoute();

const store = useProjectStore();

const emit = defineEmits(['next-event']);

const loading = ref(false);

const showConfirmation = ref(false);

const selectedIds = ref([1]);

const { quotationContent } = storeToRefs(store);

const formatPrice = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // IDR typically doesn't use decimals
    }).format(number);
};

const submitProject = (type) => {
    emit('next-event', {type: type});
}

const setLoading = (type) => {
    loading.value = type;
};

const updateProjectDate = () => {
    emit('next-event', {type: 'update'});
}

defineExpose({
    setLoading
})
</script>

<template>
    <div>
        <div class="quotation-wrapper">
            <div class="col-logo">
                <div class="logo-box">
                    <img :src="quotationContent.office.logo" alt="">
                </div>
    
                <div class="office-information">
                    <span>
                        {{ quotationContent.office.address }}
                    </span> <br>
                    <span>
                        {{ quotationContent.office.phone }}
                    </span> <br>
                    <span>{{ quotationContent.office.email }}</span>
                </div>
            </div>
            <div class="col-content">
                <div class="content-header position-relative">
                    <div class="customer">
                        <p>Ditawarkan Kepada:</p>
    
                        <p>{{ quotationContent.customer.name }} {{ quotationContent.customer.place }}</p>
                    </div>
    
                    <div class="office">
                        <p>Ditawarkan Oleh:</p>
    
                        <p>
                            <span>{{ quotationContent.office.name }}</span> <br>
                            <span>{{ quotationContent.office.address }}</span>
                        </p>
                    </div>
    
                    <div class="numbering">
                        <div class="numbering-item">
                            <span>Quotation No</span>
                            <span>:</span>
                            <span>
                                {{ quotationContent.quotation_number }}
                            </span>
                        </div>
                        <div class="numbering-item">
                            <span>Date</span>
                            <span>:</span>
                            <span>
                                {{ quotationContent.event.project_date }}
                            </span>
                        </div>
                        <div class="numbering-item">
                            <span>Design Job</span>
                            <span>:</span>
                            <span :style="{
                                textTransform: 'uppercase'
                            }">
                                {{ quotationContent.event.event_class }}
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
                            <span>{{ quotationContent.event.name }}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>Tanggal Event</span>
                            <span>:</span>
                            <span>{{ quotationContent.event.project_date }}</span>
                        </div>
                        <div class="event-detail-item">
                            <span>Venue</span>
                            <span>:</span>
                            <span>{{ quotationContent.event.venue }}</span>
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
                                            <span class="main-led" v-if="(quotationContent.event) && (quotationContent.event.led) && (quotationContent.event.led.main.length)">
                                                <template v-for="(main, m) in quotationContent.event.led.main"
                                                    :key="m">
                                                    <span>Main Stage:</span> {{ main.width }} * {{ main.height }} m <br v-if="m != quotationContent.event.led.main.length - 1">
                                                </template>
                                            </span>
                                            <span class="main-led" v-if="(quotationContent.event) && (quotationContent.event.led) && (quotationContent.event.led.prefunction.length)">
                                                <br>
                                                <template v-for="(prefunc, p) in quotationContent.event.led.prefunction"
                                                    :key="p">
                                                    <span>Prefunction:</span> {{ prefunc.width }} * {{ prefunc.height }} m <br v-if="p != quotationContent.event.led.prefunction.length - 1">
                                                </template>
                                            </span>
                                        </div>
    
                                        <div class="item-content">
                                            <p class="title">Premium LED Visual</p>
                                            <p v-for="(item, i) in quotationContent.event.itemPreviews" :key="i">
                                                <v-icon :icon="mdiCircle" size="4" class="mb-1 mr-1"></v-icon> {{ item }}
                                            </p>
                                        </div>

                                        <div class="note-preview" v-if="quotationContent.note">
                                            <p class="title">Note:</p>
                                            <p v-html="quotationContent.note"></p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span>{{ formatPrice(quotationContent.event.price) }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
    
                <div class="quotation-rules" style="font-size: 12px; padding-left: 20px; margin-top: 20px;">
                    <div v-html="quotationContent.rules"></div>
                </div>
            </div>
    
        </div>
        <v-stepper-actions>
            <template v-slot:next>
                <template v-if="!route.params.id">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn color="primary" :disabled="loading" variant="flat" type="button" v-bind="props">Save</v-btn>
                        </template>
    
                        <v-list :disabled="loading">
                            <v-list-item @click.prevent="submitProject('final')">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiCurrencyUsd" size="15"></v-icon>
                                </template>
    
                                <template v-slot:title>
                                    Save as Final
                                </template>
                            </v-list-item>
                            <v-list-item @click.prevent="submitProject('save_and_download')">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiDatabase" size="15"></v-icon>
                                </template>
    
                                <template v-slot:title>
                                    Save and Download Quotation
                                </template>
                            </v-list-item>
                            <v-list-item @click.prevent="submitProject('save')">
                                <template v-slot:prepend>
                                    <v-icon :icon="mdiDatabase" size="15"></v-icon>
                                </template>
    
                                <template v-slot:title>
                                    Save
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>

                <template v-else-if="route.params.type">
                    <v-btn color="primary" :disabled="loading" variant="flat" type="button" @click.prevent="submitProject('new_quotation')">Add Quotation</v-btn>
                </template>

                <template v-else>
                    <v-btn color="primary" :disabled="loading" variant="flat" type="button" @click.prevent="showConfirmation = true">Update</v-btn>
                </template>
            </template>

            <template v-slot:prev>
                <v-btn color="#FAFAFA" variant="flat" @click.prevent="$emit('back-event')">Previous</v-btn>
            </template>
        </v-stepper-actions>

        <confirmation-modal
            :title="t('update')"
            :text="t('confirmationUpdateProjectDeal')"
            :showConfirm="showConfirmation"
            :loading="loading"
            :deleteIds="selectedIds"
            @cancel-confirm="showConfirmation = false"
            @action-bulk-submit="updateProjectDate"></confirmation-modal>
    </div>
</template>

<style lang="scss" scoped>
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
            width: 20px;
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
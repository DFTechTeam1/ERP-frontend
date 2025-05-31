<script setup>
const rules = '<ol><li>Minimum Down Payment sebesar 50% dari total biaya yang di tagihkan, biaya tersebut tidak dapat dikembalikan.</li><li>Pembayaran melalui rekening BCA 01111123434 a/n Wesley Wiyadi / Edwin Chandra Wijaya</li></ol>';
</script>

<template>
    <div>
        <div class="quotation-wrapper">
            <div class="col-logo">
                <div class="logo-box">
                    <img src="/dfactory.webp" alt="">
                </div>
    
                <div class="office-information">
                    <span>
                        Kaca Piring 19 / 2nd level Surabaya - East Java
                    </span> <br>
                    <span>
                        +(62) 821 1068 6655	
                    </span> <br>
                    <span>dfactory.id@gmail.com</span>
                </div>
            </div>
            <div class="col-content">
                <div class="content-header position-relative">
                    <div class="customer">
                        <p>Ditawarkan Kepada:</p>
    
                        <p>Mr. Siever Sumilat & Ms.Angeliva Makassar Indonesia</p>
                    </div>
    
                    <div class="office">
                        <p>Ditawarkan Oleh:</p>
    
                        <p>
                            <span>DFactory</span> <br>
                            <span>Kaca Piring 19 / 2nd Level Surabaya, Jawa Timur Indonesia</span>
                        </p>
                    </div>
    
                    <div class="numbering">
                        <div class="numbering-item">
                            <span>Quotation No</span>
                            <span>:</span>
                            <span>#DF01047</span>
                        </div>
                        <div class="numbering-item">
                            <span>Date</span>
                            <span>:</span>
                            <span>03 May 2025</span>
                        </div>
                        <div class="numbering-item">
                            <span>Design Job</span>
                            <span>:</span>
                            <span>01044</span>
                        </div>
                    </div>
                </div>
    
                <div class="content-sub-header">
                    <!-- event detail -->
                    <div class="event-detail">
                        <div class="event-detail-item">
                            <span>Detail Acara</span>
                            <span>:</span>
                            <span>The Wedding Reception of Ms. Gabrielle & Mr. Christopher</span>
                        </div>
                        <div class="event-detail-item">
                            <span>Tanggal Event</span>
                            <span>:</span>
                            <span>22 Mei 2025</span>
                        </div>
                        <div class="event-detail-item">
                            <span>Venue</span>
                            <span>:</span>
                            <span>Upperhils - Makassar</span>
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
                                            <span class="main-led">
                                                Main Stage: 6 * 20 m
                                            </span>
                                        </div>
    
                                        <div class="item-content">
                                            <p class="title">Premium LED Visual</p>
                                            <p>1. LED DIgital Content</p>
                                            <p>2. Opening Sequence Content</p>
                                            <p>3. Entertainment LED Concept</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span>Rp 90,000,000</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
    
                <div class="quotation-rules" style="font-size: 12px; padding-left: 20px; margin-top: 20px;">
                    <div v-html="rules"></div>
                </div>
            </div>
    
        </div>
        <v-stepper-actions>
            <template v-slot:next>
                <v-btn color="primary" variant="flat" type="submit">Next</v-btn>
            </template>

            <template v-slot:prev>
                <v-btn color="#FAFAFA" variant="flat" @click.prevent="$emit('back-event')">Previous</v-btn>
            </template>
        </v-stepper-actions>
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
}
</style>
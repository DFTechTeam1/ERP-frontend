<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LedDetailForm from '../components/LedDetailForm.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import moment from 'moment';
import { useProjectStore } from '@/stores/project';

const { t } = useI18n();

const store = useProjectStore();

const { mobile } = useDisplay();

const ledFormComponent = ref(null);

const projectName = ref('My Event');
const projectDate = ref('23 September 2025');
const venue = ref('Hotel Gunadharma');
const location = ref('Surabaya');
const description_quill = ref(null);
const high_season = ref('1');
const event_location = ref('');
const equipment = ref('');

const mainBallroomFee = ref('0');
const prefunctionFee = ref('0');
const highSeasonFee = ref('0');
const equipmentFee = ref('0');
const subTotal = ref('0');
const maxDiscount = ref('0');
const total = ref('0');
const maxPriceUp = ref('0');
const detailData = ref([]);

const fix_price = ref(0);

function updateDescription() {
    // if (description_quill.value.getText().length > 1) {
    //     setFieldValue('note', description_quill.value.getHTML())
    // } else {
    //     setFieldValue('note', null)
    // }
}

function setPreview(values) {
    console.log('set previews',values);
    projectName.value = values.name;
    projectDate.value = moment(values.project_date).format('DD MMMM YYYY');
    venue.value = values.venue;
    location.value = values.city_name;

    detailData.value = values.led_detail;

    equipment.value = 'lasika';
}

async function checkHighSeason() {
    const resp = await store.checkHighSeason({
        project_date: projectDate.value
    });

    if (resp.status < 300) {
        high_season.value = resp.data.data.is_high_season ? '1' : '0';
    }
}

async function calculateProject() {
    
}

defineExpose({
    setPreview,
    checkHighSeason
});
</script>

<template>
    <div>
        <v-row>
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('eventName') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="projectName"></field-input>
                </div>
            </v-col>
    
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('projectDate') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="projectDate"></field-input>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('location') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="location"></field-input>
                </div>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('venue') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="venue"></field-input>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <div class="form-wrapper">
                    <v-label :text="t('note')" class="mb-2"></v-label>
                    <QuillEditor
                        class="quill-note"
                        theme="snow"
                        ref="description_quill"
                        @update:content="updateDescription" />
                </div>

                <div class="form-wrapper mt-3">
                    <LedDetailForm
                        :with-add-button="false"
                        :data="detailData"
                        :with-delete-button="false"
                        ref="ledFormComponent"></LedDetailForm>
                </div>
            </v-col>

            <v-col cols="12" md="6" class="mt-1">
                <div class="form-wrapper">
                    <label>{{ $t('eventLocation') }}</label>
                    <v-radio-group inline
                        v-model="event_location">
                        <v-radio
                            label="Surabaya"
                            value="surabaya"></v-radio>
                        <v-radio
                            label="Jakarta"
                            value="jakarta"></v-radio>
                        <v-radio
                            label="Jawa"
                            value="jawa"></v-radio>
                        <v-radio
                            label="Luar jawa"
                            value="luar jawa"></v-radio>
                    </v-radio-group>
                </div>

                <div class="d-flex" :style="{
                    gap: '40px'
                }">
                    <div class="form-wrapper">
                        <label>{{ $t('highSeasaon') }}</label>
                        <v-radio-group inline
                            v-model="high_season"
                            :disabled="true">
                            <v-radio
                                :label="t('yes')"
                                value="1"></v-radio>
                            <v-radio
                                :label="t('no')"
                                value="0"></v-radio>
                        </v-radio-group>
                    </div>

                    <div class="form-wrapper">
                        <label>{{ $t('equipment') }}</label>
                        <v-radio-group inline
                            v-model="equipment">
                            <v-radio
                                label="Lasika"
                                value="lasika"></v-radio>
                            <v-radio
                                label="Others"
                                value="others"></v-radio>
                        </v-radio-group>
                    </div>
                </div>

                <!-- total -->
                <table class="w-100 table-total">
                    <tbody>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Main Ballroom</td>
                            <td>
                                Rp<span>{{ mainBallroomFee }}</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Prefunction</td>
                            <td>
                                Rp<span>{{ prefunctionFee }}</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>High Season Fee</td>
                            <td>
                                Rp<span>{{ highSeasonFee }}</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Equipment Fee</td>
                            <td>
                                Rp<span>{{ equipmentFee }}</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Sub Total</td>
                            <td>
                                Rp<span>{{ subTotal }}</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Max. Discount</td>
                            <td>
                                Rp<span>{{ maxDiscount }}</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Total</td>
                            <td>
                                Rp<span>{{ total }}</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Max. Price UP</td>
                            <td class="price-up">
                                Rp<span>{{ maxPriceUp }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- fix price -->
                <table class="w-100 table-total fix mt-10">
                    <tbody>
                        <tr :class="{
                            'mobile': mobile
                        }">
                            <td>Fix Price</td>
                            <td>
                                <currency-input v-model="fix_price"
                                    density="compact"
                                    :is-solo="true"
                                    custom-class="custom-input" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>

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
.table-total {
    tbody {
        font-size: 13px;

        .mobile {
            td:first-child {
                padding-right: 20px;
            }
        }

        tr {
            td {
                padding: 8px 16px;
            }

            td:first-child {
                text-align: end;
                padding-right: 80px;
                width: 60%;
                font-weight: 500;
            }
            
            td:last-child {
                width: 40%;
                font-weight: bold;
            }
        }

        .border-table {
            td {
                border-bottom: 1px solid #e6e6e6;
            }
        }
    }
}

.table-total.fix {
    tbody {
        tr {
            td {
                width: 50%;
            }
        }
    }
}

.price-up {
    color: #4CAF50;
}
</style>
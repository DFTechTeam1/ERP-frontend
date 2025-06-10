<script setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import LedDetailForm from '../components/LedDetailForm.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import moment from 'moment';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const { t } = useI18n();

const store = useProjectStore();

const emit = defineEmits(['next-event']);

const {
    listOfPriceGuide,
    listAreaGuidePrice,
    quotationContent,
    listOfQuotationItems,
    guideOfPriceCalculation
} = storeToRefs(store);

const errorProjectItem = ref(null);

const { mobile } = useDisplay();

const ledFormComponent = ref(null);

const projectName = ref('My Event');
const projectDate = ref('23 September 2025');
const venue = ref('Hotel Gunadharma');
const location = ref('Surabaya');
const description_quill = ref(null);
const description = ref(null);
const high_season = ref('0');
const event_location = ref();
const equipment = ref('lasika');
const ledArea = ref({
    main: 40,
    prefunction: 0
});

const detailData = ref([]);

const fix_price = ref(0);

const fixPricePreview = ref(0);

const projectItems = ref([]);

const projectItemData = ref([]);

const projectItemPreviews = ref([]);

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        description.value = description_quill.value.getHTML();
    } else {
        description.value = null;
    }
}

function setPreview(values) {
    projectName.value = values.name;
    projectDate.value = moment(values.project_date).format('DD MMMM YYYY');
    venue.value = values.venue;
    location.value = values.city_name;

    detailData.value = values.led_detail;

    equipment.value = quotationContent.value.equipment_type ? quotationContent.value.equipment_type : 'lasika';

    // set led summary
    let main = values.led_detail.filter((filter) => {
        return filter.name === 'main';
    });
    main = main.reduce((total, item) => total + parseFloat(item.totalRaw), 0);

    let prefunc = values.led_detail.filter((filter) => {
        return filter.name === 'prefunction';
    });
    prefunc = prefunc.reduce((total, item) => total + parseFloat(item.totalRaw), 0);

    ledArea.value.main = main;
    ledArea.value.prefunction = prefunc;

    // set location to surabaya
    if (formattedArea.value.length) {
        event_location.value = quotationContent.value.event_location ? quotationContent.value.event_location : formattedArea.value[0].value;
    }
}

async function checkHighSeason() {
    const resp = await store.checkHighSeason({
        project_date: projectDate.value
    });

    if (resp.status < 300) {
        high_season.value = resp.data.data.is_high_season ? '1' : '0';
    }
}

const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const formattedArea = computed(() => {
    let output = [];
    for (let a in listAreaGuidePrice.value) {
        let label = capitalizeFirstLetter(a.replace('_', ' '));
        output.push({value: listAreaGuidePrice.value[a], title: label})
    }
    return output;
});

const formatPrice = (number) => {
    const parts = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).formatToParts(number);
    
    return parts.map(part => {
        if (part.type !== 'currency') return part.value;
        return '';
    }).join('');
};

const mainBallroomFee = computed(() => {
    let output = 0;
    if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.areaGuide[event_location.value] != undefined)) {
        if (guideOfPriceCalculation.value.areaGuide[event_location.value].mainBallroom.fixed) {
            output = eval(guideOfPriceCalculation.value.areaGuide[event_location.value].mainBallroom.fixed.replaceAll("{total_led}", ledArea.value.main));
        } else if (guideOfPriceCalculation.value.areaGuide[event_location.value].mainBallroom.percentage) {
            output = eval(guideOfPriceCalculation.value.areaGuide[event_location.value].mainBallroom.percentage.replaceAll("{total_led}", ledArea.value.main));
        }
    }
    return output;
});

const prefunctionFee = computed(() => {
    let output = 0;
    if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.areaGuide[event_location.value] != undefined)) {
        if (guideOfPriceCalculation.value.areaGuide[event_location.value].prefunction.fixed) {
            output = eval(guideOfPriceCalculation.value.areaGuide[event_location.value].prefunction.fixed.replaceAll("{total_led}", ledArea.value.prefunction));
        } else if (guideOfPriceCalculation.value.areaGuide[event_location.value].prefunction.percentage) {
            output = eval(guideOfPriceCalculation.value.areaGuide[event_location.value].prefunction.percentage.replaceAll("{total_led}", ledArea.value.prefunction));
        }
    }

    return output;
});

const highSeasonFee = computed(() => {
    let output = 0;

    if (high_season.value == 1) {
        if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.highSeason.percentage)) {
            output = eval(guideOfPriceCalculation.value.highSeason.percentage.replaceAll("{main_ballroom_price}", mainBallroomFee.value).replaceAll("{prefunction_price}", prefunctionFee.value));
        } else if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.highSeason.fixed)) {
            output = eval(guideOfPriceCalculation.value.highSeason.fixed.replaceAll("{main_ballroom_price}", mainBallroomFee.value).replaceAll("{prefunction_price}", prefunctionFee.value));
        }
    }

    return output;
});

const equipmentFee = computed(() => {
    let output = 0;

    if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.equipment[equipment.value] != undefined)) {
        output = parseFloat(guideOfPriceCalculation.value.equipment[equipment.value]);
    }

    return output;
});

const subTotal = computed(() => {
    let output = parseFloat(equipmentFee.value) + parseFloat(highSeasonFee.value) + parseFloat(mainBallroomFee.value) + parseFloat(prefunctionFee.value);
    if ((guideOfPriceCalculation.value) && (output < guideOfPriceCalculation.value.minimum_price)) {
        output = guideOfPriceCalculation.value.minimum_price;
    }

    return output;
});

const maxDiscount = computed(() => {
    let output = 0;

    if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.areaGuide[event_location.value] != undefined)) {
        if (subTotal.value <= guideOfPriceCalculation.value.minimum_price) {
            console.log('subTotal.value', subTotal.value);
            output = guideOfPriceCalculation.value.minimum_price
        } else {
            if (guideOfPriceCalculation.value.areaGuide[event_location.value].discount.percentage) {
                output = eval(
                    guideOfPriceCalculation.value.areaGuide[event_location.value].discount.percentage
                        .replaceAll("{main_ballroom_price}", mainBallroomFee.value)
                        .replaceAll("{prefunction_price}", prefunctionFee.value)
                        .replaceAll("{high_season_price}", highSeasonFee.value)
                        .replaceAll("{equipment_price}", equipmentFee.value)
                );
            } else {
                output = eval(
                    guideOfPriceCalculation.value.areaGuide[event_location.value].discount.fixed
                        .replaceAll("{main_ballroom_price}", mainBallroomFee.value)
                        .replaceAll("{prefunction_price}", prefunctionFee.value)
                        .replaceAll("{high_season_price}", highSeasonFee.value)
                        .replaceAll("{equipment_price}", equipmentFee.value)
                );
            }
        }
    }

    return output;
});

const areas = computed(() => {
    let output = [];

    if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.area)) {
        output = guideOfPriceCalculation.value.area;
    }

    return output;
});

const equipmentList = computed(() => {
    let output = [];

    if ((guideOfPriceCalculation.value) && (guideOfPriceCalculation.value.equipmentList)) {
        output = guideOfPriceCalculation.value.equipmentList;
    }

    return output;
});

const total = computed(() => {
    let output = subTotal.value - maxDiscount.value;
    if ((guideOfPriceCalculation.value) && (maxDiscount.value <= guideOfPriceCalculation.value.minimum_price)) {
        output = guideOfPriceCalculation.value.minimum_price
    }

    return output;
});

const maxPriceUp = computed(() => {
    let output = subTotal.value * parseFloat(listOfPriceGuide.value.priceUp.formula);

    return output;
});

const validateData = () => {
    if (!projectItems.value.length) {
        errorProjectItem.value = t('quotationItemRequired')
        return;
    } else {
        errorProjectItem.value = null;
    }

    store.setQuotationEquipmentType({type: equipment.value});

    store.setQuotationEventLocation({location: event_location.value})
    
    // set quotation price
    store.setQuotationPrice({price: fix_price.value});

    // set note
    store.setQuotationNote({note: description.value});

    // set items
    store.setQuotationItems({items: projectItems.value, itemPreviews: projectItemPreviews.value});

    emit('next-event');
};

const getPayload = () => {
    return {
        quotation: {
            quotation_id: quotationContent.value.quotation_number,
            is_final: '',
            event_location_guide: event_location.value,
            main_ballroom: mainBallroomFee.value,
            prefunction: prefunctionFee.value,
            high_season_fee: highSeasonFee.value,
            equipment_fee: equipmentFee.value,
            sub_total: subTotal.value,
            maximum_discount: maxDiscount.value,
            total: total.value,
            maximum_markup_price: maxPriceUp.value,
            fix_price: fix_price.value,
            is_high_season: high_season.value,
            equipment_type: equipment.value,
            items: projectItems.value,
            description: description.value
        },
    }
};

defineExpose({
    setPreview,
    checkHighSeason,
    getPayload
});

watch(subTotal, (values) => {
    console.log('values'. values);
    fix_price.value =  values;
});

watch(projectItemData, (values) => {
    console.log('items object', values);
    if (values.length) {
        let duplicateData = [...values];
        projectItems.value = duplicateData.map((mapping) => {
            return mapping.value;
        });
        duplicateData = [...values];
        projectItemPreviews.value = duplicateData.map((mapping) => {
            return mapping.title;
        });
    } else {
        projectItems.value = [];
        projectItemPreviews.value = [];
    }

    console.log('projectItemPreviews', projectItemPreviews.value);

})
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

                <div class="form-wrapper mt-2">
                    <v-label class="mb-2" text="Item"></v-label>

                    <v-autocomplete
                        v-model="projectItemData"
                        :items="listOfQuotationItems"
                        :single-line="true"
                        color="blue-grey-lighten-2"
                        :return-object="true"
                        item-title="title"
                        item-value="value"
                        label="Select Item"
                        :error-messages="errorProjectItem"
                        chips
                        density="compact"
                        variant="outlined"
                        closable-chips
                        multiple
                        >
                        <template v-slot:chip="{ props, item }">
                            <v-chip
                            v-bind="props"
                            :text="item.raw.name"
                            ></v-chip>
                        </template>

                        <template v-slot:item="{ props, item }">
                            <v-list-item
                            v-bind="props"
                            :title="item.raw.title"
                            :active="projectItems.includes(item.raw.value)"
                            active-class="bg-light-blue-lighten-5"
                            ></v-list-item>
                        </template>
                    </v-autocomplete>
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
                        class="mt-1"
                        v-model="event_location">
                        <v-radio
                            v-for="(area, a) in areas"
                            :key="a"
                            :value="area.value"
                            :label="area.title"
                            density="compact"
                            :class="{
                                'ms-3': a > 0
                            }"></v-radio>
                    </v-radio-group>
                </div>

                <div class="d-flex" :style="{
                    gap: '40px'
                }">
                    <div class="form-wrapper">
                        <label>{{ $t('highSeasaon') }}</label>
                        <v-radio-group inline
                            v-model="high_season"
                            class="mt-1"
                            :disabled="true">
                            <v-radio
                                :label="t('yes')"
                                density="compact"
                                value="1"></v-radio>
                            <v-radio
                                :label="t('no')"
                                density="compact"
                                class="ms-2"
                                value="0"></v-radio>
                        </v-radio-group>
                    </div>

                    <div class="form-wrapper">
                        <label>{{ $t('equipment') }}</label>
                        <v-radio-group inline
                            class="mt-1"
                            v-model="equipment">
                            <template v-for="(type, t) in equipmentList"
                                :key="t">
                                <v-radio
                                    :label="type.title"
                                    density="compact"
                                    :class="{
                                        'ms-2': t > 0
                                    }"
                                    :value="type.value"></v-radio>
                            </template>
                        </v-radio-group>
                    </div>
                </div>

                <!-- total -->
                <table class="w-100 table-total">
                    <tbody>
                        <tr class="border-table bg-grey-lighten-4" :class="{
                            'mobile': mobile
                        }">
                            <td>Main Ballroom</td>
                            <td>
                                <span>{{ formatPrice(mainBallroomFee) }}</span>
                            </td>
                        </tr>
                        <tr class="border-table bg-grey-lighten-4" :class="{
                            'mobile': mobile
                        }">
                            <td>Prefunction</td>
                            <td>
                                <span>{{ formatPrice(prefunctionFee) }}</span>
                            </td>
                        </tr>
                        <tr class="border-table bg-grey-lighten-4" :class="{
                            'mobile': mobile
                        }">
                            <td>High Season Fee</td>
                            <td>
                                <span>{{ formatPrice(highSeasonFee) }}</span>
                            </td>
                        </tr>
                        <tr class="border-table bg-grey-lighten-4" :class="{
                            'mobile': mobile
                        }">
                            <td>Equipment Fee</td>
                            <td>
                                <span>{{ formatPrice(equipmentFee) }}</span>
                            </td>
                        </tr>
                        <tr class="border-table bg-teal-lighten-2" :class="{
                            'mobile': mobile
                        }">
                            <td>Normal Price</td>
                            <td>
                                <span>{{ formatPrice(subTotal) }}</span>
                            </td>
                        </tr>
                        <!-- <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Max. Discount</td>
                            <td>
                                <span>{{ formatPrice(maxDiscount) }}</span>
                            </td>
                        </tr> -->
                        <tr class="border-table bg-yellow-lighten-3" :class="{
                            'mobile': mobile
                        }">
                            <td>Max. Discount Price</td>
                            <td>
                                <span>{{ formatPrice(total) }}</span>
                            </td>
                        </tr>
                        <tr class="border-table bg-green-lighten-3" :class="{
                            'mobile': mobile
                        }">
                            <td>Max. Price UP</td>
                            <td class="price-up">
                                <span>{{ formatPrice(maxPriceUp) }}</span>
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
                                    custom-class="custom-input"></currency-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-col>
        </v-row>

        <v-stepper-actions>
            <template v-slot:next>
                <v-btn color="primary" variant="flat" type="button" @click.prevent="validateData">Next</v-btn>
            </template>

            <template v-slot:prev>
                <v-btn color="#FAFAFA" variant="flat" @click.prevent="$emit('back-event')">Previous</v-btn>
            </template>
        </v-stepper-actions>
    </div>
</template>

<style lang="scss" scoped>
.table-total {
    border-collapse: collapse;

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
</style>
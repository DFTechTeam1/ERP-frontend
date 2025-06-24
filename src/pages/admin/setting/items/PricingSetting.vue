<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import InputGroup from './components/forms/PriceInputGroup.vue';
import { mdiHelpCircle } from '@mdi/js';
import { computed } from 'vue';
import { useSettingStore } from '@/stores/setting';
import { storeToRefs } from 'pinia';
import { showNotification } from '@/compose/notification';

const { t } = useI18n();

const store = useSettingStore();

const {
    globalPriceSetting
} = storeToRefs(store);

const types = ref([
    {
        title: 'Percentage',
        value: 'percentage'
    },
    {
        title: 'Fixed',
        value: 'fixed'
    }
]);

const fixedType = ref([
    {
        title: 'Fixed',
        value: 'fixed'
    }
]);

const percentageType = ref([
    {
        title: 'Percentage',
        value: 'percentage'
    },
]);

const guides = ref([
    {
        area: "Surabaya",
        settings: [
            {
                name: "Main Ballroom Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            {
                name: "Prefunction Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            // {
            //     name: "Prefunction Divisor Nominal",
            //     type: "percentage",
            //     value: 0,
            //     fixType: 'percentage'
            // },
            {
                name: "Max Discount",
                type: "percentage",
                value: 0,
                fixType: 'flexible'
            }
        ]
    },
    {
        area: "Jakarta",
        settings: [
            {
                name: "Main Ballroom Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            {
                name: "Prefunction Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            // {
            //     name: "Prefunction Divisor Nominal",
            //     type: "percentage",
            //     value: 0,
            //     fixType: 'percentage'
            // },
            {
                name: "Max Discount",
                type: "percentage",
                value: 0,
                fixType: 'flexible'
            }
        ]
    },
    {
        area: "Jawa",
        settings: [
            {
                name: "Main Ballroom Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            {
                name: "Prefunction Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            // {
            //     name: "Prefunction Divisor Nominal",
            //     type: "percentage",
            //     value: 0,
            //     fixType: 'percentage'
            // },
            {
                name: "Max Discount",
                type: "percentage",
                value: 0,
                fixType: 'flexible'
            }
        ]
    },
    {
        area: "Luar Jawa",
        settings: [
            {
                name: "Main Ballroom Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            {
                name: "Prefunction Fee",
                type: "fixed",
                value: 0,
                fixType: 'fixed'
            },
            // {
            //     name: "Prefunction Divisor Nominal",
            //     type: "percentage",
            //     value: 0,
            //     fixType: 'percentage'
            // },
            {
                name: "Max Discount",
                type: "percentage",
                value: 0,
                fixType: 'flexible'
            }
        ]
    }
]);

const equipmentSetting = ref([
    {
        name: "Lasika",
        type: "fixed",
        value: 0
    },
    {
        name: "Others",
        type: "fixed",
        value: 0
    }
]);

const price_up_type = ref('percentage');
const price_up_value = ref(0);
const high_season_type = ref('percentage');
const high_season_value = ref(0);
const prefunction_percentage = ref(0);
const minimum_price = ref(0);

const loading = ref(false);

const validateData = async () => {
    let payload = {
        area: guides.value,
        equipment: equipmentSetting.value,
        price_up: {
            type: price_up_type.value,
            value: price_up_value.value
        },
        high_season: {
            type: high_season_type.value,
            value: high_season_value.value
        },
        prefunction_percentage: prefunction_percentage.value,
        minimum_price: minimum_price.value
    };

    loading.value = true;
    store.storeSetting(payload, 'price');
    loading.value = false;
};

const defineType = (type) => {
    let output = types.value;

    if (type == 'fixed') {
        output = fixedType.value;
    } else if (type == 'percentage') {
        output = percentageType.value;
    }

    return output;
}

watch(
    () => globalPriceSetting.value,
    (newValue) => {
        guides.value = newValue.area;
        equipmentSetting.value = newValue.equipment;
        price_up_type.value = newValue.price_up.type;
        price_up_value.value = newValue.price_up.value;
        high_season_type.value = newValue.high_season.type;
        high_season_value.value = newValue.high_season.value;
        prefunction_percentage.value = newValue.prefunction_percentage;
        minimum_price.value = newValue.minimum_price;
    },
    { immediate: true }
)
</script>

<template>
    <v-card flat border>
        <v-card-text>
            <divider-text text="Pricing Guide Based on Area" />

            <v-form class="px-10 mt-5 position-relative"
                @submit.prevent="validateData">
                <div class="area-item"
                    v-for="(guide, g) in guides"
                    :key="g">
                    <p class="title">{{ guide.area }}</p>
                    <template v-for="(item, i) in guide.settings">
                        <input-group
                            :is-solo="true"
                            :option-label="item.name"
                            :value-label="t('type')"
                            :type-options="defineType(item.fixType)"
                            :show-prepend-inner="true"
                            :show-append-inner="true"
                            v-model:option="item.type"
                            v-model:value="item.value">
                            <template v-slot:append-item>
                                <span v-if="item.type == 'percentage'">%</span>
                            </template>
                            <template v-slot:prepend-item>
                                <span v-if="item.type == 'fixed'">Rp</span>
                            </template>
                        </input-group>

                    </template>

                </div>

                <divider-text text="Equipment Fee" />

                <div class="area-item"
                    v-for="(equipment, e) in equipmentSetting"
                    :key="e">
                    <p class="title">{{ equipment.name }}</p>
                    <input-group
                        :is-solo="true"
                        :option-label="t('fee')"
                        :value-label="t('type')"
                        :type-options="fixedType"
                        :show-prepend-inner="true"
                        :show-append-inner="true"
                        v-model:option="equipment.type"
                        v-model:value="equipment.value">
                        <template v-slot:append-item>
                            <span v-if="equipment.type == 'percentage'">%</span>
                        </template>
                        <template v-slot:prepend-item>
                            <span v-if="equipment.type == 'fixed'">Rp</span>
                        </template>
                    </input-group>
                </div>

                <divider-text :text="t('others')" />

                <input-group
                    :is-solo="true"
                    :option-label="t('maximumPriceUp')"
                    :value-label="t('type')"
                    :type-options="types"
                    :show-prepend-inner="true"
                    :show-append-inner="true"
                    v-model:option="price_up_type"
                    v-model:value="price_up_value">
                    <template v-slot:append-item>
                        <span v-if="price_up_type == 'percentage'">%</span>
                    </template>
                    <template v-slot:prepend-item>
                        <span v-if="price_up_type == 'fixed'">Rp</span>
                    </template>
                </input-group>

                <input-group
                    :is-solo="true"
                    :option-label="t('highSeason')"
                    :value-label="t('type')"
                    :type-options="types"
                    :show-prepend-inner="true"
                    :show-append-inner="true"
                    v-model:option="high_season_type"
                    v-model:value="high_season_value">
                    <template v-slot:append-item>
                        <span v-if="high_season_type == 'percentage'">%</span>
                    </template>
                    <template v-slot:prepend-item>
                        <span v-if="high_season_type == 'fixed'">Rp</span>
                    </template>
                </input-group>

                <input-group
                    :is-solo="true"
                    :option-label="t('prefunctionPercentage')"
                    :show-append-inner="true"
                    :only-price="true"
                    v-model:value="prefunction_percentage">
                    <template v-slot:append-item>
                        <span>%</span>
                    </template>
                </input-group>

                <input-group
                    :is-solo="true"
                    :option-label="t('minimumPrice')"
                    :show-prepend-inner="true"
                    :only-price="true"
                    v-model:value="minimum_price">
                    <template v-slot:prepend-item>
                        <span>Rp</span>
                    </template>
                </input-group>

                <div class="d-flex items-center justify-end mt-5">
                    <v-btn variant="flat" color="primary" type="submit"
                        :disabled="loading">
                        Save
                    </v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<style lang="scss" scoped>
.select-group {
    padding: 8px 12px;
    border: 1px solid #e6e6e6;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;

    &:focus {
        outline: none;
        border: 1px solid #e6e6e6;
    }
}

.area-item {
    padding: 14px;
    box-shadow: 0px 0px 15px 2px #DEDEDE;
    border-radius: 6px;
    margin-bottom: 14px;

    .title {
        font-size: 18px;
        font-weight: bold;
        color: #757575;
        margin-bottom: 20px;
    }
}
</style>
<script setup>
import { useCustomerStore } from '@/stores/customer';
import { useProjectStore } from '@/stores/project';
import { useProjectDealStore } from '@/stores/projectDeal';
import { mdiAccount, mdiCalendar, mdiCash, mdiChevronRight, mdiClose, mdiFileQuestion, mdiMailbox, mdiOfficeBuilding } from '@mdi/js';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const emit = defineEmits(['close-event', 'submit-event']);

const store = useProjectDealStore();

const projectStore = useProjectStore();

const customerStore = useCustomerStore();

const {
    listOfAllCustomer
} = storeToRefs(customerStore);

const {
    listOfMarketings
} = storeToRefs(projectStore);

const {
    listOfFilterValue
} = storeToRefs(store);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
});

const show = ref(false);

const { handleSubmit, resetForm, defineField, setFieldValue, errors } = useForm({
    validationSchema: yup.object({
        event: yup.string().nullable(),
        date: yup.array().nullable(),
        status: yup.array().nullable(),
        customer: yup.array().nullable(),
        marketing: yup.array().nullable(),
        price: yup.array().nullable(),
    })
});

const [event] = defineField('event');
const [date] = defineField('date');
const [status] = defineField('status');
const [customer] = defineField('customer');
const [marketing] = defineField('marketing');
const [price] = defineField('price');

const filters = ref([
    {
        icon: 'event',
        label: t("eventName"),
        inputType: "text",
        value: null,
        active: false
    },
    {
        icon: 'status',
        label: t("status"),
        inputType: "select",
        value: null,
        active: false
    },
    {
        icon: 'date',
        label: t("date"),
        inputType: "date",
        value: null,
        active: false
    },
    {
        icon: 'marketing',
        label: t("marketing"),
        inputType: "select",
        value: null,
        active: false
    },
    {
        icon: 'customer',
        label: t("customerName"),
        inputType: "select",
        value: null,
        active: false
    },
    {
        icon: 'price',
        label: t("price"),
        inputType: "slider",
        value: null,
        active: false
    }
]);

const filterPreviews = ref([]);

const statusList = ref([
    {
        id: 0,
        name: "Draft"
    },
    {
        id: 1,
        name: "Finish"
    },
    {
        id: 2,
        name: "Temporary"
    },
])

const removeFilterItem = (item) => {

};

const chooseFilterItem = (item) => {
    const search = filterPreviews.value.find(filter => filter.icon === item.icon);

    let activeFilter = false;
    if (search == undefined) {
        filterPreviews.value.push(item);
        activeFilter = true;
    } else {
        filterPreviews.value = filterPreviews.value.filter((remove) => {
            return remove.icon !== item.icon;
        });

        filters.value = filters.value.map((currentFilter) => {
            if (currentFilter.icon === item.icon) {
                currentFilter.active = false;
                currentFilter.value = null;

                setFieldValue(item.icon, null);
            }

            return currentFilter;
        });

        console.log('filters', filters.value);
    }

    // update the status in current filters
    filters.value = filters.value.map((currentFilter) => {
        if (currentFilter.icon === item.icon && activeFilter) {
            currentFilter.active = true;
        }

        return currentFilter;
    });
};

const getMarketingList = async () => {
    await projectStore.getProjectMarketings();
};

const getCustomer = async () => {
    await customerStore.getCustomer();
}

const prepareData = async () => {
    await Promise.all([
        getMarketingList(),
        getCustomer()
    ]);
};

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        if (values.isShow) {
            // here we set current filter the same with current session
            if (listOfFilterValue.value) {
                if (listOfFilterValue.value.preview.length) {
                    filterPreviews.value = listOfFilterValue.value.preview;
                }
                if (listOfFilterValue.value.filters.length) {
                    filters.value = listOfFilterValue.value.filters;
                }
            }

            // get marketing list
            prepareData();
        }
    }
});

watch(marketing, (values) => {
    
    filters.value = filters.value.map((mapping) => {
        if (mapping.icon === 'marketing') {
            mapping.value = values;
        }
        
        return mapping;
    });
});

watch(status, (values) => {
    
    filters.value = filters.value.map((mapping) => {
        if (mapping.icon === 'status') {
            mapping.value = values;
        }
        
        return mapping;
    });
});

watch(price, (values) => {
    let output = null;
    if (values) {
        let startPrice = values[0].toLocaleString('en-US');
        let endPrice = values[1].toLocaleString('en-US');
        output = `${startPrice} - ${endPrice}`;
    }

    filters.value = filters.value.map((mapping) => {
        if (mapping.icon === 'price') {
            mapping.value = output;
        }

        return mapping;
    });
});

watch(date, (values) => {
    let startDate = null;
    let endDate = null;
    if (values) {
        startDate = moment(values[0]).format('DD MMMM YYYY');

        if (values.length > 1) {
            let lastKey = values.length - 1;
            endDate = moment(values[lastKey]).format('DD MMMM YYYY');

            startDate += ' - ' + endDate;
        }

        // update value
        console.log('start', startDate);
    }
    filters.value = filters.value.map((mapping) => {
        if (mapping.icon == 'date') {
            mapping.value = startDate;
        }

        return mapping;
    });
});

watch(customer, (values) => {
    filters.value = filters.value.map((mapping) => {
        if (mapping.icon === 'customer') {
            mapping.value = values;
        }

        return mapping;
    });
});

watch(event, (values) => {
    filters.value = filters.value.map((mapping) => {
        if (mapping.icon === 'event') {
            mapping.value = values;
        }

        return mapping;
    });
});

const resetFilterDialog = () => {
    filterPreviews.value = [];
    filters.value = filters.value.map((item) => {
        item.value = null;
        item.active = false;

        return item;
    });
    resetForm();
};

const closeFilterDialog = () => {
    emit('close-event');
};

const validateData = handleSubmit((values) => {
    let payload = {};

    filters.value.forEach((item) => {
        if (item.value && item.active) {
            payload[item.icon] = values[item.icon]
        }
    });

    store.setAdvanceFilterValue({
        filters: filters.value,
        preview: filterPreviews.value
    });

    // format the date
    if ('date' in payload) {
        let startDate = moment(payload.date[0]).format('YYYY-MM-DD');
        if (payload.date.length > 1) {
            let endDate = moment(payload.date[payload.date.length - 1]).format('YYYY-MM-DD');
            startDate += " - " + endDate;
        }

        payload.date = startDate;
    }

    emit('submit-event', payload);
});

defineExpose({
    resetFilterDialog
});
</script>

<template>
    <v-dialog
        persistent
        max-width="800"
        v-model="show">
        <master-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p :style="{
                        margin: '0'
                    }">Search Project Deal</p>

                    <v-icon :icon="mdiClose" color="red" size="14" class="pointer" @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit.prevent="validateData">
                    <v-row>
                        <v-col cols="12" md="5">
                            <div>
                                <v-list class="py-3 px-3">
                                    <v-list-item class="border rounded-lg mb-3"
                                        active-class="active-filter-item"
                                        :lines="filter.value != null && filter.icon != 'event' && filter.icon != 'customer' ? 'two' : 'one'"
                                        :active="filter.active"
                                        v-for="(filter, f) in filters"
                                        :key="f"
                                        @click.prevent="chooseFilterItem(filter)">
                                        <template v-slot:prepend>
                                            <v-icon :icon="mdiOfficeBuilding"
                                                v-if="filter.icon == 'event'"
                                                color="primary"></v-icon>
                                            <v-icon :icon="mdiFileQuestion"
                                                v-if="filter.icon == 'status'"
                                                color="primary"></v-icon>
                                            <v-icon :icon="mdiCalendar"
                                                v-if="filter.icon == 'date'"
                                                color="primary"></v-icon>
                                            <v-icon :icon="mdiAccount"
                                                v-if="filter.icon == 'marketing'"
                                                color="primary"></v-icon>
                                            <v-icon :icon="mdiMailbox"
                                                v-if="filter.icon == 'customer'"
                                                color="primary"></v-icon>
                                            <v-icon :icon="mdiCash"
                                                v-if="filter.icon == 'price'"
                                                color="primary"></v-icon>
                                        </template>
    
                                        <template v-slot:append>
                                            <v-icon :icon="mdiChevronRight" size="14"></v-icon>
                                        </template>

                                        <template v-slot:subtitle>
                                            <span :style="{
                                                fontSize: '10px'
                                            }"
                                            v-if="filter.icon == 'date' || filter.icon == 'price'">{{ filter.value }}</span>
                                            
                                            <template v-if="filter.icon == 'marketing' || filter.icon == 'status'">
                                                <v-chip size="x-small"
                                                    v-for="(itemLabel, il) in filter.value"
                                                    :key="il"
                                                    color="primary"
                                                    class="ms-1">
                                                    {{ itemLabel.name }}
                                                </v-chip>
                                            </template>
                                        </template>

                                        <template v-slot:title>
                                            {{ filter.label }}
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </v-col>

                        <v-col cols="12" md="7" class="bg-grey-lighten-5 rounded-lg">
                            <div class="p-3">
                                <p class="title-summary">{{ $t('filterSummary') }}</p>

                                <v-empty-state
                                    v-if="!filterPreviews.length"
                                    class="mt-10"
                                    title="No filter found."
                                    text="Click available option in the left panel to set the filter"></v-empty-state>                               

                                <template v-for="(field, ff) in filterPreviews"
                                    :key="ff">

                                    <div class="form-wrapper"
                                        v-if="field.icon == 'event'">
                                        <label>{{ $t('eventName') }}</label>
                                        <field-input
                                            :label="t('eventName')"
                                            :is-solo="true"
                                            v-model="event"
                                            :is-required="false"
                                            density="compact"></field-input>
                                    </div>

                                    <div class="form-wrapper"
                                        v-if="field.icon == 'customer'">
                                        <label>{{ $t('customerName') }}</label>
                                        <field-input
                                            :label="t('customerName')"
                                            :is-solo="true"
                                            v-model="customer"
                                            :is-required="false"
                                            input-type="select"
                                            :select-options="listOfAllCustomer"
                                            input-value="value"
                                            item-title="title"
                                            :is-multiple="true"
                                            density="compact"></field-input>
                                    </div>

                                    <div class="form-wrapper"
                                        v-if="field.icon == 'date'">
                                        <label>{{ $t('eventDate') }}</label>
                                        <v-date-picker multiple="range" width="100%"
                                            color="primary"
                                            v-model="date"></v-date-picker>
                                    </div>

                                    <div class="form-wrapper"
                                        v-if="field.icon == 'marketing'">
                                        <label>{{ $t('marketing') }}</label>
                                        <field-input
                                            :label="t('marketing')"
                                            :is-solo="true"
                                            v-model="marketing"
                                            :is-required="false"
                                            input-type="select"
                                            :select-options="listOfMarketings"
                                            item-value="uid"
                                            item-title="name"
                                            :is-return-object="true"
                                            :is-multiple="true"
                                            density="compact"></field-input>
                                    </div>

                                    <div class="form-wrapper"
                                        v-if="field.icon == 'status'">
                                        <label>{{ $t('status') }}</label>
                                        <field-input
                                            :label="t('status')"
                                            :is-solo="true"
                                            v-model="status"
                                            :is-required="false"
                                            input-type="select"
                                            :select-options="statusList"
                                            item-value="id"
                                            item-title="name"
                                            :is-return-object="true"
                                            :is-multiple="true"
                                            density="compact"></field-input>
                                    </div>

                                    <div class="form-wrapper"
                                        v-if="field.icon == 'price'">
                                        <label>{{ $t('price') }}</label>
                                        <v-range-slider
                                            v-model="price"
                                            step="10000000"
                                            :min="0"
                                            :max="900000000"
                                            :center-affix="true"
                                            thumb-color="primary"
                                            thumb-label="always"
                                        ></v-range-slider>
                                    </div>

                                </template>
                            </div>
                        </v-col>
                    </v-row>

                    <div class="mt-5 d-flex justify-end">
                        <v-btn variant="flat"
                            color="grey-lighten-3"
                            type="button"
                            @click.prevent="closeFilterDialog">
                            {{ $t('close') }}                        
                        </v-btn>
                        <v-btn variant="flat"
                            color="primary"
                            type="submit"
                            class="ms-3">
                            {{ $t('search') }}                        
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
.title-summary {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 15px;
}

label {
    font-size: 13px;
    display: block;
}

.form-wrapper {
    margin-bottom: 10px;

    input::placeholder,
    .v-label {
        font-size: 12px !important;
    }
}

.active-filter-item {
    box-shadow: 0px 0px 5px 3px rgba(115,103,240,.3);
}
</style>

<style lang="scss">
.form-wrapper {
    .v-label {
        font-size: 13px !important;
    }
}
</style>
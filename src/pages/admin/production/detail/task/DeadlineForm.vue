<template>
    <v-dialog
        v-model="show"
        width="auto">
        <v-card flat
            class="p-0">
            <v-card-text class="card-deadline-body">
                <v-date-picker
                    v-model="datepicker"
                    @update:model-value="updatedDate"
                    color="primary"></v-date-picker>

                <v-form class="mt-4 px-5">
                    <div class="form-group mb-3">
                        <v-label>Start Date</v-label>
                        <div class="w-100">
                            <input 
                                @click.prevent="activeFieldAction('start')"
                                type="text" 
                                v-model="startDate"
                                class="form-control" 
                                style="padding: 8px 12px; width: 50%;
                            background-color: #fff; border: 1px solid #e6e6e6; border-radius: 4px;">
                            <div class="text-red" style="font-size: 12px;" v-if="errors.startDate">{{ errors.startDate }}</div>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <v-label>End Date</v-label>
                        <div class="w-100">
                            <input 
                                @click.prevent="activeFieldAction('end')"
                                type="text" 
                                v-model="endDate"
                                class="form-control" 
                                style="padding: 8px 12px; width: 50%;
                            background-color: #fff; border: 1px solid #e6e6e6; border-radius: 4px;">
                            <div class="text-red" style="font-size: 12px;" v-if="errors.endDate">{{ errors.endDate }}</div>
                        </div>
                    </div>

                    <v-btn
                        variant="flat"
                        color="primary"
                        class="w-100 mb-3"
                        @click.prevent="saveDate">
                        {{ $t('save') }}
                    </v-btn>
                    <v-btn
                        variant="flat"
                        color="white"
                        class="w-100 mb-3">
                        {{ $t('cancel') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.card-deadline-body {
    padding: 0 !important;
}
</style>

<script setup>
import { ref, watch } from 'vue';
import { useDate } from 'vuetify/lib/framework.mjs';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { defineField, handleSubmit, errors } = useForm({
    validationSchema: yup.object({
        startDate: yup.string().nullable(),
        endDate: yup.string().when('startDate', {
            is: (value) => value != undefined,
            then: function () {
                return yup.string().min(startDate.value, t('dateMustBeGreater', {date: startDate.value})).required(t('endDateRequired'))
            },
            otherwise: function () {
                return yup.string().nullable()
            }
        })
    })
})

const [startDate] = defineField('startDate');
const [endDate] = defineField('endDate');

const _date = useDate();

const show = ref(false);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const activeField = ref(null);

const datepicker = ref(null);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

function activeFieldAction(type) {
    activeField.value = type;
}

function updatedDate(values) {
    var dateChoose = _date.format(values, 'year') + ', ' + _date.format(values, 'monthAndDate');
    if (activeField.value == 'start') {
        startDate.value = dateChoose;
    } else if (activeField.value == 'end') {
        endDate.value = dateChoose;
    }
}

const saveDate = handleSubmit((values) => {
    console.log('values', values);
})
</script>
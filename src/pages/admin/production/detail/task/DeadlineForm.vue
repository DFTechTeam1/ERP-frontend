<template>
    <v-dialog
        v-model="show"
        width="auto"
        persistent>
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
                                v-model="start_date"
                                class="form-control" 
                                style="padding: 8px 12px; width: 50%;
                            background-color: #fff; border: 1px solid #e6e6e6; border-radius: 4px;">
                            <div class="text-red" style="font-size: 12px;" v-if="errors.start_date">{{ errors.start_date }}</div>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <v-label>End Date</v-label>
                        <div class="w-100">
                            <input 
                                @click.prevent="activeFieldAction('end')"
                                type="text" 
                                v-model="end_date"
                                class="form-control" 
                                style="padding: 8px 12px; width: 50%;
                            background-color: #fff; border: 1px solid #e6e6e6; border-radius: 4px;">
                            <div class="text-red" style="font-size: 12px;" v-if="errors.end_date">{{ errors.end_date }}</div>
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
                        class="w-100 mb-3"
                        @click.prevent="cancel">
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
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const store = useProjectStore();

const route = useRoute();

const { detailOfTask } = storeToRefs(store);

const { t } = useI18n();

const emit = defineEmits(['close-event', 'save-event']);

const { defineField, handleSubmit, errors, resetForm } = useForm({
    validationSchema: yup.object({
        start_date: yup.string().nullable(),
        end_date: yup.string().when('start_date', {
            is: (value) => value != undefined,
            then: function () {
                return yup.date().min(start_date.value, t('dateMustBeGreater', {date: start_date.value})).required(t('endDateRequired'))
            },
            otherwise: function () {
                return yup.string().nullable()
            }
        })
    })
})

const [start_date] = defineField('start_date');
const [end_date] = defineField('end_date');

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

function cancel() {
    resetForm();

    emit('close-event');
}

function activeFieldAction(type) {
    activeField.value = type;
}

function updatedDate(values) {
    var dateChoose = _date.format(values, 'year') + ', ' + _date.format(values, 'monthAndDate');
    if (activeField.value == 'start') {
        start_date.value = dateChoose;
    } else if (activeField.value == 'end') {
        end_date.value = dateChoose;
    }

    activeField.value = null;
}

const saveDate = handleSubmit(async (values) => {
    values.task_id = detailOfTask.value.uid;
    const resp = await store.updateDeadline(values, route.params.id);

    if (resp.status < 300) {
        emit('save-event', values);
    
        cancel();
    }
})
</script>
<script setup>
import moment from 'moment';
import { ref, watch } from 'vue';

const emit = defineEmits(['submit-event']);

const props = defineProps({
    withTimePicker: {
        type: Boolean,
        default: false
    },
    minDate: {
        type: String,
        default: ''
    },
    maxDate: {
        type: String,
        default: ''
    },
    isShow: {
        type: Boolean,
        default: false
    }
});

const isShowDatePicker = ref(false);

const time = ref('10:15');

const date = ref(new Date());

function closeDialog() {
    // reset time
    time.value = '10:15';

    emit('submit-event', null);
}

function submitDateTime() {
    let selectedDate = moment(date.value).format('YYYY, MMMM DD');
    let datetime = selectedDate + ' ' + time.value;
    
    emit('submit-event', datetime);
}

watch(props, (values) => {
    if (values) {
        isShowDatePicker.value = values.isShow;
    }
});
</script>

<template>
    <v-dialog
        v-model="isShowDatePicker"
        persistent
        width="auto">
            <v-card>
                <v-card-text style="padding: 0 !important;">
                    <div style="display: flex; gap: 10px;">
                        <v-date-picker
                            v-model="date"
                            ref="datepicker"
                            :max="props.maxDate"
                            :min="props.minDate"
                            color="primary"></v-date-picker>

                        <v-time-picker
                            v-if="props.withTimePicker"
                            rounded="xl"
                            v-model="time"
                            view-mode="hour"
                            width="50"
                        ></v-time-picker>
                    </div>

                    <v-card-actions class="d-flex align-items-center justify-end mt-4">
                        <v-btn variant="flat" color="grey-lighten-1" type="button" @click.prevent="closeDialog">Close</v-btn>
                        <v-btn variant="flat" color="primary" type="button" @click.prevent="submitDateTime">Submit</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
    </v-dialog>
</template>
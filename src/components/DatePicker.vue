<template>
    <div>
        <v-text-field
            readonly
            v-model="model"
            :clearable="true"
            :density="props.density"
            :class="pickerClass"
            :variant=" props.isSolo ? 'solo' : 'outlined'"
            :hide-details="props.isSolo"
            :single-line="props.isSolo"
            :disabled="props.isDisabled"
            :error-messages="props.errorMessage"
            @click:control="showDatePicker">

            <template v-slot:label>
                {{ props.label }}
                <v-icon 
                    :icon="mdiAsterisk" 
                    size="8" 
                    color="red"
                    v-if="props.isRequired"></v-icon>
            </template>
        </v-text-field>

        <v-dialog
            v-model="isShowDatePicker"
            width="auto">
                <v-card>
                    <v-card-text style="padding: 0 !important;">
                        <v-date-picker
                            v-model="date"
                            ref="datepicker"
                            :max="props.maxDate"
                            :min="props.minDate"
                            color="primary"
                            @update:modelValue="handleDate"></v-date-picker>
                    </v-card-text>
                </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { mdiAsterisk } from '@mdi/js';
import moment from 'moment';
    import { ref, onMounted } from 'vue';
    
    import { useDate } from 'vuetify/lib/framework.mjs';

    const _date = useDate();

    const model = defineModel()

    const minDate = new Date('2020-05-01').toISOString();
    
    const date = ref(new Date());

    const datepicker = ref(null)

    const pickerClass = ref('');

    const props = defineProps({
        customClass: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            required: true,
        },
        isRequired: {
            type: Boolean,
            default: true,
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        isSolo: {
            type: Boolean,
            default: false,
        },
        density: {
            type: String,
            default: 'default',
        },
        errorMessage: {
            type: String,
        },
        minDate: {
            type: String,
        },
        maxDate: {
            type: String,
        },
        formatOutput: {
            type: String,
            default: 'default'
        }
    })

    const isShowDatePicker = ref(false);

    function showDatePicker() {
        isShowDatePicker.value = true;
    }

    function handleDate(val) {
        let format = _date.format(date.value, 'year') + ', ' + _date.format(date.value, 'monthAndDate');

        if (props.formatOutput != 'default') {
            format = moment(format, 'YYYY, MMMM DD').format(props.formatOutput)
        }
        model.value = format;
        isShowDatePicker.value = false;
    }

    onMounted(() => {
        if (model.value) {
            date.value = new Date(model.value);
        }

        if ((props) && (props.customClass)) {
            pickerClass.value = {
                'new-border-form-control': props.isSolo
            };

            pickerClass.value[props.customClass] = true;
        }
    })
</script>
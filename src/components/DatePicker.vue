<template>
    <div>
        <v-text-field
            readonly
            v-model="model"
            variant="outlined"
            :clearable="true"
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
    import { ref } from 'vue';
    
    import { useDate } from 'vuetify/lib/framework.mjs';
import { string } from 'yup';

    const _date = useDate();

    const model = defineModel()

    const minDate = new Date('2020-05-01').toISOString();
    
    const date = ref(new Date());

    const datepicker = ref(null)

    const props = defineProps({
        label: {
            type: String,
            required: true,
        },
        isRequired: {
            type: Boolean,
            default: true,
        },
        errorMessage: {
            type: String,
        },
        minDate: {
            type: String,
        },
        maxDate: {
            type: String,
        }
    })

    const isShowDatePicker = ref(false);

    function showDatePicker() {
        isShowDatePicker.value = true;
    }

    function handleDate() {
        model.value = _date.format(date.value, 'year') + ', ' + _date.format(date.value, 'monthAndDate');
        isShowDatePicker.value = false;
    }
</script>
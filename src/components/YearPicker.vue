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
            width="auto"
            height="auto">
                <v-card
                    height="400">
                    <v-card-text>
                        <VueDatePicker
                            :model-value="date"
                            ref="datepicker"
                            @update:model-value="handleDate"
                            class="vue-date-picker"
                            @closed="pickerIsClose"
                            year-picker></VueDatePicker>
                    </v-card-text>
                </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { mdiAsterisk } from '@mdi/js';
    import { ref } from 'vue';

    import { useDate } from 'vuetify/lib/framework.mjs';

    const _date = useDate();

    const model = defineModel()

    const date = ref(_date.format(new Date(), 'year'));

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
    })

    const isShowDatePicker = ref(false);

    function showDatePicker() {
        isShowDatePicker.value = true;
        setTimeout(() => {
            datepicker.value.openMenu();
        }, 100);
    }

    function handleDate(modelData) {
        model.value = modelData;
        isShowDatePicker.value = false;
    }

    function pickerIsClose() {
      isShowDatePicker.value = false;
    }
</script>

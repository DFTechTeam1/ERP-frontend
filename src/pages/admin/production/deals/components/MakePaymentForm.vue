<script setup>
import { mdiAsterisk } from '@mdi/js';
import { useForm } from 'vee-validate';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const { defineField, errors } = useForm({
    validationSchema: yup.object({
        project_date: yup.string().required(t('dateRequired')),
        fix_price: yup.string().required(t('paymentAmountRequired'))
    })
});

const [project_date] = defineField('project_date');
const [fix_price] = defineField('fix_price');

const props = defineProps({
    selectedRemainingBills: {
        default: 0
    }
});

const pond = ref(null);

const myFiles = ref([]);

const remainingBills = ref(0);

function handleFilePondInit() {
  // example of instance method call on pond reference
  pond.value;
}

watch(props, (values) => {
    if (values) {
        remainingBills.value = values.selectedRemainingBills
    }
});
</script>

<template>
    <v-form>
        <v-row>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <currency-input v-model="fix_price"
                    density="compact"
                    class="custom-input"
                    label="Payment Amount"></currency-input>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <date-picker :label="t('paymentDate')" v-model="project_date"
                    density="compact"
                    :error-message="errors.project_date"></date-picker>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <v-label>Note</v-label>
                <field-input
                    input-type="textarea"
                    :row="3"
                    :is-solo="true"
                    :label="t('note')"></field-input>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <field-input
                    :label="t('references')"
                    :is-required="false"
                    density="compact"
                    class="custom-input"></field-input>

                <!-- remaining bills -->
                <div class="remain mt-5 d-flex align-center justify-space-between">
                    <p :style="{
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }">Remaining Bills</p>
                    <p :style="{
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }">Rp{{ remainingBills }}</p>
                </div>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-2">
                <v-label class="mb-2">
                    {{ $t("attachments") }}
                    <v-icon
                    :icon="mdiAsterisk"
                    size="8"
                    color="red"></v-icon>
                </v-label>
                <file-pond-com
                    name="test"
                    ref="pond"
                    class-name="my-pond"
                    label-idle="Drop files here..."
                    allow-multiple="true"
                    accepted-file-types="image/jpeg, image/png"
                    v-bind:files="myFiles"
                    v-on:init="handleFilePondInit"
                ></file-pond-com>
            </v-col>
        </v-row>
    </v-form>
</template>
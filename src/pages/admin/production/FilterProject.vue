<template>
    <v-dialog
        v-model="showModal"
        max-width="500"
        persistent>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between">
                    <span>{{ $t('filterProject') }}</span>
                    <v-icon
                        :icon="mdiClose"
                        class="cursor-pointer"
                        @click.prevent="closeFilter"></v-icon>
                </div>
            </v-card-title>
            <v-card-text>
                <v-form @submit="doFilter">
                    <v-row>
                        <v-col cols="12"
                            style="padding-bottom: 0 !important; padding-top: 0 !important;">
                            <field-input
                                :label="t('name')"
                                v-model="name"
                                :error-message="errors.name"
                                :is-required="false"></field-input>
                        </v-col>
                    </v-row>
                    
                    <v-row>
                        <v-col cols="12"
                            style="padding-bottom: 0 !important; padding-top: 0 !important;"
                            md="6">
                            <date-picker
                                :label="t('startDate')"
                                :is-required="false"
                                v-model="start_date"></date-picker>
                        </v-col>
                        <v-col cols="12"
                            style="padding-bottom: 0 !important; padding-top: 0 !important;"
                            md="6">
                            <date-picker
                                :label="t('endDate')"
                                :is-required="false"
                                v-model="end_date"></date-picker>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12"
                            style="padding-bottom: 0 !important; padding-top: 0 !important;">
                            <field-input
                                v-model="pic"
                                :error-message="errors.pic"
                                :is-multiple="true"
                                :label="t('pic')"
                                inputType="select"
                                :select-options="pics"
                                :is-required="false"></field-input>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12"
                            style="padding-bottom: 0 !important; padding-top: 0 !important;"
                            md="6">
                            <field-input
                                v-model="event_type"
                                :error-message="errors.event_type"
                                :is-required="false"
                                input-type="select"
                                :select-options="eventTypeList"
                                :label="t('eventType')"></field-input>
                        </v-col>
                        <v-col cols="12"
                            style="padding-bottom: 0 !important; padding-top: 0 !important;"
                            md="6">
                            <field-input
                                v-model="classification"
                                :error-message="errors.classification"
                                :is-required="false"
                                input-type="select"
                                :select-options="classList"
                                :label="t('eventClass')"></field-input>
                        </v-col>
                    </v-row>

                    <v-btn
                        width="100%"
                        type="submit"
                        class="mt-5"
                        color="primary">
                        {{ $t('search') }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { mdiClose } from '@mdi/js';
import { onMounted } from 'vue';
import { useEmployeesStore } from '@/stores/employees';
import { useProjectStore } from '@/stores/project';

const store = useEmployeesStore();

const storeProject = useProjectStore();

const { t } = useI18n()

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['filterEvent', 'closeEvent']);

const { errors, resetForm, defineField, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().nullable(),
        start_date: yup.string().nullable(),
        end_date: yup.string().nullable(),
        event_type: yup.string().nullable(),
        classification: yup.string().nullable(),
        pic: yup.array().nullable(),
    })
})

const showModal = ref(false);
const [name] = defineField('name');
const [start_date] = defineField('start_date');
const [end_date] = defineField('end_date');
const [pic] = defineField('pic');
const [event_type] = defineField('event_type');
const [classification] = defineField('classification');

const doFilter = handleSubmit((values) => {
    resetForm();
    emit('filterEvent', values);
})

const pics = ref([]);

const classList = ref([]);

const eventTypeList = ref([]);

function closeFilter() {
    resetForm();

    emit('closeEvent');
}

async function initPic() {
    const resp = await store.getProjectManager();
    
    if (resp.status < 300) {
        pics.value = resp.data.data;
    }
}

async function initClassList() {
    const resp = await storeProject.initClassList();

    if (resp.status < 300) {
        classList.value = resp.data.data;
    }
}

async function initEventType() {
    const resp = await storeProject.initEventTypes();

    if (resp.status < 300) {
        eventTypeList.value = resp.data.data;
    }
}

onMounted(() => {
});

watch(props, (values) => {
    initPic();
    initClassList();
    initEventType();
    showModal.value = values.show
})
</script>
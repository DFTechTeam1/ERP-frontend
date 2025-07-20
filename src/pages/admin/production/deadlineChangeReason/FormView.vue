<script setup>
import { showNotification } from '@/compose/notification';
import { useDeadlineChangeReasonStore } from '@/stores/deadlineChangeReason';
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    selectedItem: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['close-event']);

const store = useDeadlineChangeReasonStore();

const { 
    errors,
    defineField,
    handleSubmit,
    setFieldValue,
    resetForm
 } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
    })
});

const [name] = defineField('name');

const show = ref(false);

const loading = ref(false);

const dialogTitle = ref(t('createReason'));

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        if (Object.keys(values.selectedItem).length > 0) {
            setFieldValue('name', values.selectedItem.name);
            dialogTitle.value = t('editQuotationItem');
        } else {
            setFieldValue('name', '');
            dialogTitle.value = t('createReason');
        }
    }
});

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    let method = Object.keys(props.selectedItem).length > 0 ? 'updateReason' : 'createReason';
    let id = Object.keys(props.selectedItem).length > 0 ? props.selectedItem.id : null;
    const resp = await store[method](values, id);
    loading.value = false; 

    const message = resp.status < 300 ? resp.data.message : resp.response.data.message;
    const type = resp.status < 300 ? 'success' : 'error';
    showNotification(message, type);
    
    if (resp.status < 300) {
        emit('close-event', true);
    }
});

const closeDialog = () => {
    resetForm();
    emit('close-event', false);
}
</script>

<template>
    <v-dialog v-model="show"
        max-width="500"
        persistent>
        <master-card>
            <v-card-item>
                <v-card-text class="d-flex align-center justify-lg-space-between">
                    <p class="mb-0">{{ dialogTitle }}</p>

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="closeDialog"></v-icon>
                </v-card-text>
            </v-card-item>

            <v-card-text>
                <v-form @submit.prevent="validateData">
                    <field-input
                        v-model="name"
                        density="compact"
                        :label="$t('name')"
                        :error-message="errors.name"></field-input>

                    <div class="d-flex items-center justify-end">
                        <v-btn color="primary" variant="flat" type="submit"
                            :disabled="loading">
                            {{ $t("save") }}
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>
<script setup>
import { showNotification } from '@/compose/notification';
import { useCustomerStore } from '@/stores/customer';
import { mdiClose } from '@mdi/js';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const store = useCustomerStore();

const emit = defineEmits(['close-event']);

const loading = ref(false);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
});

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t("nameRequired")),
        phone: yup.string().required(t("phoneRequired")),
        email: yup.string().email().nullable(),
    })
});

const [name] = defineField('name');
const [phone] = defineField('phone');
const [email] = defineField('email');

const show = ref(false);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
});

const validateForm = handleSubmit(async (values) => {
    loading.value = true;
    const resp = await store.storeCustomer(values);
    loading.value = false;

    const message = resp.status < 300 ? resp.data.message : resp.response.data.message;
    const type = resp.status < 300 ? 'success' : 'error';
    showNotification(message, type);

    emit('close-event', true);
});
</script>

<template>
    <v-dialog v-model="show"
        max-width="500"
        persistent>
        <master-card>
            <v-card-item>
                <v-card-text class="d-flex align-center justify-lg-space-between">
                    <p class="mb-0">{{ $t('addCustomer') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        size="15"
                        class="pointer"
                        @click.prevent="$emit('close-event', false)"></v-icon>
                </v-card-text>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateForm">
                    <field-input
                        density="comfortable"
                        v-model="name"
                        custom-class="custom-input"
                        :error-message="errors.name"
                        :label="t('name')"></field-input>

                    <field-input
                        density="comfortable"
                        v-model="phone"
                        class="mt-5"
                        custom-class="custom-input"
                        :error-message="errors.phone"
                        :label="t('phone')"></field-input>

                    <field-input
                        density="comfortable"
                        v-model="email"
                        class="mt-5"
                        custom-class="custom-input"
                        :error-message="errors.email"
                        :is-required="false"
                        :label="t('email')"></field-input>

                    <div class="d-flex w-100 mt-8" :style="{ justifyContent: 'end' }">
                        <v-btn variant="flat" color="primary" type="submit" :disabled="loading">
                            {{ $t('save') }}
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </master-card>
    </v-dialog>
</template>
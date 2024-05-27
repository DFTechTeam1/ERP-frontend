<template>
    <v-dialog
        v-model="show"
        max-width="600"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('addTask') }}
                    <v-icon
                        :icon="mdiClose"
                        color="red"
                        size="20"
                        @click.prevent="$emit('close-event')"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <field-input
                        :label="t('name')"
                        v-model="name"
                        :error-message="errors.name"></field-input>

                    <button-submit
                        :is-loading="loading"></button-submit>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';

const emit = defineEmits(['close-event']);

const store = useProjectStore();

const { t } = useI18n();

const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
    }),
});

const [name] = defineField('name');

const loading = ref(false);

const show = ref(false);

const props = defineProps({
    board: {
        default: null,
    },
    isShow: {
        type: Boolean,
        default: false,
    }
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
})

const validateData = handleSubmit(async(values) => {
    loading.value = true;
    const resp = await store.addTask(values, props.board.id);
    loading.value = false;
    if (resp.status < 300) {
        resetForm();
        emit('close-event');
    }
});
</script>
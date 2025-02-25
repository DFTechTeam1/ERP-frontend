<script setup>
import { showNotification } from '@/compose/notification';
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    editData: {
        type: Object,
        default: null
    }
});

const { defineField, errors, handleSubmit, resetForm, setFieldValue } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t("songRequired"))
    })
});

const [name] = defineField('name');

const show = ref(false);

const loading = ref(false);

const emit = defineEmits(['close-event']);

function closeForm() {
    resetForm();
    emit('close-event');
}

const validateData = handleSubmit(async (values) => {
    loading.value = true;
    const resp = await store.updateSong(detailProject.value.uid, props.editData.uid, {song: values.name});
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message);
        closeForm();
    } else {
        showNotification(resp.response.data.message, 'error');
    }
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;

        if (values.editData) {
            setFieldValue('name', values.editData.name);
        }
    }
})
</script>

<template>
    <v-dialog
        v-model="show"
        max-width="500"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p>{{ $t('addSongs') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        @click.prevent="closeForm"
                        size="20"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-alert
                    class="mb-5"
                    :text="t('infoMusicHasBeenDistributed')"
                    density="compact"
                    v-if="editData.task"
                    :title="t('info')"
                    type="info"
                    variant="tonal"
                ></v-alert>

                <v-form @submit.prevent="validateData">
                    <field-input
                        :label="t('name')"
                        v-model="name"
                        density="compact"
                        :error-message="errors.name"></field-input>

                    <div class="d-flex align-end justify-end mt-3">
                        <v-btn
                            variant="flat"
                            color="primary"
                            :disabled="loading"
                            type="submit">
                            <template v-if="loading">
                                {{ $t("processing") }}
                            </template>
                            <template v-else>
                                {{ $t("save") }}
                            </template>
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
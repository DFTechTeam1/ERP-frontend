<script setup>
import { showNotification } from '@/compose/notification';
import { useProjectStore } from '@/stores/project';
import { mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useForm, useFieldArray, useField } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

const store = useProjectStore();

const {
    detailProject
} = storeToRefs(store);

const { resetForm, defineField, errors, handleSubmit } = useForm({
    validationSchema: yup.object({
        songs: yup.array().of(
            yup.object().shape({
                name: yup.string().required(t("songRequired"))
            })
        )
    }),
    initialValues: {
        songs: [{name: ''}]
    }
});

const { push, fields, remove, replace } = useFieldArray('songs');

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

const emit = defineEmits(['close-event']);

const show = ref(false);

const loading = ref(false);

function closeForm() {
    console.log("close");
    resetForm()
    emit('close-event')
}

const validateData = handleSubmit(async (values) => {
    var output = [];
    for (let a = 0; a < values.songs.length; a++) {
        output.push(values.songs[a].name);
    }

    loading.value = true;
    const resp = await store.storeSong(detailProject.value.uid, {songs: output});
    loading.value = false;

    if (resp.status < 300) {
        showNotification(resp.data.message, 'success');
        closeForm();
    } else {
        showNotification(resp.response.data.message, 'error');
    }
});

watch(props, (values) => {
    if (values) {
        show.value = values.isShow

        console.log("values", values);
        if (values.editData) {    
            replace([{
                name: values.editData.name
            }]);
        }
    }
});
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
                <v-form @submit.prevent="validateData">
                    <div class="form-parent">
                        <div class="form-wrapper d-flex align-center"
                            v-for="(field, x) in fields"
                            :key="field.key"
                            :id="'row-song-' + x">
                            <field-input
                                class="w-100"
                                :class="{
                                    'mb-3': errors[`songs[${x}].name`]
                                }"
                                :label="t('name')"
                                density="compact"
                                v-model="field.value.name"
                                :error-message="errors[`songs[${x}].name`]"></field-input>
    
                            <v-icon
                                class="mb-5 ms-3 pointer"
                                :icon="mdiClose"
                                @click.prevent="remove(x)"
                                size="20"
                                color="red"></v-icon>
                        </div>
                        <v-btn variant="tonal"
                            color="secondary"
                            size="small"
                            class="w-100"
                            type="button"
                            @click.prevent="push({name: ''})">
                            {{ $t("addMore") }}
                        </v-btn>
                    </div>

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

<style scoped lang="scss">
.form-parent {
    border: 1px solid #e6e6e6;
    padding: 12px;
    border-radius: 10px;
}
</style>
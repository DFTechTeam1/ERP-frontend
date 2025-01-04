<template>
    <v-dialog
        v-model="show"
        max-width="500"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p>{{ $t('addReferences') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        @click.prevent="closeForm"
                        size="20"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text
                class="mt-5">
                <v-form
                    @submit="validateData">
                        <div class="reference-form-wrapper">
                            <div class="reference-form-wrapper__button">
                                <v-btn-toggle
                                    v-model="tab"
                                    rounded="0"
                                    density="compact"
                                    color="primary"
                                    group>
                                    <v-btn value="link"
                                        density="compact">
                                        {{ $t('link') }}
                                    </v-btn>
                                    <v-btn value="images"
                                        density="compact">
                                        {{ $t('images') }}
                                    </v-btn>
                                </v-btn-toggle>    
                            </div>

                            <div class="reference-form-wrapper__form">
                                <div class="images-form" v-if="tab == 'link'">
                                    <div class="link-wrapper w-100">
                                        <div class="link-item d-flex ga-3 w-100"
                                            v-for="(link, lx) in fieldLink"
                                            :key="link.key">
                                            <field-input
                                                :label="t('name')"
                                                density="compact"
                                                class="w-50"
                                                :class="{
                                                    'mb-2': errors[`link[${lx}].name`]
                                                }"
                                                v-model="link.value.name"
                                                :error-message="errors[`link[${lx}].name`]"
                                                :is-solo="true"></field-input>

                                            <field-input :label="t('link')"
                                                density="compact"
                                                class="w-50"
                                                :class="{
                                                    'mb-2': errors[`link[${lx}].href`]
                                                }"
                                                v-model="link.value.href"
                                                :error-message="errors[`link[${lx}].href`]"
                                                :is-solo="true"></field-input>

                                            <v-icon
                                                v-if="lx == 0"
                                                :icon="mdiPlus"
                                                @click.prevent="pushLink({href: ''})"
                                                class="mt-3 pointer"
                                                color="primary"></v-icon>
                                            <v-icon
                                                v-else
                                                :icon="mdiClose"
                                                color="red"
                                                @click.prevent="removeLink(lx)"
                                                class="mt-3 pointer"></v-icon>
                                        </div>
                                    </div>
                                </div>
                                <div class="images-form" v-if="tab == 'images'">
                                    <file-pond-com
                                        ref="pond"
                                        class-name="my-pond"
                                        label-idle="Drop files here..."
                                        allow-multiple="true"
                                        v-on:updatefiles="updateImages"
                                        accepted-file-types="image/png, image/jpg, image/jpeg, application/pdf"
                                    ></file-pond-com>
                                    <div class="invalid-feedback" 
                                        style="padding-inline: 16px;"
                                        v-if="fileErrorRequired">
                                        File is required
                                    </div>
                                </div>
                            </div>
    
                        </div>

                        <button-submit
                            :is-loading="loading"></button-submit>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
.reference-form-wrapper {
    &__button {
        border-bottom: 1px solid #e6e6e6;
        margin-bottom: 8px;
    }
}
</style>

<script setup>
import { mdiClose, mdiPlus } from '@mdi/js';
import { ref, watch } from 'vue';
import * as yup from 'yup';
import { useForm, useFieldArray } from 'vee-validate';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/stores/project';
import { useI18n } from 'vue-i18n'

const store = useProjectStore();

const { detailProject } = storeToRefs(store);

const { t } = useI18n()

const tab = ref('link')

const { errors, handleSubmit, resetForm } = useForm({
    validationSchema: yup.object({
        files: yup.array().of(
            yup.object().shape({
                path: yup.string().nullable(),
            }),
        ),
        link: yup.array().of(
                yup.object().shape({
                    href: yup.string()
                        .matches(/^(?=.*(http:\/\/|\\\\192*|https:\/\/|file:\/\/)).+$/, {
                        message: 'String must start with http:// or \\\\192..... or https:// or file://',
                            excludeEmptyString: true,
                        }),
                    name: yup.string().nullable()
                })
            )
    }),
    initialValues: {
        files: [
            {path: ''},
        ],
        link: [{href: '', name: ''}],
    },
});

const { replace } = useFieldArray('files');

const { replace: replaceLink, fields: fieldLink, push: pushLink, remove: removeLink } = useFieldArray('link');

const emit = defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const show = ref(false);

const loading = ref(false);

const pond = ref(null);

const fileErrorRequired = ref(false);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

watch(errors, (values) => {
    if (values['files[0].path']) {
        fileErrorRequired.value = true;
    }
})

const validateData = handleSubmit(async(values) => {
    loading.value = true;
    var formData = new FormData();
    for (let a = 0; a < values.files.length; a++) {
        formData.append(`files[${a}][path]`, values.files[a].path)
    }

    for (let b = 0; b < values.link.length; b++) {
        formData.append(`link[${b}][href]`, values.link[b].href)
        formData.append(`link[${b}][name]`, values.link[b].name)
    }
    const resp = await store.storeReferences(formData, detailProject.value.uid);
    loading.value = false;

    if (resp.status < 300) {
        resetForm();
        emit('close-event');
    }
});

function updateImages() {
    if (pond.value.getFiles().length) {
        var files = [];
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            files.push({
                path: pond.value.getFiles()[a].file
            });
        }

        replace(files);
        fileErrorRequired.value = false;
    } else {
        replace([{path: ''}]);
        fileErrorRequired.value = true;
    }
}

function closeForm() {
    resetForm()
    emit('close-event')
}
</script>
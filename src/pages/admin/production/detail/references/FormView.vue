<template>
    <v-dialog
        v-model="show"
        max-width="600"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p>{{ $t('addReferences') }}</p>

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        @click.prevent="$emit('close-event')"
                        size="20"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text
                class="mt-5">
                <v-form>
                    <field-input
                        :label="t('name')"
                        v-model="name"
                        :error-message="errors.name"></field-input>

                        <file-pond-com
                            ref="pond"
                            class-name="my-pond"
                            label-idle="Drop files here..."
                            allow-multiple="true"
                            accepted-file-types="image/jpeg, image/png"
                        ></file-pond-com>

                        <v-btn
                            class="mt-5 w-100"
                            variant="flat"
                            color="primary"
                            type="submit">
                            {{ $t('save') }}
                        </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

const { t } = useI18n();

const { defineField, errors } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
    }),
});

const [name] = defineField('name');

defineEmits(['close-event']);

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const show = ref(false);

const pond = ref(null);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})
</script>
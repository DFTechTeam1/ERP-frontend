<template>
    <v-dialog
        v-model="show"
        max-width="600"
        transition="dialog-top-transition"
        persistent>
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    <p style="font-weight: bolder;">Ask Developers</p>

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        @click.prevent="closeModal"
                        size="20"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form
                    @submit="validateData">
                    <field-input
                        label="Name"
                        v-model="name"
                        :error-message="errors.name"></field-input>
    
                    <field-input
                        label="Email"
                        v-model="email"
                        :is-required="false"
                        :error-message="errors.email"></field-input>
    
                    <field-input
                        label="Topic"
                        inputType="select"
                        :select-options="topics"
                        v-model="topic"
                        :error-message="errors.topic"></field-input>
    
                    <field-input
                        label="Addon"
                        inputType="select"
                        :select-options="addons"
                        v-if="topic == 'addon'"
                        v-model="addon"
                        :error-message="errors.addon"></field-input>
    
                    <field-input
                        inputType="textarea"
                        v-model="message"
                        :error-message="errors.message"
                        label="Request addons or report bugs to the developer"></field-input>
                        
                    <v-btn
                        :disabled="loading"
                        class="mt-4 btn-ask"
                        type="submit">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>Apply</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.btn-ask {
    width: 100%;
    background-color: #000;
    color: #fff;
}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { mdiClose } from '@mdi/js';
import { useAddonStore } from '@/stores/addon';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useAddonStore();

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
})

const { defineField, setFieldValue, handleSubmit, resetForm, errors } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        email: yup.string().nullable(),
        topic: yup.string().required(),
        addon: yup.string().when('topic', {
            is: (value) => value == 'addon' ? true : false,
            then: function () {
                return yup.string().required();
            },
            otherwise: function () {
                return yup.string().nullable();
            }
        }),
        message: yup.string().required(),
    })
})

const [name] = defineField('name');
const [email] = defineField('email');
const [topic] = defineField('topic');
const [addon] = defineField('addon');
const [message] = defineField('message');

const addons = ref([]);

const show = ref(false)

const loading = ref(false);

const topics = ref([
    {title: 'Addon', value: 'addon'},
    {title: 'General', value: 'general'},
]);

const emit = defineEmits(['close-ask']);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

watch(topic, (values) => {
    if (values == 'general') {
        setFieldValue('addon', null); // reset
    }
})

async function initAddon() {
    const response = await store.getAllAddons();

    if (response.status < 300) {
        addons.value = response.data.data;
    }
}

const validateData = handleSubmit(async(values) => {
    loading.value = true;
    const resp = await store.askDeveloper(values);
    loading.value = false;

    console.log('res', resp);

    if (resp.status < 300) {
        closeModal();
    }
});

function closeModal() {
    resetForm();
    emit('close-ask');
}

onMounted(() => {
    initAddon();
})
</script>
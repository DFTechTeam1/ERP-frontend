<template>
    <div>
        <breadcrumb-data
            :title="$t('inventories')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ $t('createInventory') }}</v-card-title>
            </v-card-item>

            <v-divider></v-divider>

            <v-card-text>
                <v-form @submit="onSubmit">
                    <field-input
                        :label="t('stock')"
                        v-model="stock"
                        :errorMessage="errors.stock"></field-input>
                    <div 
                        v-for="(field, x) in fields"
                        :key="field.key">
                        <v-text-field
                            v-model="field.value.location"
                            :error-messages="errors[`items[${x}].location`]"
                            label="name"></v-text-field>
                        <!-- <div>{{ errors.items[x].item_name }}</div> -->

                    </div>

                    <button type="button" @click="push({ url: '' })">Add</button>
                    <button>Submit</button>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup'
import { watch } from 'vue';

const { t } = useI18n();

const { handleSubmit, errors, defineField } = useForm({
    validationSchema: yup.object({
        items: yup.array().of(
            yup.object().shape({
                item_name: yup.string().required('Items is required'),
                location: yup.string().required('Location is required'),
            })
        ),
        stock: yup.number().required(),
    }),
    initialValues: {
        items: [
            {item_name: '', location: ''}
        ]
    }
});

const { remove, push, fields } = useFieldArray('items');
const [stock] = defineField('stock');

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('inventories'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
    {
        title: t('createInventory'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

const onSubmit = handleSubmit(values => {
    console.log('values', values);
    // useError(storeResult, setErrors);
});

watch(errors, (values) => {
    console.log('errors', values);
})
</script>
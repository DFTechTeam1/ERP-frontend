<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="600">
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('requestEquipment') }}

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        size="20"
                        @click.prevent="$emit('close-event')"
                        color="red"></v-icon>
                </v-card-title>
            </v-card-item>

            <v-card-text>
                <v-form @submit="validateData">
                    <div class="item-wrapper">
                        <div class="item-equipment bg-grey-lighten-3 rounded"
                            v-for="(field, x) in fields"
                            :key="x">
                            <v-row>
                                <v-col
                                    cols="12"
                                    lg="6"
                                    md="6">
                                    <field-input
                                        :label="t('name')"
                                        inputType="select"
                                        v-model="field.value.inventory_id"
                                        :error-message="errors[`equipments[${x}].inventory_id`]"
                                        :custom-options="true"
                                        :select-options="inventories">
                                        <template v-slot:selectOption="{props, item}">
                                            <v-list-item
                                                v-bind="props"
                                                :prepend-avatar="item.raw.image">

                                                <template v-slot:title>
                                                    {{ item.raw.title }}
                                                </template>
                                                <template v-slot:subtitle>
                                                    <v-chip
                                                        v-for="(location, i) in item.raw.location"
                                                        :key="i"
                                                        :color="location.color"
                                                        size="small">
                                                        {{ location.text }}
                                                    </v-chip>
                                                </template>

                                            </v-list-item>
                                        </template>
                                    </field-input>
                                </v-col>
                                <v-col
                                    cols="12"
                                    lg="6"
                                    md="6">
                                    <field-input
                                        v-model="field.value.qty"
                                        :error-message="errors[`equipments[${x}].qty`]"
                                        :label="t('quantity')"></field-input>
                                </v-col>
                            </v-row>
                        </div>

                        <div class="item-equipment bg-grey-lighten-3 rounded d-flex align-center justify-center mt-3">
                            <v-btn
                                @click.prevent="push({inventory_id: '', qty: 1})">
                                <v-icon
                                    :icon="mdiPlusCircle"></v-icon>
                            </v-btn>
                        </div>
                    </div>

                    <v-btn
                        class="mt-3 w-100"
                        variant="flat"
                        :disabled="loading"
                        color="primary"
                        type="submit">
                        <template v-if="loading">{{ $t("processing") }}</template>
                        <template v-else>
                            {{ $t('save') }}
                        </template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.item-equipment {
    padding: 8px 12px;
    margin-bottom: 12px;
}
</style>

<script setup>
import { mdiClose, mdiPlusCircle } from '@mdi/js';
import { watch } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoriesStore } from '@/stores/inventories';
import { useProjectStore } from '@/stores/project';
import { useForm, useFieldArray, useField } from 'vee-validate';
import * as yup from 'yup';
import { useRoute } from 'vue-router';

const route = useRoute();

const storeInventory = useInventoriesStore();
const store = useProjectStore();

const { t } = useI18n();

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close-event']);

const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: yup.object({
        equipments: yup.array().of(
            yup.object().shape({
                inventory_id: yup.string().required(t('inventoryItemRequired')),
                qty: yup.number()
                    .transform((currentValue) => currentValue == "" ? undefined : currentValue)
                    .required(t('qtyRequired'))
                    .typeError(t('mustBeNumber'))
            })
        )
    })
})

const { push, fields, replace } = useFieldArray('equipments');

const show = ref(false);

const loading = ref(false);

const inventories = ref([]);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }

    initInventories();
})

async function initInventories() {
    const resp = await storeInventory.getAll();

    if (resp.status < 300) {
        inventories.value = resp.data.data;
    }
}

const validateData = handleSubmit(async (values) => {
    const resp = await store.requestEquipment(values, route.params.id);

    if (resp.status < 300) {
        resetForm()
        replace([])
        emit('close-event');
    }
})
</script>
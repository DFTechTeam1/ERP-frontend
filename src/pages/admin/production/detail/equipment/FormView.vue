<template>
    <v-dialog
        v-model="show"
        persistent
        max-width="700">
        <v-card>
            <v-card-item>
                <v-card-title class="d-flex align-center justify-space-between">
                    {{ $t('requestEquipment') }}

                    <v-icon
                        :icon="mdiClose"
                        class="pointer"
                        size="20"
                        @click.prevent="closeForm"></v-icon>
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
                                  lg="4"
                                  md="4">
                                  <field-input
                                    :label="t('itemType')"
                                    :key-index="x"
                                    input-type="select"
                                    density="compact"
                                    :error-message="errors[`equipments[${x}].item_type`]"
                                    v-model="field.value.item_type"
                                    :select-options="itemTypes"
                                    @changes-event="getListInventories"></field-input>
                                </v-col>

                                <v-col
                                    cols="12"
                                    lg="4"
                                    md="4">
                                    <field-input
                                        :label="t('name')"
                                        inputType="select"
                                        density="compact"
                                        v-model="field.value.inventory_id"
                                        :is-disabled="nameDisable"
                                        :error-message="errors[`equipments[${x}].inventory_id`]"
                                        :custom-options="true"
                                        :key-index="x"
                                        :select-options="listedInventories[x]"
                                        @changes-event="selectInventory">
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
                                    lg="3"
                                    md="3">
                                    <field-input
                                        v-model="field.value.qty"
                                        density="compact"
                                        :is-clearable="field.value.item_type !== 'bundle'"
                                        :is-readonly="field.value.item_type === 'bundle'"
                                        :error-message="errors[`equipments[${x}].qty`]"
                                        :label="t('quantity')"></field-input>
                                </v-col>
                                <v-col
                                    cols="12"
                                    md="1"
                                    lg="1">
                                    <v-icon :icon="mdiClose"
                                        size="15"
                                        @click.prevent="removeLine(x)"
                                        class="pointer"
                                        color="red"></v-icon>
                                </v-col>
                            </v-row>

                            <div class="helper-bundling"
                              v-if="((availableLine.length) && (availableLine[x].items) && (availableLine[x].items.length > 0))">
                              <p
                                class="mb-5"
                                :style="{ fontSize: '13px', fontWeight: 'bold' }">{{ $t('listItemOnBundle') }}</p>
                              <v-row
                                v-for="(item, ii) in availableLine[x].items"
                                :key="ii"
                                :id="'detail-bundle-' + ii + '-' + x">
                                <v-col
                                  cols="12"
                                  md="8"
                                  lg="8"
                                  :style="{
                                  paddingTop: '0',
                                  paddingBottom: '0'
                                  }">
                                  <v-text-field
                                    :value="item.name"
                                    density="compact"
                                    variant="outlined"
                                    :readonly="true"></v-text-field>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="3"
                                  lg="3"
                                  :style="{
                                  paddingTop: '0',
                                  paddingBottom: '0'
                                  }">
                                  <v-text-field
                                    :value="item.qty"
                                    density="compact"
                                    variant="outlined"
                                    :readonly="true">
                                  </v-text-field>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  lg="1"
                                  :style="{
                                  paddingTop: '0',
                                  paddingBottom: '0'
                                  }">
                                  <v-icon
                                    :icon="mdiTrashCan"
                                    size="15"
                                    color="red"
                                    class="pointer"
                                    @click.prevent="deleteBundleList(ii, x)"></v-icon>
                                </v-col>
                              </v-row>
                            </div>
                        </div>

                        <div class="item-equipment bg-grey-lighten-3 rounded d-flex align-center justify-center mt-3">
                            <v-btn
                                @click.prevent="addMoreLine">
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
import {mdiCircle, mdiClose, mdiMinus, mdiPlus, mdiPlusCircle, mdiTrashCan} from '@mdi/js';
import { watch } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoriesStore } from '@/stores/inventories';
import { useProjectStore } from '@/stores/project';
import { useForm, useFieldArray, useField } from 'vee-validate';
import * as yup from 'yup';
import { useRoute } from 'vue-router';
import FieldInput from "@/components/FieldInput.vue";

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
                    .typeError(t('mustBeNumber')),
                item_type: yup.string().required(t('itemTypeRequired')),
            })
        )
    })
})

const { push, fields, replace, remove } = useFieldArray('equipments');

const itemTypes = ref([
  {
    value: 'bundle',
    title: "Bundle",
  },
  {
    value: 'equipment',
    title: "Equipment",
  }
])

const availableLine = ref([]);

const listedInventories = ref([]);

const nameDisable = ref(true);

const show = ref(false);

const loading = ref(false);

const inventories = ref([]);

watch(props, (values) => {
    if (values) {
        show.value = values.isShow;
    }
})

function getListInventories(payload) {
  inventories.value = [];
  initInventories({type: payload.payload, index: payload.index});

  // reset inventory field
  fields.value[payload.index].value.inventory_id = ''

  availableLine.value[payload.index] = [];
}

function deleteBundleList(index, parentIndex) {
  // delete from variable
  availableLine.value[parentIndex].items.splice(index, 1);
}

function closeForm() {
  resetForm();
  replace([]);
  availableLine.value = [];
  listedInventories.value = [];
  emit('close-event');
}

async function initInventories(payload = null) {
    const resp = await  storeInventory.getAll(payload);

    if (resp.status < 300) {
        nameDisable.value = false;
        inventories.value = resp.data.data;

      // edit available line
      if (payload.type !== undefined) {
        listedInventories.value[payload.index] = resp.data.data;
      }
    }
}

function refactorPayload(original, items) {
  original.equipments.map((item, index) => {
    if (item.item_type === 'bundle') {
      item.inventories = items[index].items;
    } else {
      item.inventories = [];
    }
  })

  return original;
}

const validateData = handleSubmit(async (values) => {
    console.log('avalable', availableLine.value)
    console.log('listed', listedInventories.value);

    // refoctor payload
    var newValues = refactorPayload(values, availableLine.value);

    console.log('values', newValues);

    loading.value = true
    const resp = await store.requestEquipment(newValues, route.params.id);
    loading.value = false

    if (resp.status < 300) {
        resetForm()
        replace([])
        emit('close-event');
    }
})

function addMoreLine() {
  push({inventory_id: '', qty: 1, item_type: ''});
  availableLine.value.push([]);
  listedInventories.value.push([]);
}

function removeLine(index) {
  availableLine.value.splice(index, 1);
  listedInventories.value.splice(index, 1);

  remove(index);
}

function selectInventory(payload) {
  // reduce
  availableLine.value[payload.index] = listedInventories.value[payload.index].filter((filter) => {
    return filter.value === payload.payload;
  })[0]
}
</script>

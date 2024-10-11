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
                <v-form @submit="validateData">
                    <template v-if="loadingPrepare">
                        <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
                        <p class="text-center">
                            {{ $t('preparingData') }}
                        </p>
                    </template>
                    <template v-else>
                        <v-tabs
                            v-model="formTab">
                            <v-tab value="general">{{ $t('general') }}</v-tab>
                            <v-tab value="images">{{ $t('images') }}</v-tab>
                        </v-tabs>

                        <v-window v-model="formTab" class="no-shadow">
                            <v-window-item value="images" class="pb-5">
                                <v-row
                                    class="mt-3"
                                    v-if="previewImage.length">
                                    <v-col
                                        cols="12"
                                        md="2"
                                        lg="2"
                                        v-for="(image,x) in previewImage"
                                        :key="x">
                                        <div
                                            class="box-preview-image position-relative"
                                            :id="'preview-image-' + x">
                                            <v-icon
                                                :icon="mdiCloseCircle"
                                                color="red"
                                                size="25"
                                                class="position-absolute icon-close"
                                                @click.prevent="deletePreviewImage(x, image.id)"></v-icon>
                                            <v-img
                                                :src="image.image"
                                                width="40"
                                                height="auto"></v-img>

                                            <input
                                                type="hidden"
                                                :id="'preview-image-key-' + x"
                                                :value="image.id" />
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row class="mt-3">
                                    <v-col>
                                        <file-pond-com
                                            name="test"
                                            ref="pond"
                                            class-name="my-pond"
                                            label-idle="Drop files here..."
                                            allow-multiple="true"
                                            accepted-file-types="image/jpeg, image/png"
                                            v-bind:files="myFiles"
                                            v-on:init="handleFilePondInit"
                                        ></file-pond-com>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                            <v-window-item value="general" class="pb-5">
                                <v-row class="mt-3">
                                    <v-col cols="12" lg="6" md="6">
                                        <div class="form-group">
                                            <field-input
                                                :errorMessage="errors.name"
                                                v-model="name"
                                                :label="t('name')"></field-input>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" lg="6" md="6">
                                        <div class="form-group">
                                            <field-input
                                                v-model="item_type"
                                                :label="t('inventoryType')"
                                                :errorMessage="errors.item_type"
                                                inputType="select"
                                                :selectOptions="inventoryTypesAll"></field-input>
                                        </div>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" lg="6" md="6">
                                        <div class="form-group">
                                            <field-input
                                                v-model="unit_id"
                                                :label="t('units')"
                                                :errorMessage="errors.unit_id"
                                                inputType="select"
                                                :selectOptions="listOfAllUnits"></field-input>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" lg="6" md="6">
                                        <div class="form-group">
                                            <field-input
                                                v-model="brand_id"
                                                :label="t('brand')"
                                                :errorMessage="errors.brand_id"
                                                inputType="select"
                                                :selectOptions="listOfAllBrands"></field-input>
                                        </div>
                                    </v-col>
                                </v-row>

                                <v-row class="mb-3">
                                    <v-col cols="12" lg="4" md="4">
                                        <div class="form-group">
                                            <field-input
                                                v-model="warehouse_id"
                                                :label="t('warehouse')"
                                                :errorMessage="errors.warehouse_id"
                                                inputType="select"
                                                :isRequired="false"
                                                :selectOptions="warehouseList"></field-input>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4">
                                        <div class="form-group">
                                            <field-input
                                                v-model="supplier_id"
                                                :label="t('supplier')"
                                                :errorMessage="errors.supplier_id"
                                                inputType="select"
                                                :isRequired="false"
                                                :selectOptions="listOfAllSuppliers"></field-input>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" lg="4" md="4">
                                        <div class="form-group">
                                            <field-input
                                                :errorMessage="errors.stock"
                                                v-model="stock"
                                                :isDisabled="true"
                                                @change="updateStock"
                                                :label="t('stock')"></field-input>
                                        </div>
                                    </v-col>
                                </v-row>

                                <!-- Each stock form -->
                                <v-expansion-panels
                                    v-model="openPanel"
                                    color="primary"
                                    class="mb-5 no-shadow">
                                    <v-expansion-panel
                                        :title="t('itemLocation')"
                                        color="primary"
                                        class="no-shadow">
                                        <v-expansion-panel-text>
                                            <div
                                                class="box-item-stock mt-3 position-relative"
                                                v-for="(boxStock, keyBox) in fields"
                                                :id="'box-item-stock-' + boxStock.key"
                                                :key="boxStock.key">
                                                <template v-if="!boxStock.value.is_on_edit.length">
                                                  <div
                                                    v-if="keyBox > 0"
                                                    class="box-item-stock-remove"
                                                    @click.prevent="removeBoxStock(boxStock.key)">
                                                    <v-icon
                                                      :icon="mdiCloseCircle"
                                                      color="red"
                                                      size="25"></v-icon>
                                                  </div>
                                                </template>
                                                <v-row>
                                                    <v-col
                                                        cols="12"
                                                        :lg="boxStock.value.location == 1 ? 4 : 6"
                                                        :md="boxStock.value.location == 1 ? 4 : 6">
                                                        <v-text-field
                                                            :label="t('itemName')"
                                                            :disabled="true"
                                                            v-model="nameMirror"
                                                            variant="outlined"></v-text-field>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        :lg="boxStock.value.location == 1 ? 4 : 6"
                                                        :md="boxStock.value.location == 1 ? 4 : 6">
                                                        <field-input
                                                            :label="t('itemLocation')"
                                                            :isRequired="false"
                                                            v-model="boxStock.value.location"
                                                            :errorMessage="errors[`item_locations[${keyBox}].location`]"
                                                            inputType="select"
                                                            :selectOptions="itemLocations"></field-input>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        lg="4"
                                                        md="4"
                                                        v-if="boxStock.value.location == 1">
                                                        <field-input
                                                            inputType="select"
                                                            v-model="boxStock.value.user_id"
                                                            :label="t('pic')"
                                                            :errorMessage="errors[`item_locations[${keyBox}].user_id`]"
                                                            :selectOptions="listOfAllEmployees"></field-input>
                                                    </v-col>
                                                </v-row>

                                                <v-row>
                                                  <v-col
                                                    cols="12"
                                                    lg="4"
                                                    md="4">
                                                    <year-picker
                                                      v-model="boxStock.value.year_of_purchase"
                                                      :label="t('yearOfPurchase')"
                                                      :isRequired="false"></year-picker>
                                                  </v-col>
                                                  <v-col
                                                    cols="12"
                                                    lg="4"
                                                    md="4">
                                                    <field-input
                                                      v-model="boxStock.value.warranty"
                                                      :label="t('warranty')"
                                                      :isRequired="false"
                                                      :suffixText="t('year')"></field-input>
                                                  </v-col>
                                                  <v-col
                                                    cols="12"
                                                    lg="4"
                                                    md="4">
                                                    <field-input
                                                      v-model="boxStock.value.purchase_price"
                                                      :error-message="errors[`item_locations[${keyBox}].purchase_price`]"
                                                      :label="t('purchasePrice')"
                                                      :isRequired="false"
                                                      :prefixText="t('rupiah')"></field-input>
                                                  </v-col>
                                                </v-row>
                                            </div>

                                            <div
                                                class="box-item-stock mt-3"
                                                id="box-item-stock-add">
                                                <v-row>
                                                    <v-col
                                                        class="d-flex align-center justify-center ma-auto">
                                                        <div
                                                            class="text-center border-dotted cursor-pointer"
                                                            style="border-color: rgba(0,0,0,.2);"
                                                            @click.prevent="addMoreStock">
                                                            <v-icon
                                                                :icon="mdiPlusBox"
                                                                color="success"
                                                                size="50">
                                                            </v-icon>
                                                            <v-tooltip
                                                                activator="parent"
                                                                :text="t('addMoreStock')"></v-tooltip>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                                <!-- End Each stock form -->

<!--                                <v-row>-->
<!--                                    <v-col-->
<!--                                        cols="12"-->
<!--                                        lg="4"-->
<!--                                        md="4">-->
<!--                                        <year-picker-->
<!--                                            v-model="year_of_purchase"-->
<!--                                            :label="t('yearOfPurchase')"-->
<!--                                            :isRequired="false"></year-picker>-->
<!--                                    </v-col>-->
<!--                                    <v-col-->
<!--                                        cols="12"-->
<!--                                        lg="4"-->
<!--                                        md="4">-->
<!--                                        <field-input-->
<!--                                            v-model="warranty"-->
<!--                                            :label="t('warranty')"-->
<!--                                            :isRequired="false"-->
<!--                                            :suffixText="t('year')"></field-input>-->
<!--                                    </v-col>-->
<!--                                    <v-col-->
<!--                                        cols="12"-->
<!--                                        lg="4"-->
<!--                                        md="4">-->
<!--                                        <field-input-->
<!--                                            v-model="purchase_price"-->
<!--                                            :error-message="errors.purchase_price"-->
<!--                                            :label="t('purchasePrice')"-->
<!--                                            :isRequired="false"-->
<!--                                            :prefixText="t('rupiah')"></field-input>-->
<!--                                    </v-col>-->
<!--                                </v-row>-->

                                <v-row class="mb-15">
                                    <v-col cols="12" lg="12" md="12">
                                        <v-label :text="t('description')" class="mb-3"></v-label>
                                        <QuillEditor
                                            theme="snow"
                                            ref="description_quill"
                                            @update:content="updateDescription" />
                                        <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                        </v-window>


                        <v-row>
                            <v-col>
                                <v-btn
                                    height="auto"
                                    type="submit"
                                    size="small"
                                    class="btn-primary pt-3 pb-3 mt-3">
                                    <template v-if="isLoading">
                                        {{ $t('processing') }}
                                    </template>
                                    <template v-else>
                                        {{ $t('save') }}
                                    </template>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoriesStore } from '@/stores/inventories';
import { useInventoryTypeStore } from '@/stores/inventoryType';
import { useEmployeesStore } from '@/stores/employees';
import { useBrandStore } from '@/stores/brand';
import { useUnitStore } from '@/stores/unit';
import { useSupplierStore } from '@/stores/supplier';
import { storeToRefs } from 'pinia';
import * as yup from 'yup'
import { useForm, useFieldArray } from 'vee-validate';
import { watch } from 'vue';
import { useError } from '@/compose/handleError'
import { useRouter, useRoute } from 'vue-router';
import { mdiCloseCircle, mdiPlusBox } from '@mdi/js';
import FieldInput from "@/components/FieldInput.vue";

// yup.setLocale({
//     mixed: {
//       required: '${attribute} Required Field',
//     },
//   });

const router = useRouter();
const route = useRoute();

const store = useInventoriesStore();
const storeEmployee = useEmployeesStore();
const inventoryTypeStore = useInventoryTypeStore();
const brandStore = useBrandStore();
const unitStore = useUnitStore();
const supplierStore = useSupplierStore();

const {
    inventoryTypesAll
} = storeToRefs(inventoryTypeStore);

const {
    listOfAllBrands
} = storeToRefs(brandStore);

const {
    listOfAllUnits
} = storeToRefs(unitStore);

const {
    listOfAllSuppliers
} = storeToRefs(supplierStore);

const {
    listOfAllEmployees
} = storeToRefs(storeEmployee);

const { t } = useI18n();

const warehouseList = ref([
    {
        value: 1,
        title: t('office'),
    },
    {
        value: 2,
        title: t('entertainment'),
    },
])

const { errors, handleSubmit, defineField, resetForm, setErrors, setValues } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(),
        brand_id: yup.string().required(t('brandRequired')),
        unit_id: yup.string().required(t('unitRequired')),
        item_type: yup.string().required(t('itemTypeRequired')),
        supplier_id: yup.string().nullable(),
        warehouse_id: yup.string().required(t('warehouseRequired')),
        stock: yup.number(t('fieldMustBeNumber')).required(t('stockRequired')),
        description: yup.string().nullable(),
        item_locations: yup.array().of(
            yup.object().shape({
                location: yup.number(t('fieldMustBeNumber'))
                    .transform((currentValue) => currentValue == "" ? undefined : currentValue)
                    .required(t('locationRequired'))
                    .typeError(t('fieldMustBeNumber')),
                user_id: yup.string().when('location', {
                    is: 1,
                    then: function () {
                        return yup.string().required(t('userRequired'))
                    },
                    otherwise: function () {
                        return yup.string().nullable()
                    }
                }),
                purchase_price: yup.string().required(t('purchasePriceRequired')),
                year_of_purchase: yup.string().nullable(),
                warranty: yup.string().nullable(),
                is_on_edit: yup.string().nullable(),
            })
        )
    }),
})

const validateData = handleSubmit(async values => {

    if ((detailData.value) && (detailData.value.data.data.images.length)) {
        // get current files if exits
        var currentImages = [];
        for (let a = 0; a < detailData.value.data.data.images.length; a++) {
            if (document.getElementById('preview-image-key-' + a)) {
                var _val = document.getElementById('preview-image-key-' + a).value;
                currentImages.push(_val);
            }
        }
    }

    var formData = new FormData();

    if (pond.value) {
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            formData.append('images[]', pond.value.getFiles()[a].file);
        }
    }

    for (let b = 0; b < values.item_locations.length; b++) {
        formData.append(`item_locations[${b}][location]`, values.item_locations[b].location);
        formData.append(`item_locations[${b}][user_id]`, values.item_locations[b].user_id);
        formData.append(`item_locations[${b}][id]`, values.item_locations[b].id);
        formData.append(`item_locations[${b}][purchase_price]`, values.item_locations[b].purchase_price);
        formData.append(`item_locations[${b}][warranty]`, values.item_locations[b].warranty);
        formData.append(`item_locations[${b}][year_of_purchase]`, values.item_locations[b].year_of_purchase);
    }

    formData.append('name', values.name);
    formData.append('brand_id', values.brand_id);
    formData.append('item_type', values.item_type);
    formData.append('purchase_price', values.purchase_price == undefined ? '' : values.purchase_price);
    formData.append('stock', values.stock);
    formData.append('supplier_id', values.supplier_id == undefined ? '' : values.supplier_id);
    formData.append('warehouse_id', values.warehouse_id == undefined ? '' : values.warehouse_id);
    formData.append('unit_id', values.unit_id);
    formData.append('description', description_quill.value.getHTML());
    formData.append('warranty', values.warranty == undefined ? '' : values.warranty);
    formData.append('year_of_purchase', values.year_of_purchase == undefined ? '' : values.year_of_purchase);

    var storeData;
    isLoading.value = true;
    if (detailData.value) {
        formData.append('_method', "PUT");
        formData.append('current_images', currentImages);
        if (deletedItemStock.value.length) {
            for (let c = 0; c < deletedItemStock.value.length; c++) {
                formData.append(`deleted_item_stock[${c}][id]`, deletedItemStock.value[c].id)
            }
        }

        if (deletedimages.value.length) {
            for (let d = 0; d < deletedimages.value.length; d++) {
                formData.append(`deleted_images[${d}][id]`, deletedimages.value[d].id)
            }
        }

        storeData = await store.storeData(formData, detailData.value.data.data.uid);
    } else {
        storeData = await store.storeData(formData);
    }
    isLoading.value = false;

    useError(storeData, setErrors);

    if (storeData.status < 300) {
        resetForm();

        setTimeout(() => {
            router.push({path: '/admin/inventories/list'});
        }, 1000);
    }
});

const [name] = defineField('name');
const [brand_id] = defineField('brand_id');
const [unit_id] = defineField('unit_id');
const [item_type] = defineField('item_type');
const [supplier_id] = defineField('supplier_id');
const [warehouse_id] = defineField('warehouse_id');
const [stock] = defineField('stock');
const [year_of_purchase] = defineField('year_of_purchase');
const [warranty] = defineField('warranty');
const [description] = defineField('description');
const [purchase_price] = defineField('purchase_price');
const nameMirror = ref('');
const { remove, push, fields, replace } = useFieldArray('item_locations');

const isShowDatePicker = ref(false);

const isLoading = ref(false);
const loadingPrepare = ref(false)
const formTab = ref('general');
const myFiles = ref([]);
const openPanel = ref([0]);
const previewImage = ref([]);
const deletedItemStock = ref([]);
const deletedimages = ref([]);
const pond = ref(null);
const description_quill = ref(null);
const detailData = ref(null);
const latestBreadcrumb = ref(t('createInventory'));
const itemLocations = ref([
    {
        value: 1,
        title: t('onUser'),
    },
    {
        value: 2,
        title: t('onWarehouse'),
    },
    {
        value: 3,
        title: t('outgoing'),
    },
]);
const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('inventories'),
        disabled: false,
        href: '/admin/inventories/list',
    },
    {
        title: t('createInventory'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

async function prepareData() {
    loadingPrepare.value = true
    await Promise.all([
        initSelectBrand(),
        initSelectType(),
        initSelectUnit(),
        initSelectSupplier(),
        initEmployees(),
        getDetail()
    ])
    loadingPrepare.value = false
}

onMounted(async () => {
    prepareData()

    if (route.params.uid) {
        // update breadcrumb
        breadcrumbs.value[2].title = t('editInventory');
    } else {
        push({location: '', user: '', id: '', purchase_price: '', warranty: '', year_of_purchase: '', is_on_edit: ''})
        stock.value = fields.value.length
    }
});

watch(name, (values) => {
    nameMirror.value = values;
})

async function initEmployees() {
    await storeEmployee.getAll();
}

function removeBoxStock(index) {
    // set deleted item
    for (let a = 0; a < fields.value.length; a++) {
        if (fields.value[a].key == index) {
            if (fields.value[a].value.id) {
                deletedItemStock.value.push({id: fields.value[a].value.id})
            }
        }
    }

    document.getElementById('box-item-stock-' + index).remove()
    remove(index)

    stock.value = fields.value.length
}

function addMoreStock() {
    push({location: '', user_id: '', id: '', purchase_price: '', warranty: '', year_of_purchase: '', is_on_edit: ''})

    stock.value = fields.value.length
}

function deletePreviewImage(index, imageId) {
    deletedimages.value.push({id: imageId});
    document.getElementById('preview-image-' + index).remove();
}

async function getDetail() {
    if (route.params.uid) {
        detailData.value = await store.detailData({
            uid: route.params.uid
        });
        if (detailData.value.status < 300) {
            name.value = detailData.value.data.data.name;
            item_type.value = detailData.value.data.data.item_type.uid;
            unit_id.value = detailData.value.data.data.unit.uid;
            brand_id.value = detailData.value.data.data.brand.uid;
            supplier_id.value = detailData.value.data.data.supplier.uid
            warehouse_id.value = detailData.value.data.data.warehouse_id
            stock.value = detailData.value.data.data.stock
            year_of_purchase.value = detailData.value.data.data.year_of_purchase
            warranty.value = detailData.value.data.data.warranty
            purchase_price.value = detailData.value.data.data.price_raw
            setTimeout(() => {
                if (description_quill.value) {
                    description_quill.value.setHTML(detailData.value.data.data.description)
                }
            }, 500);

            // handle image
            if (detailData.value.data.data.images.length) {
                previewImage.value = detailData.value.data.data.images
            }

            // update stock to show all items
            var items = [];
            for (let a = 0; a < detailData.value.data.data.stock; a++) {
                items.push(
                    {
                        location: detailData.value.data.data.items[a].current_location,
                        user_id: detailData.value.data.data.items[a].user_id ? detailData.value.data.data.items[a].user_id.toString() : '',
                        id: detailData.value.data.data.items[a].id,
                        purchase_price: detailData.value.data.data.items[a].purchase_price,
                        warranty: detailData.value.data.data.items[a].warranty,
                        year_of_purchase: detailData.value.data.data.items[a].year_of_purchase,
                        is_on_edit: detailData.value.data.data.deleteable ? '1' : ''
                    }
                );
            }

            replace(items)
        }
    }
}

function updateStock() {
    var values = [];
    for (let a = 0; a < stock.value; a++) {
        values.push({location: '', user_id: ''});
    }

    setValues({
        item_locations: values
    })
}

function updateDescription() {
    if (description_quill.value.getText().length > 1) {
        description.value = description_quill.value.getHTML();
    } else {
        description.value = null;
    }

}

function updatePriceValue() {
    purchase_price.value = new Intl.NumberFormat().format(purchase_price.value);
}

function showDatePicker() {
    isShowDatePicker.value = true;
}

function initSelectSupplier() {
    supplierStore.getAllSuppliers();
}

function initSelectBrand() {
    brandStore.getAllBrands();
}

function initSelectUnit() {
    unitStore.getAllUnits();
}

function initSelectType() {
    inventoryTypeStore.getAllInventoryTypes();
}

function handleFilePondInit() {
    // example of instance method call on pond reference
    pond.value;
}
</script>

<style scoped lang="scss">
.box-preview-image {
    border-radius: 4px;
    background-color: #f4f4f4;
    padding: 4px;
    width: 80px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-close {
        top: -10px;
        right: -10px;
        cursor: pointer;
    }
}

.box-item-stock {
    background-color: #f4f4f4;
    padding: 14px;
    border-radius: 4px;
}

.box-item-stock-remove {
    position: absolute;
    top: -5px;
    right: -10px;
    cursor: pointer;
}
</style>

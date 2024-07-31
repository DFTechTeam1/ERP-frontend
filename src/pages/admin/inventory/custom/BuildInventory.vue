<template>
    <div>
        <breadcrumb-data
            :title="$t('buildCustomInventory')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ $t('createNewItem') }}</v-card-title>
            </v-card-item>
            <v-card-text>
                <v-form @submit="validateData">
                    <v-row>
                        <v-col
                            cols="12"
                            md="6">
                            <field-input
                                :label="t('name')"
                                density="compact"
                                class="mb-2"
                                v-model="name"
                                :error-message="errors.name"></field-input>
    
                            <field-input
                                :label="t('type')"
                                input-type="select"
                                :select-options="typeList"
                                density="compact"
                                v-model="type"
                                :error-message="errors.type"></field-input>

                            <field-input
                                :label="t('setAsDefaultRequestItem')"
                                input-type="switch"
                                v-model="default_request_item"
                                :error-message="errors.default_request_item"></field-input>
                        </v-col>
                    </v-row>
                    <v-row class="mb-5">
                        <v-col
                            cols="12"
                            md="5"
                            class="pb-0">
                            <template v-if="loadingPrepare">
                                <v-skeleton-loader
                                    type="list-item-three-line"></v-skeleton-loader>
                            </template>
                            <template v-else>
                                <v-label>{{ $t('inventoryList') }}</v-label>
                                <div class="invalid-feedback mt-0" v-if="!listOfTargetInventories.length">{{ $t('inventoryRequired') }}</div>
    
                                <div class="box-item">
                                    <input type="text" class="custom-input-field mb-5 mt-3" :placeholder="t('searchItem')" v-model="search">
    
                                    <v-list class="pb-0 available-item">
                                        <v-list-item 
                                            v-for="(list, x) in listOfAvailableInventories"
                                            :key="x"
                                            class="border rounded-lg pointer mb-2" 
                                            @click.prevent="chooseInventory(list, 'available')"
                                            :class="{
                                                'bg-grey-lighten-2': list.active
                                            }">
                                            <p>{{ list.name }}</p>
                                            <v-chip density="compact" color="green">
                                                {{ list.stock }} Item
                                            </v-chip>
                                        </v-list-item>
                                    </v-list>
                                </div>
                            </template>
                        </v-col>
                        <v-col
                            class="align-self-center pb-0"
                            cols="12"
                            md="1">
                            <div class="d-flex align-center justify-center pointer">
                                <v-btn
                                    variant="flat"
                                    @click.prevent="moveItem">
                                    <v-icon
                                        :icon="mdiArrowTopRightBottomLeft"
                                        size="20"></v-icon>
    
                                    <v-tooltip
                                        activator="parent">
                                        Move
                                    </v-tooltip>
                                </v-btn>
                            </div>
                        </v-col>
    
                        <v-col
                            cols="12"
                            md="5"
                            class="pb-0">
                            <template v-if="loadingPrepare">
                                <v-skeleton-loader
                                    type="list-item-three-line"></v-skeleton-loader>
                            </template>
                            <template v-else>
                                <div class="empty-target mt-10" v-if="!listOfTargetInventories.length">
                                    There is no item
                                </div>
                                <div v-else class="mt-10">
                                    <v-label></v-label>
                                    <v-list class="pb-0">
                                        <v-list-item 
                                            v-for="(listTarget, y) in listOfTargetInventories"
                                            :key="y"
                                            class="border rounded-lg pointer mb-2" 
                                            @click.prevent="chooseInventory(listTarget, 'target')"
                                            :class="{
                                                'bg-grey-lighten-2': listTarget.active
                                            }">
                                            <p>{{ listTarget.name }}</p>
                                            <v-chip density="compact" color="green">
                                                {{ listTarget.stock }} Item
                                            </v-chip>
                                        </v-list-item>
                                    </v-list>
                                </div>
                            </template>
                        </v-col>

                    </v-row>
    
                    <v-row class="mt-10 pt-5">
                        <v-col
                            cols="12"
                            md="6">
                            <v-btn flat color="primary"
                            :disabled="loading"
                            type="submit">
                                <template v-if="loading">{{ $t('processing') }}</template>
                                <template v-else>{{ $t('submit') }}</template>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<style lang="scss" scoped>
.box-item {
    max-height: 300px;
    height: 100%;
    padding-bottom: 20px;
    position: relative;
    
    .available-item {
        height: 100%;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #e6e6e6;
            border-radius: 8px;
        }
    }

}

.list-group {
    .inventory-list {
        border: 1px solid #f4f4f4;
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 8px;
        cursor: grab;

        .title {
            font-weight: 400;
            color: #000;
            font-size: 16px;
        }
    }
}

.empty-target {
    border: 1px dashed #e6e6e6;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomInventoriesStore } from "@/stores/customInventories";
import { mdiArrowTopRightBottomLeft } from "@mdi/js";
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useRoute, useRouter } from 'vue-router';
import { useError } from '@/compose/handleError';

const store = useCustomInventoriesStore()

const router = useRouter()

const route = useRoute()

const { listOfAvailableInventories, listOfTargetInventories } = storeToRefs(store)

const { t } = useI18n()

const search = ref(null)

const loading = ref(false)

const loadingPrepare = ref(false)

const typeList = ref([
    {
        value: 'pcrakitan',
        title: 'PC Rakitan',
    },
    {
        value: 'itemvj',
        title: 'Item VJ',
    },
])

const { defineField, errors, handleSubmit, setErrors, setFieldValue } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        type: yup.string().required(t('typeRequired')),
        default_request_item: yup.string().nullable(),
    }),
})

const [name] = defineField('name')
const [type] = defineField('type')
const [default_request_item] = defineField('default_request_item')

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('customInventories'),
        disabled: false,
        href: '/admin/inventories/custom',
    },
    {
        title: t('buildCustomInventory'),
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
])

function chooseInventory(inventory, type) {
    store.chooseInventory(inventory, type)   
}

function moveItem() {
    store.moveItem()
}

const validateData = handleSubmit(async (values) => {
    if (listOfTargetInventories.value.length) {
        values.inventories = listOfTargetInventories.value

        if (!values.default_request_item) {
            values.default_request_item = 0
        }

        loading.value = true
        const resp = await store.storeInventory(values, route.params.uid || 0)
        loading.value = false

        useError(resp, setErrors);

        if (resp.status < 300) {
            router.push({path: '/admin/inventories/custom'})
        }
    }
})

async function getItem(search = null) {
    var params = {
        search: ''
    }

    if (search) {
        params.search = search
    }

    await store.getInventories(params)
}

async function editItem() {
    const resp = await store.showDetailCustomInventory(route.params.uid)

    if (resp.status < 300) {
        setFieldValue('name', resp.data.data.name)
        setFieldValue('type', resp.data.data.type)
        setFieldValue('default_request_item', resp.data.data.default_request_item ? 1 : 0)
    }
}

async function prepareData() {
    loadingPrepare.value = true
    if (route.params.uid) {
        await Promise.all([
            getItem(),
            editItem(),
        ])
    } else {
        await Promise.all([
            getItem(),
        ])
    }
    loadingPrepare.value = false
}

onMounted(() => {
    prepareData()

    store.clearState()
})

watch(search, (values) => {
    getItem(values)
})
</script>
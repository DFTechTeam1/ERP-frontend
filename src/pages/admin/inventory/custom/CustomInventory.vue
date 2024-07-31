<template>
    <div>
        <breadcrumb-data
            :title="$t('inventories')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <div class="item-wrapper">
            <!-- header -->
            <div class="custom-header d-flex align-center justify-space-between">
                <p class="header-title">
                    All Item
                </p>

                <div class="header-action">
                    <v-btn
                        variant="flat"
                        color="primary"
                        @click.prevent="buildForm">
                        Build Inventory
                    </v-btn>
                </div>
            </div>
            <!-- end header -->

            <!-- summary -->
            <div class="summary mb-5">
                <v-chip density="compact" color="primary" variant="flat" border="border" class="pointer">
                    100 Total Custom Inventory
                </v-chip>
                <v-chip density="compact" color="success" variant="flat" border="border" class="pointer ms-3">
                    3 is On Warehouse
                </v-chip>
                <v-chip density="compact" color="red" variant="flat" border="border" class="pointer ms-3">
                    3 is On Project
                </v-chip>
                <v-chip density="compact" color="warning" variant="flat" border="border" class="pointer ms-3">
                    1 is Waiting to Check
                </v-chip>
            </div>

            <div class="item-list">
                <template v-if="loading">
                    <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
                </template>
                <template v-else>
                    <template v-if="listOfInventories.length">
                        <v-list lines="two" class="list-data" v-for="(item, x) in listOfInventories" :key="x">
                            <v-list-item class="item-inner">
        
                                <template v-slot:prepend>
                                    <v-img
                                        width="130"
                                        height="auto"
                                        src="/noimage.png"></v-img>
                                </template>
                                
                                <template v-slot:title>
                                    <div class="inventory-info">
                                        <p class="inventory-subid">
                                            {{ item.build_series }}
                                        </p>
                                        <p class="inventory-item d-flex align-center ga-4">
                                            {{ item.name }}
    
                                            <v-chip v-if="item.default_request_item" color="success">
                                                {{ $t('defaultRequestItem') }}
                                            </v-chip>
                                        </p>
                                    </div>
        
                                    <p class="update">
                                        Updated: <span class="time">
                                        {{ item.updated }}
                                        </span>
                                    </p>
                                </template>
        
                                <template v-slot:subtitle>
                                    <div class="subtitle">
                                        <p class="unit">
                                            {{ item.total_items }} items
                                        </p>
        
                                        <v-divider vertical class="ms-3 me-3" thickness="3" color="red" length="15"></v-divider>
                                        
                                        <p class="price">IDR {{ item.total_price }}</p>
        
                                        <v-divider vertical class="ms-3 me-3" thickness="3" color="red" length="15"></v-divider>
        
                                        <v-chip density="compact"
                                            color="red">
                                            {{ item.location }}
                                        </v-chip>
                                    </div>
                                </template>
        
                                <template v-slot:append>
                                    <div class="action d-flex align-center justify-space-between mt-1">
        
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-icon
                                                    v-bind="props"
                                                    :icon="mdiDotsVertical"
                                                    size="20"></v-icon>
                                            </template>
                                            <v-list>
                                                <v-list-item style="font-size: 12px;" class="list-action-item">
                                                    <div class="d-flex align-center ga-4 pointer">
                                                        <v-icon
                                                            :icon="mdiHistory"
                                                            size="20"></v-icon>
            
                                                        <p>History</p>
                                                    </div>
                                                </v-list-item>
                                                <v-list-item style="font-size: 12px;" class="list-action-item"
                                                    @click.prevent="editInventory(item.uid)">
                                                    <div class="d-flex align-center ga-4 pointer">
                                                        <v-icon
                                                            :icon="mdiPencilOutline"
                                                            size="20"></v-icon>
            
                                                        <p>Edit</p>
                                                    </div>
                                                </v-list-item>
                                                <v-list-item style="font-size: 12px;" class="list-action-item">
                                                    <div class="d-flex align-center ga-4 pointer">
                                                        <v-icon
                                                            :icon="mdiTrashCanOutline"
                                                            size="20"></v-icon>
            
                                                        <p>Delete</p>
                                                    </div>
                                                </v-list-item>
                                                <v-list-item style="font-size: 12px;" class="list-action-item">
                                                    <div class="d-flex align-center ga-4 pointer">
                                                        <v-icon
                                                            :icon="mdiFileExportOutline"
                                                            size="20"></v-icon>
            
                                                        <p>Export</p>
                                                    </div>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </div>
                                </template>
        
                            </v-list-item>
                        </v-list>
                    </template>

                    <template v-else>
                        <v-card flat>
                            <v-card-text class="text-center">
                                <h4>{{ t('emptyCustomItem') }}</h4>
                            </v-card-text>
                        </v-card>
                    </template>
                </template>
            </div>

            <div class="pagination-wrapper" v-if="listOfInventories.length > 10">
                <v-pagination
                    v-model="page"
                    :length="totalOfPagination"
                    :total-visible="5"
                    ></v-pagination>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.custom-header {
    margin-bottom: 20px;
    padding-left: 10px;

    .header-title {
        font-size: 24px;
        color: #323232;
    }
}

.item-inner {
    .v-list-item__append {
        align-self: baseline !important;
    }

    .v-list-item__content {
        align-self: baseline !important;
    }

    .v-list-item-title {
        display: flex;
        justify-content: space-between;

        .update {
            padding-right: 150px;
            padding-top: 5px;
        }
    }

}
</style>

<style lang="scss" scoped>
.list-action-item {
    min-height: 25px !important;
}

.list-action-item:hover {
    background-color: #f4f4f4;
}

.list-data {
    padding-top: 0;
    padding-bottom: 0;
}
.item-inner:hover,
.list-data:hover {
    box-shadow: 0px 10px 12px -3px rgba(0,0,0,0.1);
}
.list-data {
    margin-bottom: 10px;
    border-radius: 8px !important;
    transition: all .5s;
}
.item-inner {
    border-radius: 8px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    cursor: pointer;

    .action {
        .update {
            font-size: 14px;

            .time {
                font-weight: bolder;
            }
        }
    }

    .subtitle {
        margin-left: 10px;
        margin-top: 4px;
        display: flex;
        align-items: center;
        gap: 5px;

        .unit {
            font-weight: bolder;
            color: #000;
            font-size: 12px;
        }

        .price {
            font-weight: bold;
        }
    }

    .inventory-info {
        margin-left: 10px;

        .inventory-subid {
            font-size: 12px;
            margin-bottom: 3px;
            color: darkgrey;
            font-weight: bolder;
        }
    
        .inventory-item {
            font-weight: bold;
            font-size: 18px;
        }
    }

}
</style>

<script setup>
import { useCustomInventoriesStore } from '@/stores/customInventories';
import { mdiDotsVertical, mdiFileExportOutline, mdiHistory, mdiPencilOutline, mdiTrashCanOutline } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';

const { t } = useI18n()

const router = useRouter()

const store = useCustomInventoriesStore()

const { listOfInventories, totalOfPagination } = storeToRefs(store)

const page = ref(1)

const loading = ref(false)

const breadcrumbs = ref([
    {
        title: 'Inventory',
        disabled: true,
        href: 'breadcrumbs_inventory',
    },
    {
        title: t('customInventories'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
])

function buildForm() {
    router.push({
        path: '/admin/inventories/custom/create'
    })
}

async function getList() {
    loading.value = true
    await store.getList()
    loading.value = false
}

function editInventory(uid) {
    router.push({path: `/admin/inventories/custom/edit/${uid}`})
}

onMounted(() => {
    getList()
})
</script>
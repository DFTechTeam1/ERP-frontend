<template>
    <div>
        <breadcrumb-data
            :title="$t('inventories')"
            :breadcrumbs="breadcrumbs"></breadcrumb-data>

        <v-card>
            <v-card-item>
                <v-card-title>{{ $t('detailInventory') }}</v-card-title>
            </v-card-item>
            <v-divider></v-divider>
            <v-card-text>
                <template v-if="!detailData">
                    <v-skeleton-loader
                        max-width="100%"
                        class="mx-auto border"
                        type="card-avatar, actions"
                        ></v-skeleton-loader>
                </template>
                <template v-else>
                    <inventory-view 
                        :detail-data="detailData"/>
                </template>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useInventoriesStore } from '@/stores/inventories';
import InventoryView from './InventoryView.vue';

const store = useInventoriesStore();

const route = useRoute();

const { t } = useI18n();

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
        title: t('detailInventory'),
        disabled: true,
        href: 'breadcrumbs_link_1',
    },
]);

const detailData = ref(null);

onMounted(() => {
    getDetail(route.params.uid)
})

async function getDetail(uid) {
    var detail = await store.detailData({uid: uid});
    detailData.value = detail.data.data;

    console.log('detail', detailData.value);
}
</script>
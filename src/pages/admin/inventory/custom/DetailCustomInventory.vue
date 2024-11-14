<script setup>
import {ref, onMounted} from "vue";
import { useI18n } from "vue-i18n";
import {useCustomInventoriesStore} from "@/stores/customInventories";
import {useRoute} from "vue-router";
import MasterCard from "@/components/MasterCard.vue";

const { t } = useI18n();

const store = useCustomInventoriesStore();

const route = useRoute();

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
    title: t('detailItem'),
    disabled: true,
    href: '',
  },
])

const loading = ref(false);

const detailData = ref(null);

async function getDetailData() {
  loading.value = true;
  const resp = await store.showDetailCustomInventory(route.params.uid);
  loading.value = false;

  if (resp.status < 300) {
    detailData.value = resp.data.data;
  }

  console.log('detail', detailData.value);
}

onMounted(() => {
  getDetailData();
})
</script>

<template>
  <div>
    <breadcrumb-data
      :title="$t('inventories')"
      :breadcrumbs="breadcrumbs"></breadcrumb-data>

    <master-card>
      <v-card-item>
        <v-card-title>
          {{ $t('detail') }}
        </v-card-title>
      </v-card-item>

      <v-card-text>
        <template v-if="loading">
          <v-skeleton-loader
            type="list-item-three-line"></v-skeleton-loader>
        </template>
        <template v-else>
          <v-row>
            <v-col
              cols="12"
              md="4">
              <v-list>
                <v-list-item>
                  <template v-slot:title>
                    <p class="fw-bold">{{ $t('name') }}:</p>
                  </template>

                  <template v-slot:append>
                    <p>{{ detailData ? detailData.name : '' }}</p>
                  </template>
                </v-list-item>
                <v-list-item>
                  <template v-slot:title>
                    <p class="fw-bold">{{ $t('totalItem') }}:</p>
                  </template>

                  <template v-slot:append>
                    <p>{{ detailData ? detailData.items.length : 0 }} {{ $t('item') }}</p>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:title>
                    <p class="fw-bold">{{ $t('detailItem') }}:</p>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <div class="detail-item d-flex align-center ga-4" v-if="detailData">
            <div class="detail-box text-center"
              v-for="(item, x) in detailData.items"
              :key="x">
              <v-img
                :src="item.inventory.display_image"
                width="200"
                height="150"></v-img>
              <p class="text-center fw-bold">{{ item.inventory.name }}</p>
            </div>
          </div>
        </template>
      </v-card-text>
    </master-card>
  </div>
</template>

<template>
    <v-dialog
        v-model="showModal"
        max-width="500"
        persistent>
        <v-card>
            <v-card-title>
                <div class="d-flex align-center justify-space-between">
                    <span>{{ $t('filterInventory') }}</span>
                    <v-icon
                        :icon="mdiClose"
                        @click.prevent="$emit('close-detail-item')"
                        class="cursor-pointer"></v-icon>
                </div>
            </v-card-title>
            <v-card-text>
                <v-skeleton-loader
                    v-if="!items.length"
                    type="list-item-avatar-three-line"></v-skeleton-loader>
                <div class="item-wrapper" v-if="items.length">
                    <div 
                        class="item-list"
                        v-for="(item, x) in items"
                        :key="x">
                        <div class="image">
                            <v-img
                                :src="item.qrcode"
                                :width="80"
                                height="auto"></v-img>
                        </div>
    
                        <div class="info">
                            <p class="title">{{ item.inventory_code }}</p>
                            <p class="subtitle">
                                {{ $t('location') }} : <span>{{ item.location }} {{ item.user ? ' (' + item.user + ')' : '' }}</span>
                            </p>
                            <p class="subtitle">
                                {{ $t('status') }} : <span>
                                    <v-chip
                                        color="primary"
                                        density="compact">
                                        {{ item.status_text }}
                                    </v-chip>
                                </span>
                            </p>
                            <p class="subtitle">
                                {{ $t('condition') }} : <span>-</span>
                            </p>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.item-wrapper {
    padding: 8px 14px;

    .item-list {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid rgba(0,0,0,.2);
    }

    .info {
        .title {
            font-size: 18px;
            font-weight: bold;
        }

        .subtitle {
            line-height: 1.5;
        }
    }
}
</style>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue';
import { useInventoriesStore } from '@/stores/inventories';

const store = useInventoriesStore();

const showModal = ref(false);

const items = ref([]);

defineEmits(['close-detail-item']);

const props = defineProps({
    isShowModal: {
        type: Boolean,
        default: false,
    },
    parentUid: {
        default: null,
    },
})

watch(props, (values) => {
    if (values) {
        showModal.value = values.isShowModal;
    }

    if (values.parentUid) {
        // get detail
        getItemList();
    }
})

async function getItemList() {
    items.value = await store.getListItem({uid: props.parentUid});
}
</script>
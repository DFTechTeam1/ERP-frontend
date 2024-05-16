<template>
    <div>
        <div class="item-wrapper">
            <div 
                class="item-list"
                v-for="(item, x) in props.info.items"
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
    </div>
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
const props = defineProps({
    info: {
        type: Object,
        required: true,
    },
})
</script>
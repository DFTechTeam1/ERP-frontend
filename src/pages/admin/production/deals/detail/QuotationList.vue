<script setup>
import { formatPrice } from '@/compose/formatPrice';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const props = defineProps({
    project: Object
});

defineEmits(['click-event']);
</script>

<template>
    <div class="quotation-item pointer"
        :class="{
            'is-final': project.is_final,
            'is-mobile': mobile
        }"
        @click.prevent="$emit('click-event', project.id)">
        <div class="main-info">
            <div class="d-flex items-center" style="gap: 14px;">
                <p class="number">{{ project.quotation_number }}</p>

                <v-chip color="success" density="compact" v-if="project.is_final">Final</v-chip>
            </div>

            <p class="name">{{ project.name }} ({{ project.venue }})</p>
        </div>
        <div class="main-action">
            <div class="action-wrapper">
                <p class="price"
                    :class="{
                        'mt-1': mobile
                    }">{{ formatPrice(project.price) }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.is-final {
    box-shadow: 0px 0px 5px 0 #43A047 !important;
}

.quotation-item.is-mobile {
    display: block !important;
}

.quotation-item {
    padding: 10px 20px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 0px 8px 0 #e6e6e6;
    margin-bottom: 26px;
    transition: all .5s;
    border-radius: 8px;

    &:hover {
        transform: scale(1.05);
    }

    .main-info {

        .number {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 12px;
        }

        .name {
            font-size: 13px;
            font-weight: normal;
        }
    }

    .main-action {
        .action-wrapper {
            display: flex;
            align-items: center;
            gap: 26px;

            .price {
                color: #43A047;
                font-size: 16px;
                margin: 0;
            }
        }
    }
}
</style>
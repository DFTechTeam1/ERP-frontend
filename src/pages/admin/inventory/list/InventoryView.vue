<template>
    <div>
        <div class="header mt-5">
            <div class="header-image">
                <v-img
                    :src="props.detailData.display_image"
                    :width="150"
                    height="auto"
                    rounded></v-img>
            </div>
            <div class="header-information">
                <p class="title">{{ props.detailData.name }}</p>
                <v-chip
                    color="success"
                    class="mt-2"
                    density="compact">
                    {{ props.detailData.items.length }} {{ props.detailData.unit.name }}
                </v-chip>
                <v-chip
                    color="primary"
                    class="mt-2 ms-2"
                    density="compact">
                    {{ props.detailData.brand.name }}
                </v-chip>
            </div>
        </div>  

        <div class="body">
            <v-tabs 
                v-model="tab">
                <v-tab :value="1">{{ $t('generalInformation') }}</v-tab>
                <v-tab :value="2">{{ $t('images') }}</v-tab>
                <v-tab :value="3">{{ $t('items') }}</v-tab>
            </v-tabs>
            <v-window
                v-model="tab">
                <v-window-item
                    :value="1"
                    class="mt-3">
                    <general-information :info="props.detailData"/>
                </v-window-item>
                <v-window-item
                    :value="2"
                    class="mt-3">
                    <image-view :info="props.detailData"/>
                </v-window-item>
                <v-window-item
                    :value="3"
                    class="mt-3">
                    <items-view :info="props.detailData"/>
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<style scoped lang="scss">
.header {
    display: flex;
    gap: 10px;

    .header-information {
        .title {
            font-size: 22px;
            font-weight: bold;
        }
    }
}
</style>

<script setup>
import { ref } from 'vue';
import GeneralInformation from './detail/GeneralView.vue'
import ImageView from './detail/ImageView'
import ItemsView from './detail/ItemsView'

const props = defineProps({
    detailData: {
        type: Object,
        required: true,
    },
})

const tab = ref(null)
</script>
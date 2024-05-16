<template>
    <v-dialog
        v-model="show"
        max-width="800"
        persistent>
        <v-card>
            <v-skeleton-loader
                class="border"
                type="image, article"
                v-if="!props.detail"
                ></v-skeleton-loader>
            
            <template v-else>
                <v-card-item>
                    <v-card-title class="d-flex align-center justify-space-between">
                        <p style="font-weight: bolder;">{{ props.detail.name }}</p>

                        <v-icon
                            :icon="mdiClose"
                            class="pointer"
                            @click.prevent="$emit('close-desc')"
                            size="20"></v-icon>
                    </v-card-title>
                </v-card-item>

                <v-card-text>
                    <div class="image">
                        <v-img
                            :src="props.detail.preview_img"
                            height="400"
                            width="100%"></v-img>
                    </div>

                    <div class="action d-flex align-center w-100 my-3">
                        <div class="w-50 pr-5">
                            <v-btn
                                class="w-100"
                                variant="outlined"
                                color="primary"
                                @click.prevent="downloadAddon(props.detail, 'tutorial')">
                                VIDEO DEMO
                            </v-btn>
                        </div>
                        <div class="w-50 pl-5">
                            <v-btn
                                class="w-100"
                                variant="outlined"
                                color="primary"
                                @click.prevent="downloadAddon(props.detail, 'main')">
                                DOWNLOAD
                            </v-btn>
                        </div>
                    </div>

                    <div class="description">
                        <p class="desc-title" style="font-weight: bolder; font-size: 16px; margin-bottom: 10px;">Description</p>

                        <p style="color: darkgray;" v-html="props.detail.description">
                        </p>
                    </div>
                </v-card-text>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { mdiClose } from '@mdi/js'
import { useAddonStore } from '@/stores/addon';

const store = useAddonStore();

const props = defineProps({
    detail: {
        default: null,
    },
    isShow: {
        type: Boolean,
        default: false,
    },
})

const show = ref(false)

defineEmits(['close-desc'])

watch(props, (values) => {
    if (values) {
        show.value = values.isShow
    }
})

async function downloadAddon(payload, type) {
    const res = await store.downloadData({id: payload.uid, type: type});

    if (res.status < 300) {
        window.open(res.data.data.url, '_blank');
    }
}
</script>
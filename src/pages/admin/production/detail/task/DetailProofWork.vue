<template>
    <v-dialog
        v-model="show"
        max-width="600"
        persistent>
        <v-card>
            <v-card-item>
                <div class="text-end">
                    <v-icon
                        :icon="mdiClose"
                        size="25"
                        class="pointer"
                        @click.prevent="closeModal"></v-icon>
                </div>
            </v-card-item>
            <v-card-text>
                <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(item, x) in props.detail"
                        :key="x">
                        <v-expansion-panel-title>{{ x }}</v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-label>{{ $t('nasLink') }}</v-label>
                            <br>
                            <a :href="props.detail[x][0].nas_link" target="_blank">{{ props.detail[x][0].nas_link }}</a>
                            <br><br>
                            <v-label>{{ $t('images') }}</v-label>
                            <div class="image-wrap d-flex align-center w-100 ga-4">
                                <div class="image-item"
                                    v-for="(image, i) in props.detail[x][0].images"
                                    :key="i">
                                    <v-img
                                        :src="image"></v-img>
                                </div>
                            </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style lang="scss" scoped>
.image-wrap {
    .image-item {
        margin-top: 10px;
        width: 150px;
        height: 150px;
        cursor: pointer;

        img {
            cursor: pointer;
        }
    }
}
</style>

<script setup>
import { mdiClose } from '@mdi/js';
import { ref, watch } from 'vue'

const show = ref(false)

const emit = defineEmits(['close-event'])

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    detail: {
        default: null,
    },
})

watch(props, (values) => {
    console.log('values', values);
    if (values) {
        show.value = values.isShow
    }
})

function closeModal() {
    emit('close-event')
}
</script>
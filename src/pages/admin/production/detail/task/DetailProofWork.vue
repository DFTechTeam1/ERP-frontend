<template>
    <v-dialog
        v-model="show"
        max-width="600">
        <v-card flat>
            <v-card-text>
                <v-label>{{ $t('nasLink') }}</v-label>
                <br>
                <a href="https://google.com" target="_blank">https://google.com</a>
                <br><br>
                <v-label>{{ $t('images') }}</v-label>
                <div class="image-wrap d-flex align-center w-100 ga-4">
                    <div class="image-item">
                        <v-img
                            src="/bgaddons.jpg"></v-img>
                    </div>
                    <div class="image-item">
                        <v-img
                            src="/bgaddons.jpg"></v-img>
                    </div>
                </div>
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
import { ref, watch } from 'vue'

const show = ref(false)

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
    if (values) {
        show.value = values.isShow
    }
})
</script>
<template>
    <div class="d-flex align-center">
        <template
            v-for="(image, x) in props.info.images"
            :key="x">
            <v-img
                :src="image.image"
                :width="100"
                height="auto"></v-img>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    info: {
        type: Object,
        required: true,
    },
})
</script>
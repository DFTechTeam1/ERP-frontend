<template>
    <div>
        <v-btn
            variant="flat"
            color="primary"
            :class="props.customClass"
            :style="props.customStyle"
            :disabled="props.isLoading"
            type="submit">
            <template v-if="props.isLoading">{{ $t('processing') }}</template>
            <template v-else>{{ $t('save') }}</template>
        </v-btn>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: 'Save',
    },
    fullWidth: {
        type: Boolean,
        default: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    customClass: {
        type: String,
        default: 'w-100'
    },
    customStyle: Object
})
</script>
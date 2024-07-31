<template>
    <div>
        <p style="font-size: 13px; margin-bottom: 5px;">{{ $t('dueDate') }}</p>
        <div 
            style="font-size: 13px; padding: 4px 12px; background-color: #f4f4f4;" 
            class="pointer">
            {{ props.startDateText }} - {{ props.endDateText }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    startDate: {
        type: String,
    },
    startDateText: {
        type: String,
    },
    endDate: {
        type: String,
    },
    endDateText: {
        type: String,
    }
});
</script>
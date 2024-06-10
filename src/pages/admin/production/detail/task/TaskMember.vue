<template>
    <div class="member" v-if="members.length">
        <p v-if="props.withTitle" style="font-size: 13px; margin-bottom: 5px;">{{ $t('members') }}</p>
        <v-avatar
            class="mr-1 pointer"
            v-for="(member, m) in props.members"
            :key="m"
            size="small"
            color="primary">
            <span>{{ member.employee.initial }}</span>
            <v-tooltip
                activator="parent"
                location="bottom">
                {{ member.employee.name }}
            </v-tooltip>
        </v-avatar>
    </div>
</template>

<script setup>
const props = defineProps({
    members: {
        type: Array,
    },
    withTitle: {
        type: Boolean,
        default: true,
    },
})
</script>
<template>
    <div class="member" v-if="members.length">
        <p style="font-size: 13px; margin-bottom: 5px;">{{ $t('members') }}</p>
        <v-avatar
            class="mr-1 pointer"
            v-for="(member, m) in props.members"
            :key="m"
            size="small"
            :color="member.color">
            <span>{{ member.initial }}</span>
            <v-tooltip
                activator="parent"
                location="bottom">
                {{ member.name }}
            </v-tooltip>
        </v-avatar>
    </div>
</template>

<script setup>
const props = defineProps({
    members: {
        type: Array,
    },
})
</script>
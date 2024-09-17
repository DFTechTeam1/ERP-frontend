<template>
    <v-empty-state
        class="under-development"
        headline="Under Development"
        title="Page is Under Development and will be launched Soon"
        >
        <template v-slot:media>
            <v-img src="/work.png"
                height="350"></v-img>
        </template>
    </v-empty-state>

</template>

<style>
.under-development {
    background-color: #fff !important;
}
</style>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function goback() {
    router.push({path: '/admin/dashboard'})
}
</script>
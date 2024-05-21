<template>
    <div>
        <template
            v-if="loading">
            <v-skeleton-loader
                width="500"
                type="image, paragraph"></v-skeleton-loader>
        </template>
        <template v-if="accountIsActive && !loading">
            <div class="text-center">
                <v-img
                    src="/activate.jpg"
                    height="400"
                    width="400"></v-img>
        
                <h3 class="text-center">{{ message }}</h3>
                <v-btn
                    class="text-center mt-5 w-75"
                    variant="flat"
                    color="primary"
                    @click.prevent="gotoLoginPage">
                    {{ $t('goToDashboard') }}
                </v-btn>
            </div>
        </template>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const store = useUserStore();

const route = useRoute();

const router = useRouter();

const accountIsActive = ref(false);

const message = ref('');

const loading = ref(false);

onMounted(() => {
    activateAccount();
})

async function activateAccount() {
    loading.value = true;
    const resp = await store.activateAccount(route.params);
    loading.value = false;
    
    if (resp.status < 300) {
        accountIsActive.value = true;

        message.value = resp.data.message;
    }
}

function gotoLoginPage() {
    router.push({path: '/auth/a/login'});
}
</script>
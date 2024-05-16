<template>
    <v-card
        rounded="10"
        class="card-light-primary mb-10">
        <div class="px-8 py-8 py-lg-0">
            <div class="d-flex justify-space-between">
                <div class="d-flex py-0 align-center">
                    <div>
                        <h3 class="text-h3 mb-2">
                            {{ props.title }}
                        </h3>
                        <v-breadcrumbs :items="props.breadcrumbs"
                            class="px-0 py-0">
                            <template v-slot:divider>
                                <v-icon :icon="mdiCircle"
                                size="5"></v-icon>
                            </template>

                            <template v-slot:item="{ item, index }">
                                <span 
                                    v-if="item.disabled"
                                    :class="index == 0 ? 'normal-opacity' : 'disabled'">{{ item.title }}</span>
                                <router-link 
                                    :to="item.href" 
                                    class="link"
                                    v-if="!item.disabled">{{ item.title }}</router-link>
                            </template>
                        </v-breadcrumbs>
                    </div>
                </div>

                <div class="d-none py-0 d-lg-block overflow-hidden">
                    <div class="mb-n16 mt-3">
                        <img src="/breadcrumb.png" alt="" style="">
                    </div>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script setup>
import { mdiCircle } from '@mdi/js';

const props = defineProps({
    title: String,
    breadcrumbs: Array,
});
</script>

<style scoped lang="scss">
.disabled {
    opacity: .5;
}
.link {
    color: #000;
}
</style>
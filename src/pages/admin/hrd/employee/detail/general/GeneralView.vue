<template>
    <div>
        <p class="detail-employee-title">
            {{ $t('personal') }}
        </p>

        <v-tabs
            class="tabs-detail-employee mt-5"
            v-model="tab"
            align-tabs="start"
            colir="primary">
            <v-tab value="basic">{{ $t('basicInfo') }}</v-tab>
            <v-tab value="family">{{ $t('family') }}</v-tab>
            <v-tab value="emergency">{{ $t('emergencyContact') }}</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="no-shadow">
            <v-tabs-window-item
                class="mt-4"
                value="basic">
                <BasicInfo></BasicInfo>
            </v-tabs-window-item>
            <v-tabs-window-item
                class="mt-4"
                value="family">
                <FamilyList />
            </v-tabs-window-item>
            <v-tabs-window-item
                class="mt-4"
                value="emergency">
                <EmergencyList />
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<style lang="scss">
.tabs-detail-employee {
    border-bottom: 1px solid #e6e6e6;
}
</style>

<script setup>
import { ref, watch } from 'vue';
import BasicInfo from './personal/basicInfo/BasicInfo.vue';
import FamilyList from './personal/family/FamilyList.vue';
import EmergencyList from './personal/emergency/EmergencyList.vue';
import { useEmployeesStore } from '@/stores/employees';
import { useRoute } from 'vue-router';

const tab = ref(null)

const familyIsRender = ref(false)

const emergencyIsRender = ref(false)

const store = useEmployeesStore()

const route = useRoute()

async function initFamily() {
    await store.initFamily(route.params.id)

    familyIsRender.value = true
}

async function initEmergency() {
    await store.initEmergency(route.params.id)

    emergencyIsRender.value = true
}

watch(tab, (values) => {
    if (values == 'family' && !familyIsRender.value) {
        initFamily()
    } else if (values == 'emergency' && !emergencyIsRender.value) {
        initEmergency()
    }
})
</script>
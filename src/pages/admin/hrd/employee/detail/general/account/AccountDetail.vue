<template>
    <div>
        <template v-if="!detailOfEmployee">
            <v-skeleton-loader type="list-item-avatar-three-line"></v-skeleton-loader>
        </template>
        <template v-else>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('email') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.user.email }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="5">
                    <p class="employee-detail-title">{{ $t('lineId') }}</p>
                </v-col>
                <v-col cols="12" md="7">
                    <p class="employee-detail-value">
                        {{ detailOfEmployee.data.data.line_id || '-' }}
                    </p>
                </v-col>
            </v-row>
        </template>
    </div>
</template>

<style scoped lang="scss">
.length-of-service {
    font-size: 12px !important;
    padding: 2px 6px;
    background: #e6e6e6;
    border-radius: 4px;
    font-weight: bold;
    margin-left: 5px;
}
</style>

<script setup>
import { useEmployeesStore } from '@/stores/employees';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue'

const store = useEmployeesStore()

const { detailOfEmployee } = storeToRefs(store)

onMounted(() => {
    console.log('detail', detailOfEmployee.value)
})
</script>
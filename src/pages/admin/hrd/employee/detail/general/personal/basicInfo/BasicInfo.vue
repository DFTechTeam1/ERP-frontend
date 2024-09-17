<template>
    <div class="basic-info-wrapper">
        <v-row style="padding-bottom: 10px;">
            <v-col cols="12" md="3">
                <p class="employee-information-title">{{ $t('personalData') }}</p>
                <p class="employee-information-sub">{{ $t('personalDataHelper') }}</p>
            </v-col>

            <v-col cols="12" md="8">
                <BasicInfoDetail v-if="!isEditingBasic"></BasicInfoDetail>
                <BasicInfoForm v-if="isEditingBasic" @close-event="closeFormBasic"></BasicInfoForm>
            </v-col>

            <v-col cols="12" md="1">
                <v-btn variant="tonal" color="primary" v-if="!isEditingBasic" @click.prevent="isEditingBasic = true">{{ $t('edit') }}</v-btn>
            </v-col>
        </v-row>
        <v-row style="border-top: 1px solid #e6e6e6; padding-top: 10px;">
            <v-col cols="12" md="3">
                <p class="employee-information-title">{{ $t('identityAddress') }}</p>
            </v-col>

            <v-col cols="12" md="8">
                <IdentityDetail v-if="!isEditIdentity" />
                <IdentityForm v-if="isEditIdentity" @close-event="isEditIdentity = false" />
            </v-col>

            <v-col cols="12" md="1">
                <v-btn variant="tonal" color="primary" v-if="!isEditIdentity" @click.prevent="isEditIdentity = true">{{ $t('edit') }}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<style lang="scss" scoped>
.basic-info-wrapper {
    padding: 0 16px;

    .basic-item {
        margin-bottom: 10px;
    }
}
</style>

<script setup>
import { ref } from 'vue';
import BasicInfoDetail from './BasicInfoDetail.vue';
import BasicInfoForm from './BasicInfoForm.vue';
import IdentityDetail from './IdentityDetail.vue';
import IdentityForm from './IdentityForm.vue';

const isEditingBasic = ref(false)

const isEditIdentity = ref(false)

function closeFormBasic() {
    isEditingBasic.value = false
}
</script>
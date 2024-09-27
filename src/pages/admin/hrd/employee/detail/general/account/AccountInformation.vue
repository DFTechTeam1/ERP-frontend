<template>
    <div>
        <p class="detail-employee-title">
            {{ $t('employment') }}
        </p>

        <v-row style="padding-bottom: 10px; margin-top: 20px;">
            <v-col cols="12" md="3">
                <p class="employee-information-title">{{ $t('accountInformation') }}</p>
                <p class="employee-information-sub">{{ $t('accountInformationHelper') }}</p>
            </v-col>

            <v-col
                cols="12"
                md="8">
                <AccountDetail v-if="!isEditingAccount" />
                <AccountForm v-if="isEditingAccount"
                    @close-event="isEditingAccount = false" />
            </v-col>

            <v-col cols="12" md="1">
                <v-btn variant="tonal" color="primary" v-if="!isEditingAccount" @click.prevent="isEditingAccount = true">{{ $t('edit') }}</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AccountDetail from './AccountDetail.vue'
import AccountForm from './AccountForm.vue'

const isEditingAccount = ref(false)
</script>
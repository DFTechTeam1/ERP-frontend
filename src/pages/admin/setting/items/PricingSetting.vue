<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputGroup from './components/forms/InputGroup.vue';

const { t } = useI18n();

const types = ref([
    {
        title: 'Percentage',
        value: 'percentage'
    },
    {
        title: 'Fixed',
        value: 'fixed'
    }
]);

const mainBallroomType = ref();
</script>

<template>
    <v-card flat border>
        <v-card-text>
            <v-form class="px-10 mt-5 position-relative">
                <input-group
                    :option-label="t('type')"
                    value-label="2,000,000"
                    :is-solo="true"
                    
                    :show-append-inner="true"
                    :show-prepend-inner="true">
                    <template v-slot:appendItem>
                        <span></span>
                    </template>
                </input-group>
                <!-- <div class="d-flex w-100 mb-5">
                    <label for="company-name" class="w-100 align-content-center">{{ $t("mainBallroomFee") }}</label>
    
                    <div class="d-flex align-center w-100">
                        <v-autocomplete
                            label="Type"
                            :is-solo="true"
                            class="custom-input"
                            v-model="mainBallroomType"
                            :style="{
                                width: '35%'
                            }"
                            :single-line="true"
                            variant="solo-filled"
                            density="compact"
                            :items="types"></v-autocomplete>

                        <v-text-field
                            label="Amount"
                            :is-solo="true"
                            :single-line="true"
                            :style="{
                                width: '65%'
                            }"
                            class="custom-input"
                            variant="solo"
                            density="compact ">
                            <template v-slot:append-inner v-if="mainBallroomType == 'percentage'">
                                <span>
                                    %
                                </span>
                            </template>
                            <template v-slot:prepend-inner v-if="mainBallroomType == 'fixed'">
                                <span>
                                    Rp
                                </span>
                            </template>
                        </v-text-field>
                    </div>
                </div> -->
            </v-form>
        </v-card-text>
    </v-card>
</template>

<style lang="scss" scoped>
.select-group {
    padding: 8px 12px;
    border: 1px solid #e6e6e6;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;

    &:focus {
        outline: none;
        border: 1px solid #e6e6e6;
    }
}
</style>
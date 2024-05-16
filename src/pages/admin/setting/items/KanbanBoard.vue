<template>
    <div>
        <v-card border>
            <v-card-item>
                <v-card-title>{{ $t('kanbanBoard') }}</v-card-title>
            </v-card-item>
            <v-card-text>
                <v-form 
                    class="mt-5"
                    @submit="validateData">
                    <v-row>
                        <v-col
                            cols="12"
                            lg="6"
                            md="6">
                            <div class="board-wrapper">
                                <div 
                                    class="board-item d-flex align-center ga-4 w-100 bg-grey-lighten-3 px-3 py-4 rounded mb-3 position-relative"
                                    v-for="(field, x) in fields"
                                    :key="x">
                                    <v-icon
                                        v-if="x != 0"
                                        class="delete-icon"
                                        :icon="mdiCloseCircle"
                                        size="20"
                                        color="red"
                                        @click.prevent="remove(x)"></v-icon>
                                    <field-input
                                        class="w-75"
                                        :label="t('name')"
                                        v-model="field.value.name"></field-input>

                                    <field-input
                                        class="w-25"
                                        :label="t('sort')"
                                        v-model="field.value.sort"></field-input>
                                </div>
                                <div class="board-item d-flex align-center ga-4 w-100 bg-grey-lighten-3 px-3 py-4 rounded mb-3 add justify-center">
                                    <v-btn
                                        @click.prevent="push({name: '', sort: ''})">
                                        {{ $t('addMore') }}
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>

                    <v-btn
                        variant="flat"
                        color="primary"
                        type="submit"
                        :disabled="loading">
                        <template v-if="loading">{{ $t('processing') }}</template>
                        <template v-else>{{ $t('save') }}</template>
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped lang="scss">
.delete-icon {
    position: absolute;
    top: -10px;
    right: 0;
    cursor: pointer;
}
</style>

<script setup>
import { onMounted } from 'vue';
import { useSettingStore } from '@/stores/setting';
import { useI18n } from 'vue-i18n';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';
import { mdiCloseCircle } from '@mdi/js';
import { ref } from 'vue';

const { t } = useI18n();

const store = useSettingStore();

const { handleSubmit } = useForm({
    validationSchema: yup.object({
        settings: yup.array().of(
            yup.object().shape({
                name: yup.string().required(),
                sort: yup.string().required(),
            }),
        ),
    }),
});

const { push, fields, remove, replace } = useFieldArray('settings')

const loading = ref(false);

const initKanban = async() => {
    const response = await store.initKanban();

    if (response.status < 300) {
        for (let a = 0; a < response.data.data.boards.length; a++) {
            push({name: response.data.data.boards[a].name, sort: response.data.data.boards[a].sort})
        }
    }
}

const validateData = handleSubmit(async(values) => {
    loading.value = true;
    const response = await store.storeKanban(values);
    loading.value = false;

    if (response.status < 300) {
        replace([]);
        initKanban();
    }
})

onMounted(() => {
    initKanban();
})
</script>
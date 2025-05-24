<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LedDetailForm from '../components/LedDetailForm.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const { t } = useI18n();

const { mobile } = useDisplay();

const ledFormComponent = ref(null);

const projectName = ref('My Event');
const projectDate = ref('23 September 2025');
const venue = ref('Hotel Gunadharma');
const location = ref('Surabaya');
const description_quill = ref(null);
const high_season = ref('1');
const equipment = ref('');

function updateDescription() {
    // if (description_quill.value.getText().length > 1) {
    //     setFieldValue('note', description_quill.value.getHTML())
    // } else {
    //     setFieldValue('note', null)
    // }
}
</script>

<template>
    <div>
        <v-row>
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('eventName') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="projectName"></field-input>
                </div>
            </v-col>
    
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('projectDate') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="projectDate"></field-input>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('location') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="location"></field-input>
                </div>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
                <div class="form-wrapper">
                    <label>{{ $t('venue') }}</label>
                    <field-input
                        :is-solo="true"
                        class="mt-2 custom-input"
                        :is-disabled="true"
                        density="compact"
                        :is-clearable="false"
                        :is-required="false"
                        v-model="venue"></field-input>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <div class="form-wrapper">
                    <v-label :text="t('note')" class="mb-2"></v-label>
                    <QuillEditor
                        class="quill-note"
                        theme="snow"
                        ref="description_quill"
                        @update:content="updateDescription" />
                </div>

                <div class="form-wrapper mt-3">
                    <LedDetailForm
                        :with-add-button="false"
                        :with-delete-button="false"
                        @update-led-event="updateLedArea"
                        ref="ledFormComponent"></LedDetailForm>
                </div>
            </v-col>

            <v-col cols="12" md="6" class="mt-1">
                <div class="d-flex" :style="{
                    gap: '40px'
                }">
                    <div class="form-wrapper">
                        <label>{{ $t('highSeasaon') }}</label>
                        <v-radio-group inline
                            v-model="high_season"
                            :disabled="true">
                            <v-radio
                                :label="t('yes')"
                                value="1"></v-radio>
                            <v-radio
                                :label="t('no')"
                                value="0"></v-radio>
                        </v-radio-group>
                    </div>

                    <div class="form-wrapper">
                        <label>{{ $t('equipment') }}</label>
                        <v-radio-group inline
                            v-model="equipment">
                            <v-radio
                                label="Lasika"
                                value="lasika"></v-radio>
                            <v-radio
                                label="Others"
                                value="others"></v-radio>
                        </v-radio-group>
                    </div>
                </div>

                <!-- total -->
                <table class="w-100 table-total">
                    <tbody>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Main Ballroom</td>
                            <td>
                                Rp<span>0</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Prefunction</td>
                            <td>
                                Rp<span>100,000,000</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>High Season Fee</td>
                            <td>
                                Rp<span>100,000,000</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Equipment Fee</td>
                            <td>
                                Rp<span>0</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Sub Total</td>
                            <td>
                                Rp<span>100,000,000</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Max. Discount</td>
                            <td>
                                Rp<span>100,000,000</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Total</td>
                            <td>
                                Rp<span>100,000,000</span>
                            </td>
                        </tr>
                        <tr class="border-table" :class="{
                            'mobile': mobile
                        }">
                            <td>Max. Price UP</td>
                            <td>
                                Rp<span>345,000,000</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- fix price -->
                <div class="form-wrapper">
                
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<style lang="scss" scoped>
.table-total {
    tbody {
        font-size: 13px;

        .mobile {
            td:first-child {
                padding-right: 20px;
            }
        }

        tr {
            td {
                padding: 8px 16px;
            }

            td:first-child {
                text-align: end;
                padding-right: 80px;
                width: 60%;
                font-weight: 500;
            }
            
            td:last-child {
                width: 40%;
                font-weight: bold;
            }
        }

        .border-table {
            td {
                border-bottom: 1px solid #000;
            }
        }
    }
}
</style>
<template>
    <div>
        <v-form>
            <h3>{{ $t('general') }}</h3>

            <v-divider></v-divider>

            <v-row>
                <v-col
                    cols="12"
                    md="4"
                    lg="4">
                    <div class="pt-4">
                        <field-input
                            :label="t('name')"
                            name="name"
                            :error-message="errors.name"
                            v-model="name"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                    lg="4">
                    <div class="pt-4">
                        <field-input
                            :label="t('nickname')"
                            :error-message="errors.nickname"
                            v-model="nickname"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                    lg="4">
                    <div class="pt-4">
                        <field-input
                            :label="t('employeeID')"
                            :error-message="errors.employee_id"
                            v-model="employee_id"></field-input>
                    </div>
                </v-col>
            </v-row> 
            <v-row>
                <v-col
                    cols="12"
                    md="6"
                    lg="6">
                    <div class="pt-4">
                        <field-input
                            :label="t('email')"
                            :error-message="errors.email"
                            @changes-event="checkEmail"
                            v-model="email"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="6">
                    <div class="pt-4">
                        <field-input
                            :label="t('phone')"
                            :error-message="errors.phone"
                            v-model="phone"></field-input>
                    </div>
                </v-col>
            </v-row> 
            <v-row>
                <v-col
                    cols="12"
                    md="6"
                    lg="6">
                    <div class="pt-4">
                        <field-input
                            :label="t('idNumber')"
                            fieldType="number"
                            @changes-event="checkIdNumber"
                            :error-message="errors.id_number"
                            v-model="id_number"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="6">
                    <div class="pt-4">
                        <field-input
                            :label="t('religion')"
                            :error-message="errors.religion"
                            v-model="religion"
                            inputType="select"
                            :selectOptions="religions"></field-input>
                    </div>
                </v-col>
            </v-row> 

            <v-row>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <date-picker
                        v-model="date_of_birth"
                        :label="t('dateOfBirth')"></date-picker>
                </v-col>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('placeOfBirth')"
                        v-model="place_of_birth"
                        :error-message="errors.place_of_birth"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    cols="12"
                    md="4"
                    lg="4">
                    <div class="pt-4">
                        <field-input
                            :label="t('martialStatus')"
                            :error-message="errors.martial_status"
                            v-model="martial_status"
                            inputType="select"
                            :selectOptions="martialStatuses"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                    lg="4">
                    <div class="pt-4">
                        <field-input
                            :label="t('address')"
                            :error-message="errors.address"
                            v-model="address"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                    lg="4">
                    <div class="pt-4">
                        <field-input
                            :label="t('postalCode')"
                            :error-message="errors.postal_code"
                            v-model="postal_code"></field-input>
                    </div>
                </v-col>
            </v-row> 
            <v-row>
                <v-col
                    cols="12"
                    md="3"
                    lg="3">
                    <div class="pt-4">
                        <field-input
                            :label="t('province')"
                            :error-message="errors.province_id"
                            v-model="province_id"
                            inputType="select"
                            :isRequired="false"
                            :selectOptions="listProvinces"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="3"
                    lg="3">
                    <div class="pt-4">
                        <field-input
                            :label="t('city')"
                            :error-message="errors.city_id"
                            v-model="city_id"
                            inputType="select"
                            :isRequired="false"
                            :selectOptions="cities"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="3"
                    lg="3">
                    <div class="pt-4">
                        <field-input
                            :label="t('district')"
                            :error-message="errors.district_id"
                            v-model="district_id"
                            inputType="select"
                            :isRequired="false"
                            :selectOptions="districts"></field-input>
                    </div>
                </v-col>
                <v-col
                    cols="12"
                    md="3"
                    lg="3">
                    <div class="pt-4">
                        <field-input
                            :label="t('village')"
                            :error-message="errors.village_id"
                            v-model="village_id"
                            inputType="select"
                            :isRequired="false"
                            :selectOptions="villages"></field-input>
                    </div>
                </v-col>
            </v-row> 

            <v-row>
                <v-col
                    cols="12"
                    lg="6"
                    md="6">
                    <v-switch
                        :label="t('isResidenceSameAsID')"
                        :error-messages="errors.is_residence_same"
                        v-model="is_residence_same"
                        color="primary"></v-switch>
                </v-col>

                <v-col
                    cols="12"
                    v-if="is_residence_same"
                    lg="6"
                    md="6">
                    <field-input
                        :label="t('currentAddress')"
                        v-model="current_address"
                        :error-message="errors.current_address"></field-input>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    cols="12"
                    lg="4"
                    md="4">
                    <field-input
                        :label="t('bloodType')"
                        v-model="blood_type"
                        :error-message="errors.blood_type"
                        :isRequired="false"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="4"
                    md="4">
                    <field-input
                        :label="t('dependents')"
                        v-model="dependents"
                        :error-message="errors.dependents"
                        :isRequired="false"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="4"
                    md="4">
                    <field-input
                        :label="t('gender')"
                        v-model="gender"
                        :error-message="errors.gender"
                        inputType="select"
                        :selectOptions="genderOptions"></field-input>
                </v-col>
            </v-row>

            <h3>{{ $t('banks') }}</h3>

            <v-divider></v-divider>

            <v-row>
                <v-col
                    cols="12">
                    <div class="bank-wrapper">
                        <div 
                            class="bank-item"
                            v-for="(field, x) in fields"
                            :key="field.key"
                            :id="'row-bank-' + x">
                            <v-icon
                                :icon="mdiCloseCircle"
                                color="red"
                                size="30"
                                @click.prevent="removeBank(x)"
                                class="position-absolute icon-remove-bank"></v-icon>
                            <v-row>
                                <v-col
                                    cols="12"
                                    lg="3"
                                    md="3">
                                    <field-input
                                        :label="t('bankName')"
                                        v-model="field.value.bank_name"
                                        :isRequired="false"
                                        :error-message="errors[`banks[${x}].bank_name`]"></field-input>
                                </v-col>
                                <v-col
                                    cols="12"
                                    lg="3"
                                    md="3">
                                    <field-input
                                        :label="t('accountNumber')"
                                        v-model="field.value.account_number"
                                        :isRequired="false"
                                        :error-message="errors[`banks[${x}].account_number`]"></field-input>
                                </v-col>
                                <v-col
                                    cols="12"
                                    lg="4"
                                    md="4">
                                    <field-input
                                        :label="t('accountHolderName')"
                                        :isRequired="false"
                                        v-model="field.value.account_holder_name"
                                        :error-message="errors[`banks[${x}].account_holder_name`]"></field-input>
                                </v-col>
                                <v-col
                                    cols="12"
                                    lg="2"
                                    md="2">
                                    <v-switch
                                        color="primary"
                                        v-model="field.value.is_active"
                                        @change.prevent="watcherBankStatus(x)"
                                        :label="t('isActive')"></v-switch>
                                </v-col>
                            </v-row>
                        </div>

                        <div class="bank-item d-flex align-center justify-center">
                            <v-btn
                                variant="outlined"
                                type="button"
                                density="compact"
                                width="30"
                                height="30"
                                color="success"
                                @click="addMoreBank">
                                <v-icon
                                    :icon="mdiPlus"></v-icon>
                                <v-tooltip
                                    activator="parent"
                                    location="start"
                                >{{ $t('addMoreBank') }}</v-tooltip>
                            </v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <h3>{{ $t('emergencyContact') }}</h3>

            <v-divider></v-divider>

            <v-row class="mt-3">
                <v-col
                    cols="12"
                    lg="4"
                    md="4">
                    <field-input
                        :label="t('name')"
                        v-model="relation_name"
                        :error-message="errors['relation.name']"
                        :isRequired="false"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="4"
                    md="4">
                    <field-input
                        :label="t('phone')"
                        v-model="relation_phone"
                        :error-message="errors['relation.phone']"
                        :isRequired="false"></field-input>
                </v-col>
                <v-col
                    cols="12"
                    lg="4"
                    md="4">
                    <field-input
                        :label="t('relation')"
                        v-model="relation_relation"
                        :error-message="errors['relation.relation']"
                        :isRequired="false"></field-input>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<style scoped lang="scss">
.bank-wrapper {
    margin-top: 10px;

    .bank-item {
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 4px;
        margin-bottom: 10px;
        position: relative;
        padding-top: 20px;
    }
}

.icon-remove-bank {
    top: -10px;
    right: 10px;
    cursor: pointer;
}
</style>

<script setup>
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useForm, useValidateForm, useFieldArray } from 'vee-validate';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { mdiCloseCircle, mdiPlus } from '@mdi/js';
import { useEmployeesStore } from '@/stores/employees';
import { useRegionStore } from '@/stores/region';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const store = useEmployeesStore();

const storeRegion = useRegionStore();

const route = useRoute();

const { t } = useI18n();

const props = defineProps({
    detailData : {
        default: null,
    },
    listProvinces: {
        type: Array,
    },
});

const { defineField, errors, values, setFieldValue, setFieldError, setValues } = useForm({
    validationSchema: yup.object({
        name: yup.string().required(t('nameRequired')),
        nickname: yup.string().required(t('nicknameRequired')),
        email: yup.string()
            .email()
            .required(t('emailRequired')),
        phone: yup.number()
            .transform((currentValue) => currentValue == "" ? undefined : currentValue)
            .required(t('phoneRequired'))
            .typeError(t('mustBeNumber')),
        id_number: yup.string()
            .max(16, t('idNumberMax', {max: 16}))
            .min(16, t('idNumberMax', {max: 16}))
            .required(t('idNumberRequired')),
        religion: yup.string().required(t('religionRequired')),
        martial_status: yup.string().required(t('martialStatusRequired')),
        address: yup.string().required(t('addressRequired')),
        province_id: yup.number().nullable(),
        city_id: yup.string().nullable(),
        district_id: yup.string().nullable(),
        village_id: yup.string().nullable(),
        postal_code: yup.number()
            .transform((currentValue) => currentValue == "" ? undefined : currentValue)
            .required(t('postalCodeRequired'))
            .typeError(t('mustBeNumber')),
        is_residence_same: yup.bool(),
        current_address: yup.string()
            .when('is_residence_same', {
                is: true,
                then: function () {
                    return yup.string().required(t('currentAddressRequired'))
                },
                otherwise: function () {
                    return yup.string().nullable()
                }
            }),
        blood_type: yup.string().nullable(),
        dependents: yup.string().nullable(),
        date_of_birth: yup.string().required(t('dateOfBirthRequired')),
        place_of_birth: yup.string().required(t('placeOfBirthRequired')),
        gender: yup.string().required(t('genderRequired')),
        banks: yup.array().of(
            yup.object().shape({
                bank_name: yup.string().required(t('bankNameRequired')),
                account_number: yup.string().required(t('accountNumberRequired')),
                account_holder_name: yup.string().required(t('accountHolderNameRequired')),
                is_active: yup.bool(),
            }),
        ),
        relation: yup.object().shape({
            name: yup.string().required(),
            phone: yup.number()
                .transform((currentValue) => currentValue == "" ? undefined : currentValue)
                .required(t('phoneRequired'))
                .typeError(t('mustBeNumber')),
            relation: yup.string()
                .transform((currentValue) => currentValue == "" ? undefined : currentValue)
                .required(t('relationRequired'))
        }),
        employee_id: yup.string().required(t('employeeIdRequired')),
    }),
});

const [relation_name] = defineField('relation.name');
const [relation_phone] = defineField('relation.phone');
const [relation_relation] = defineField('relation.relation');
const [name] = defineField('name');
const [nickname] = defineField('nickname');
const [email] = defineField('email');
const [phone] = defineField('phone');
const [id_number] = defineField('id_number');
const [religion] = defineField('religion');
const [martial_status] = defineField('martial_status');
const [address] = defineField('address');
const [province_id] = defineField('province_id');
const [city_id] = defineField('city_id');
const [district_id] = defineField('district_id');
const [village_id] = defineField('village_id');
const [postal_code] = defineField('postal_code');
const [current_address] = defineField('current_address');
const [is_residence_same] = defineField('is_residence_same');
const [blood_type] = defineField('blood_type');
const [gender] = defineField('gender');
const [dependents] = defineField('dependents');
const [date_of_birth] = defineField('date_of_birth');
const [place_of_birth] = defineField('place_of_birth');
const [employee_id] = defineField('employee_id');
const { remove, push, fields } = useFieldArray('banks');

const religions = ref([
    {title: t('katholik'), value: 'katholik'},
    {title: t('islam'), value: 'islam'},
    {title: t('kristen'), value: 'kristen'},
    {title: t('budha'), value: 'budha'},
    {title: t('hindu'), value: 'hindu'},
    {title: t('khonghucu'), value: 'khonghucu'},
]);

const genderOptions = ref([
    {title: t('male'), value: 'male'},
    {title: t('female'), value: 'female'},
]);

const martialStatuses = ref([
    {title: t('married'), value: 'married'},
    {title: t('single'), value: 'single'},
]);

const validate = useValidateForm();

const cities = ref([]);
const districts = ref([]);
const villages = ref([]);

function manualTrigger() {
    return store.storeGeneralInformation(values);
}

// expose manual validation trigger
defineExpose({
    validate,
    manualTrigger
});

onMounted(() => {
    if (!route.params.id) {
        addMoreBank();
        generateEmployeeId();
    }
});

// watch(detailOfEmployee, (values) => {
//     if (values) {
//         console.log('detailOfEmployee', values);
//     }
// })

watch(province_id, async (values) => {
    city_id.value = null;
    district_id.value = null;
    village_id.value = null;
    if (values) {
        cities.value = await storeRegion.getCities({province_code: values});

        if (route.params.id && props.detailData && cities.value.length) {
            if (
                (props.detailData.city_id) &&
                (cities.value.find(city => city.value == props.detailData.city_id) != undefined)
            ) {
                setFieldValue('city_id', props.detailData.city_id.toString());
            }
        }
    }
});

watch(city_id, async (values) => {
    district_id.value = null;
    village_id.value = null;
    if (values) {
        districts.value = await storeRegion.getDistricts({city_code: values});

        if (route.params.id && props.detailData && districts.value.length) {
            if (
                (props.detailData.district_id) &&
                (districts.value.find(district => district.value == props.detailData.district_id) != undefined)
            ) {
                setFieldValue('district_id', props.detailData.district_id.toString());
            }
        }
    }
});

watch(district_id, async (values) => {
    if (values) {
        villages.value = await storeRegion.getVillages({district_code: values});

        if (route.params.id && props.detailData && villages.value.length) {
            if (
                (props.detailData.village_id) &&
                (villages.value.find(village => village.value == props.detailData.village_id) != undefined)
            ) {
                setFieldValue('village_id', props.detailData.village_id.toString());
            }
        }
    }
});

watch(props, (values) => {
    if (values.detailData) {
        setValues({
            name: values.detailData.name,
            nickname: values.detailData.nickname,
            employee_id: values.detailData.employee_id,
            email: values.detailData.email,
            phone: values.detailData.phone,
            id_number: values.detailData.id_number,
            religion: values.detailData.religion,
            date_of_birth: values.detailData.date_of_birth,
            place_of_birth: values.detailData.place_of_birth,
            martial_status: values.detailData.martial_status,
            address: values.detailData.address,
            postal_code: values.detailData.postal_code,
            is_residence_same: values.detailData.current_address ? true : false,
            current_address: values.detailData.current_address,
            blood_type: values.detailData.blood_type,
            dependents: values.detailData.dependant,
            gender: values.detailData.gender,
        })

        if (values.listProvinces && props.detailData.province_id) {
            if (values.listProvinces.find(province => province.value == props.detailData.province_id)) {
                setFieldValue('province_id', props.detailData.province_id.toString());
            }
        }
        
        if (values.detailData.bank_detail.length && values.listProvinces.length) {
            for (let a = 0; a < values.detailData.bank_detail.length; a++) {
                push({
                    bank_name: values.detailData.bank_detail[a].bank_name, 
                    account_number: values.detailData.bank_detail[a].account_number, 
                    account_holder_name: values.detailData.bank_detail[a].account_holder_name, 
                    is_active: values.detailData.bank_detail[a].is_active
                });
            }
        }
        
        if (values.detailData.emergency_contact) {
            setValues({
                relation: {
                    name: values.detailData.emergency_contact.name,
                    phone: values.detailData.emergency_contact.phone,
                    relation: values.detailData.emergency_contact.relation,
                },
            });
        }
    }
})

async function checkEmail() {
    if (email.value) {
        const isValid = await store.checkEmail({email: email.value});
    
        if (!isValid) {
            setFieldError('email', t('emailAlreadyRegistered'));
        }
    }
}

async function checkIdNumber() {
    if (email.value) {
        const isValid = await store.checkIdNumber({id_number: id_number.value});
    
        if (!isValid) {
            setFieldError('email', t('idNumberAlreadyRegistered'));
        }
    }
}

const {
    // listOfProvinces,
    listOfCities,
    listOfDistricts,
    listOfVillages
} = storeToRefs(storeRegion);

// async function getProvinces() {
//     await storeRegion.getProvinces();
//     if (route.params.id) {
//         if (props.detailData.province_id) {
//             setFieldValue('province_id', props.detailData.province_id);
//         }
//     }
// }

async function generateEmployeeId() {
    const employeeId = await store.generateEmployeeId();
    if (employeeId) {
        setFieldValue('employee_id', employeeId);
    }
}

function addMoreBank() {
    push({bank_name: '', account_number: '', account_holder_name: '', is_active: false});
}

function removeBank(index) {
    remove(index);
    // document.getElementById('row-bank-' + key).remove();
}

function watcherBankStatus(key) {
    for (let a = 0; a < fields.value.length; a++) {
        fields.value[a].value.is_active = false;
    }

    fields.value[key].value.is_active = true;
}
</script>
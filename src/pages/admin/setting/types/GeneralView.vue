<template>
	<div>
		<breadcrumb-data :title="$t('project')" :breadcrumbs="breadcrumbs"></breadcrumb-data>

		<master-card>
			<v-card-item>
				<v-card-title>
					{{ $t('generalSetting') }}
				</v-card-title>
			</v-card-item>

			<v-card-text class="mt-5">
				<v-form>
					<v-row>
						<v-col cols="12" md=2>
							<v-label>{{ $t('companyLogo') }}</v-label>
						</v-col>
						<v-col cols="12" md="10" class="mb-0 pb-0">
							<file-pond-com
	                            ref="logo"
	                            class-name="my-pond"
	                            class="w-50 mb-5"
	                            :label-idle="t('chooseYourLogo')"
	                            allow-multiple="false"
	                            v-on:addfile="updateImages"
	                            accepted-file-types="image/png, image/jpg, image/jpeg, image/webp"
	                        ></file-pond-com>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md=2>
							<v-label>{{ $t('companyName') }}</v-label>
						</v-col>
						<v-col cols="12" md="10" class="mb-0 pb-0">
							<field-input
								:label="t('companyName')"
								v-model="company_name"
								:error-message="errors.company_name"
								density="compact"
								:is-solo="true"
								:class="{'mb-3': errors.company_name}"></field-input>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md=2>
							<v-label>{{ $t('companyEmail') }}</v-label>
						</v-col>
						<v-col cols="12" md="10" class="mb-0 pb-0">
							<field-input
								:label="t('companyEmail')"
								v-model="company_email"
								:error-message="errors.company_email"
								density="compact"
								:is-solo="true"
								:class="{'mb-3': errors.company_email}"></field-input>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md=2>
							<v-label>{{ $t('companyPhone') }}</v-label>
						</v-col>
						<v-col cols="12" md="10" class="mb-0 pb-0">
							<field-input
								:label="t('companyPhone')"
								v-model="company_phone"
								:error-message="errors.company_phone"
								density="compact"
								:class="{'mb-3': errors.company_phone}"></field-input>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md=2>
							<v-label>{{ $t('companyAddress') }}</v-label>
						</v-col>
						<v-col cols="12" md="10" class="mb-0 pb-0">
							<field-input
								:label="t('companyAddress')"
								v-model="company_address"
								:error-message="errors.company_address"
								density="compact"
								:class="{'mb-3': errors.company_address}"></field-input>
						</v-col>
					</v-row>

					<v-btn flat color="primary" type="submit">
						<template v-if="loading">
							{{ $t('processing') }}
						</template>
						<template v-else>
							{{ $t('save') }}
						</template>
					</v-btn>
				</v-form>
			</v-card-text>
		</master-card>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';
import * as yup from 'yup'
import { useForm } from 'vee-validate'

const { t } = useI18n();

const { defineField, errors, handleSubmit } = useForm({
	validationSchema: yup.object({
		company_name: yup.string().required(t('nameRequired')),
		company_email: yup.string().required(t('emailRequired')),
		company_phone: yup.string().required(t('phoneRequired')),
		company_address: yup.string().required(t('addressRequired')),
		company_logo: yup.string().nullable(),
	})
})

const [company_name] = defineField('company_name')
const [company_email] = defineField('company_email')
const [company_phone] = defineField('company_phone')
const [company_address] = defineField('company_address')
const [company_logo] = defineField('company_logo')

const breadcrumbs = ref([
    {
        title: t('setting'),
        disabled: false,
        href: '/admin/setting',
    },
    {
        title: t('generalSetting'),
        disabled: true,
        href: '/admin/production/projects',
    },
]);

function updateImages() {
    if (pond.value.getFiles().length) {
        var formData = new FormData();
        for (let a = 0; a < pond.value.getFiles().length; a++) {
            formData.append(`media[${a}]`, pond.value.getFiles()[a].file)
        }
    }
}
</script>
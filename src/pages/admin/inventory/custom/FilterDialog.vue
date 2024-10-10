<template>
  <v-dialog
    persistent
    v-model="show"
    max-width="500">
    <master-card>
      <v-card-item>
        <v-card-title class="d-flex align-center justify-space-between">
          {{ $t('filter') }}

          <v-icon
            :icon="mdiClose"
            size="15"
            class="pointer"
            @click.prevent="closeForm(false)"></v-icon>
        </v-card-title>
      </v-card-item>

      <v-card-text>
        <v-form @submit="validateData">
          <field-input
            :label="t('name')"
            v-model="name"></field-input>

<!--          <field-input-->
<!--            :label="t('itemLocation')"-->
<!--            v-model="location"-->
<!--            input-type="select"-->
<!--            :select-options="[]"></field-input>-->

          <v-btn
            class="w-100"
            flat
            color="primary"
            type="submit">
            {{ $t('save') }}
          </v-btn>
        </v-form>
      </v-card-text>
    </master-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {mdiClose} from "@mdi/js";
import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import { useForm } from "vee-validate";
import * as yup from "yup";

const { t } = useI18n();

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    name: yup.string().nullable(),
    location: yup.string().nullable()
  })
});

const [name] = defineField("name");
const [location] = defineField("location");

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['close-event']);

const show = ref(false);

watch(props, (values) => {
  if (values) {
    show.value = values.isShow;
  }
})

function closeForm(payloadFilter) {
  resetForm();
  emit("close-event", payloadFilter);
}

const validateData = handleSubmit(async (values) => {
  closeForm(values);
})
</script>

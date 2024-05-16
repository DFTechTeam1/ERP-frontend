import BreadcrumbData from "./BreadcrumbData.vue";
import TableList from './TableList.vue';
import ConfirmationModal from "./ConfirmationModal.vue";
import FieldInput from './FieldInput.vue'
import YearPicker from './YearPicker.vue'
import DatePicker from './DatePicker.vue'
import FilePicker from './FilePicker.vue'
import vSelect from 'vue-select';
import { QuillEditor } from '@vueup/vue-quill'
import VueFilePond from "vue-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import FilePondPluginTypePreview from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'vue-select/dist/vue-select.css';

const FilePond = VueFilePond(
    FilePondPluginImagePreview,
    FilePondPluginTypePreview
);

export function registerComponent(app) {

    app.component('breadcrumbData', BreadcrumbData)
        .component('tableList', TableList)
        .component('confirmationModal', ConfirmationModal)
        .component('ve-select', vSelect)
        .component('QuillEditor', QuillEditor)
        .component('field-input', FieldInput)
        .component('year-picker', YearPicker)
        .component('date-picker', DatePicker)
        .component('file-pond-com', FilePond)
        .component('VueDatePicker', VueDatePicker)
        .component('file-picker', FilePicker);
}
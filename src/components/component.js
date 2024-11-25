import BreadcrumbData from "./BreadcrumbData.vue";
import TableList from './TableList.vue';
import ConfirmationModal from "./ConfirmationModal.vue";
import ModalForm from "./ModalForm.vue";
import FieldInput from './FieldInput.vue'
import YearPicker from './YearPicker.vue'
import DatePicker from './DatePicker.vue'
import FilePicker from './FilePicker.vue'
import ButtonSubmit from './ButtonSubmit.vue'
import ImagePreview from './ImagePreview.vue'
import LoadingView from './LoadingView.vue'
import ColorPicker from './ColorPicker.vue'
import ImportExcel from './ImportExcel.vue'
import MasterCard from './MasterCard.vue'
import ButtonGroupNavigation from './ButtonGroupNavigation.vue'
import RoundedInput from './RoundedInput.vue'
import vSelect from 'vue-select';
import { QuillEditor } from '@vueup/vue-quill'
import VueFilePond from "vue-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import FilePondPluginTypePreview from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js'
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageEdit from 'filepond-plugin-image-edit'
import VueDatePicker from '@vuepic/vue-datepicker';
import VueCountdown from '@chenfengyuan/vue-countdown';
import '@vuepic/vue-datepicker/dist/main.css'

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.min.css'
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css'

import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'vue-select/dist/vue-select.css';

const FilePond = VueFilePond(
    FilePondPluginImagePreview,
    FilePondPluginTypePreview,
    FilePondPluginImageValidateSize,
    FilePondPluginFileValidateSize
);

const FilePondAvatar = VueFilePond(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
)

export function registerComponent(app) {

    app.component('breadcrumbData', BreadcrumbData)
        .component('tableList', TableList)
        .component('image-preview', ImagePreview)
        .component('color-picker', ColorPicker)
        .component('rounded-input', RoundedInput)
        .component('button-group-nav', ButtonGroupNavigation)
        .component('confirmationModal', ConfirmationModal)
        .component('modalForm', ModalForm)
        .component('ve-select', vSelect)
        .component('QuillEditor', QuillEditor)
        .component('field-input', FieldInput)
        .component('year-picker', YearPicker)
        .component('date-picker', DatePicker)
        .component('file-pond-com', FilePond)
        .component('file-pond-avatar', FilePondAvatar)
        .component('VueDatePicker', VueDatePicker)
        .component('ButtonSubmit', ButtonSubmit)
        .component('LoadingView', LoadingView)
        .component(VueCountdown.name, VueCountdown)
        .component('file-picker', FilePicker)
        .component('master-card', MasterCard)
        .component('import-excel', ImportExcel);
}

/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import VueApexCharts from "vue3-apexcharts";
import axios from 'axios'
import VueAxios from 'vue-axios'
import Notifications from '@kyvg/vue3-notification'
import { useEncrypt } from '@/compose/encrypt';
import moment from 'moment';
import { useRouter } from 'vue-router';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import { createI18n } from 'vue-i18n';
import enLang from '@/lang/en.json';
import idLang from '@/lang/id.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
      en: enLang,
      id: idLang,
  },
});

var jwt = localStorage.getItem('dfauth');

if (jwt != null) {
  const saltKey = import.meta.env.VITE_SALT_KEY;
  var encodedText = localStorage.getItem('dfauth');
  
  if (encodedText) {
    var { decodedString } = useEncrypt(encodedText, saltKey);
    
    var token = decodedString.token;
    var exp = decodedString.exp;
  
    var startTime = moment(exp);
    var end = moment(new Date());
    var duration = moment.duration(startTime.diff(end));
    var hours = duration.asHours();
    
    if (hours >= 0) {
      axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          config.headers.Authorization = 'Bearer ' + token        
          return config
        }, function (error) {
          // Do something with request error
          return Promise.reject(error);
        }
      )
    }
  }


}

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.common['Access-Control-Allow-Methods'] = '*'
axios.defaults.headers.common['app-language'] = localStorage.getItem('lang')

// axios handle error response
axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status == 401) {
      localStorage.removeItem('dfauth')

      window.location.href = '/auth/a/login'
    }

    if ((error.response.data) && (error.response.data.data) && (error.response.data.data.redirect)) {
      console.log('global error', error.response.data.data.redirect)
      window.location.href = error.response.data.data.redirect
    }

    return Promise.reject(error);
  }
);

export function registerPlugins (app) {
  app.provide('axios', app.config.globalProperties.axios)

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(VueApexCharts)
    .use(VueAxios, axios)
    .use(Notifications)
    .use(VCalendar, {})
    .use(VueVideoPlayer)
}

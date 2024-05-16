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
import i18n from '@/lang';
import moment from 'moment';
import { useEncrypt } from '@/compose/encrypt';

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
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.common['Access-Control-Allow-Methods'] = '*'

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
}

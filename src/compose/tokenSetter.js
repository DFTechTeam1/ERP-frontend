import moment from "moment";
import { useEncrypt } from "./encrypt";
import axios from "axios";

export function tokenSetter() {
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
}
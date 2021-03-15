import axios from 'axios';
import {Config} from '../config';

class UploadFilesService {
  upload(body,token,onUploadProgress) {

    return axios.post(Config.BASE_URL_PROD+'/upload', body, {
      headers: {
        "authorization": "JWT " + token
      },
      onUploadProgress,
    });
  }

  getFiles(token) {
    return axios.get(Config.BASE_URL_PROD+'/files', {
      headers: {
        "authorization": "JWT " + token
      }
    });
  }

  getAnalysis(token) {
    return axios.get(Config.BASE_URL_PROD+'/analysis', {
      headers: {
        "authorization": "JWT " + token
      }
    });
  }
}

export default new UploadFilesService();
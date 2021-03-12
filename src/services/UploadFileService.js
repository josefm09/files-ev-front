import axios from 'axios';
import {Config} from '../config';

class UploadFilesService {
  upload(file, onUploadProgress) {

    const body = {
        fileText: file
    };

    return axios.post(Config.BASE_URL_DEV+'/upload', body)
    .then(res => {
        //onUploadProgress
    })
  }

  getFiles() {
    return axios.get(Config.BASE_URL_DEV+'/files')
    .then(res => {
      
    })
  }
}

export default new UploadFilesService();
import React, { Component } from 'react';
import axios from 'axios';
import Login from '../components/Login';
import Home from '../components/Home';
import {Config} from '../config';
import Grid from '@material-ui/core/Grid';

class Page extends Component {
  constructor() {
    super();

    this.state = {
      userHome: false,
      errorMessage: '',
      userId: null
    }
    this.logUserIn = this.logUserIn.bind(this);
  }

  parseLogInResponse(user) {
    if (user) {
      this.setState({
        userHome: true,
        userId: user.token
      });
    } else {
      this.setState({
        errorMessage: 'Error en la peticion para acceder al sistema'
      })
    }
  }

  logUserIn(username, password) {
    
    const body = {
      email: username,
      password: password
    };
    return axios.post(Config.BASE_URL_DEV+'/auth/sign_in', body)
      .then(res => {
        this.parseLogInResponse(res.data);
      })
      .catch(err => {
        this.setState({
          errorMessage: 'Correo o contraseña no validos, el correo debe tener el dominio (coppel.com)'
        })
      })
  }

  render() {
    return (
      <Grid container>
        {this.state.userHome ?
          (<Home userId={this.state.userId} />) :
          (<Login errorMessage={this.state.errorMessage} logUserIn={this.logUserIn} />)
        }
      </Grid>
    )
  }
}

export default Page;
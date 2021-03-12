import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }

    this.loginHandler = this.loginHandler.bind(this);
    this.handleUsernameChange = this.handleChange.bind(this, 'username');
    this.handlePasswordChange = this.handleChange.bind(this, 'password');
  }

  handleChange(property, event) {
    this.setState({
      [property]: event.target.value
    });
  }

  loginHandler(e) {
    e.preventDefault();
    this.props.logUserIn(this.state.username, this.state.password);
  }

  render() {
    const { errorMessage } = this.props;
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div >
            <br/>
            <Typography component="h1" variant="h5">
              Acceso al sistema
            </Typography>
            <form noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electronico"
                name="email"
                value={this.state.username}
                onChange={this.handleUsernameChange}
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.loginHandler}
              >
                Acceder
              </Button>
              {errorMessage ? <p>{errorMessage}</p> : null}
            </form>
          </div>
        </Container>
    );
  }
}

export default Login;
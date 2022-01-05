import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { login as signin } from '../store/auth/authAction.js'

// import $ from 'jquery';
import axios from 'axios';

import { authService } from '../services';

const defaultFormButtonText = 'Войти';
const disabledFormButtonText = 'Загрузка...';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(7),
    height: theme.spacing(7),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


class SignIn extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
        login: '', 
        password: '',
        showPassword: false
      };
    
    this.handleChangeLogin = this.handleChangeLogin.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangePassword(event){
      this.setState({password: event.target.value});
  }

  handleChangeLogin(event) {
      this.setState({login: event.target.value});
  }
  
  handleSubmit(e){
    e.preventDefault();
    this.props.signinUser(this.state.login, this.state.password);
  }
  
  handleClickShowPassword = () => {
    this.setState((state) => {
        return { showPassword: !state.showPassword }
    });
  };
  
  render() {
      const { classes, disabled } = this.props;
      
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar} src="/tfoms.png" />
            <Typography component="h1" variant="h5">
              Войти в систему
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                type="email"
                fullWidth
                id="email"
                label="Email адрес"
                name="email"
                autoComplete="email"
                value={this.state.login}
                onChange={this.handleChangeLogin}
                autoFocus
              />
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                  <OutlinedInput
                    required
                    
                    name="password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={this.state.password}
                    onChange={this.handleChangePassword}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowPassword}
                        >
                          {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={60}
                  />
              </FormControl>
              {/*
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
               />
               */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={disabled}
              >
                {disabled ? disabledFormButtonText : defaultFormButtonText}
              </Button>
              <Grid container>
                {/*
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
                */}
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            
          </Box>
        </Container>
      );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = function(store) {
  console.log(store);
  return {
      disabled: store.authReducer.loading,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    signinUser: (email, password) => {
        dispatch(signin(email, password));
    },
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(SignIn)));
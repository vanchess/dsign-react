import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import {List, ListItem, Divider, ListItemAvatar, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
// import { makeStyles } from '@mui/material/styles';
import Container from '@mui/material/Container';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';

import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { login as signin } from '../store/auth/authAction.js'

// import $ from 'jquery';
import axios from 'axios';

import { authService } from '../services';
import { Card, CardContent, CardMedia } from '@mui/material';
import Paper from '@mui/material/Paper';

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
    padding: theme.spacing(2),
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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
});

const cards = [
  {id:1, title:'Подписать файлы ЭП', text:'', image:"/images/tfoms.png", to:'/eissoi' },
];

const cardsOut= [
  {id:3, title:'Учет направлений на госпитализацию', text:''/*'Персонифицированная база данных по учету направлений на госпитализацию и информирований о необходимости прохождения профессиональных осмотров'*/, image:"/images/doctor.jpg", to:'http://192.168.12.1:8080/iso/f?p=101' },
  {id:4, title:'Учет обращений граждан (для СМО)', text:'', image:"/images/callcenter.jpg", to:'http://192.168.12.1:8082/adv/backend/web' },
];

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
      
      return <>
      <Container component="main" maxWidth="md" spacing={2}>
        <CssBaseline />
          <Grid container>
            <Grid item xs={12} sm={12} md={6}>
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
                            size="large">
                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Пароль"
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
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper variant="outlined" className={classes.paper}>
              <List className={classes.root}>
                {cardsOut.map((card) => (
                  <React.Fragment key={card.id}>
                    <ListItem alignItems="flex-start" component={Link} href={ card.to } target="_blank" rel="noopener noreferrer" color="inherit" underline="none">
                      <ListItemAvatar>
                        <Avatar alt={card.title} src={card.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={card.title}
                        secondary={
                          <React.Fragment>
                            {card.text}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))} 
                {cards.map((card) => (
                  <React.Fragment key={card.id}>
                    <ListItem alignItems="flex-start" component={Link} href={ card.to } color="inherit" underline="none">
                      <ListItemAvatar>
                        <Avatar alt={card.title} src={card.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={card.title}
                        secondary={
                          <React.Fragment>
                            {card.text}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))} 
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      </>;
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = function(store) {
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
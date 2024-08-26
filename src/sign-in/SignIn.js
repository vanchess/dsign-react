import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import {List, ListItem, Divider, ListItemAvatar, ListItemText, styled } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import PropTypes from 'prop-types';

import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { login as signin } from '../store/auth/authAction.js'

import Paper from '@mui/material/Paper';
import { AvatarStyled } from './AvatarStyled.js';
import { FormStyled } from './FormStyled.js';
import { SubmitButton } from './SubmitButton.js';

const defaultFormButtonText = 'Войти';
const disabledFormButtonText = 'Загрузка...';

const PaperStyled = styled(Paper)(({theme}) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}))

const DivStyled = styled('div')(({theme}) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

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
              <DivStyled>
              <AvatarStyled src="/tfoms.png" />
              <Typography component="h1" variant="h5">
                Войти в систему
              </Typography>
              <FormStyled onSubmit={this.handleSubmit}>
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
                  <InputLabel htmlFor="password">Пароль</InputLabel>
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
                <SubmitButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={disabled}
                >
                  {disabled ? disabledFormButtonText : defaultFormButtonText}
                </SubmitButton>
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
              </FormStyled>
            </DivStyled>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <PaperStyled variant="outlined" >
              <List>
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
            </PaperStyled>
          </Grid>
        </Grid>
      </Container>
      </>;
  }
}

SignIn.propTypes = {
  // classes: PropTypes.object.isRequired,
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

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(SignIn));
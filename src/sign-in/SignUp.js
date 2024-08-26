import React, { useEffect, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { useSelector, useDispatch  } from 'react-redux'
import { organizationFetch } from '../store/organization/organizationAction.js'

import { validate } from '../_helpers';
import { authService } from '../services';
import { inviteService } from '../services';

import { useHistory } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import { FormStyled } from './FormStyled.js';
import { styled } from '@mui/material';

const DivStyled = styled('div')(({theme}) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))
  
const defaultFormButtonText = 'Зарегистрироваться';

export default function SignUp(props) {
  let history = useHistory();
  
  const organizations = useSelector(store => store.organizationReducer.items);
  const loading = useSelector(store => store.organizationReducer.loading);
  const dispatch = useDispatch();
  
  const [formButtonText, setFormButtonText] = useState(defaultFormButtonText);
  const [formButtonDisabled, setFormButtonDisabled] = useState(false);
  
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [branch, setBranch] = useState('');
  const [organization, setOrganization] = useState(null);
  const [snils, setSnils] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [firstName, setFirstName] = useState('');
  
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(0);
  const [organizationForced, setOrganizationForced] = useState(false);
  
  
  const signUp = (newUser) => {
        setFormButtonDisabled(true);
        setFormButtonText("Регистрация... ");

        authService.signUp(newUser).then(
            user => {
                alert('Регистрация прошла успешно!');
                history.push('/');
            },
            error => { 
                alert(error);
                setFormButtonDisabled(false);
                setFormButtonText(defaultFormButtonText);
            }
        );
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let error = {};
    if (!validate.snils(snils, error)) {
        alert(`Ошибка в СНИЛС: ${error.message}`);
        return;
    }    
    
    if (password.length < 6) {
        alert('Задайте пароль не менее 6 символов');
        return;
    }
    
    if (password !== passwordConfirmation) {
        alert('Пароли не совпадают');
        return;
    }
    
    let newUser = {
            first_name:firstName,
            middle_name:middleName,
            last_name:lastName,
            snils:snils,
            organization_id:organization.id,
            branch:branch,
            job_title:jobTitle,
            email:email,
            password:password,
            password_confirmation:passwordConfirmation,
            invite:props.match.params.invite
        }
    
    signUp(newUser);
    
  }
  
  useEffect( () => {
      dispatch(organizationFetch(0, -1));
      inviteService.get(props.match.params.invite).then(
        result => {
            let options = result.options;
            setSelectedOrganizationId(options.organization_id.value);
            setOrganizationForced(options.organization_id.forced);
        },
        error  => (history.push('/'))
      )
  },[dispatch]);
  
  useEffect( () => {
      if (organizations[selectedOrganizationId]) {
        setOrganization(organizations[selectedOrganizationId]);
      }
  },[organizations, selectedOrganizationId]);
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <DivStyled>
        <AvatarStyled src="/tfoms.png" />
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <FormStyled onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="lastName"
                label="Фамилия"
                name="lastName"
                autoComplete="lname"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstName"
                label="Имя"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                id="middleName"
                label="Отчество"
                name="middleName"
                autoComplete="mname"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                
                InputProps={{ inputProps: { pattern:"[0-9]{11}" } }}
                fullWidth
                value={snils}
                onChange={(e) => setSnils(e.target.value)}
                id="snils"
                label="СНИЛС"
                name="snils"
                helperText="Введите 11 цифр СНИЛС без пробелов и тире"
              />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                  required
                  disabled={organizationForced}
                  id="organization"
                  fullWidth
                  value={organization}
                  onChange={(e, newValue) => setOrganization(newValue)}
                  options={organizations}
                  getOptionLabel={(option) => (option.attributes ? option.attributes.short_name : '')}
                  isOptionEqualToValue = {(option, value) => (value && option.id === value.id)}
                  filterOptions={
                      createFilterOptions({stringify: (option) => {return (option.attributes.short_name + option.attributes.name)}})
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Организация *" placeholder="Начните вводить наименование" />
                  )}
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                id="branch"
                label="Подразделение"
                name="branch"
                
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                id="organization-title"
                label="Должность"
                name="organization-title"
                autoComplete="organization-title"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                label="Адрес электронной почты"
                name="email"
                autoComplete="email"
                helperText="Email будет использован для входа в систему"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="off"
                helperText="Не менее 6 символов"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                name="password-confirmation"
                label="Подтверждение пароля"
                type="password"
                id="password-confirmation"
                autoComplete="off"
              />
            </Grid>
          </Grid>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
          { formButtonText }
          </SubmitButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                href="#"
                component={RouterLink}
                variant="body2"
                to={'/login'}
                underline="hover">
                Уже зарегистрированы? Войти
              </Link>
            </Grid>
          </Grid>
        </FormStyled>
      </DivStyled>
      <Box mt={5}>

      </Box>
    </Container>
  );
}
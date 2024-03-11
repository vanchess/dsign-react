import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';

import { validate } from '../_helpers';
import { pdService } from '../services';

import moment from 'moment';

const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

  
const defaultFormButtonText = 'Сохранить';

export default function PD(props) {
  const classes = useStyles();
  
  const [formButtonText, setFormButtonText] = useState(defaultFormButtonText);
  const [formButtonDisabled, setFormButtonDisabled] = useState(false);
  
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [address, setAddress] = useState('');
  const [snils, setSnils] = useState('');
  const [pSeries, setPSeries] = useState('');
  const [pNumber, setPNumber] = useState('');
  const [pIssuedBy, setPIssuedBy] = useState('');
  const [pDepartmentCode, setPDepartmentCode] = useState('');
  const [pDate, setPDate] = useState(null);
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [inn, setInn] = useState('');
  const [birthday, setBirthday] = useState(null);
  
  
  const signUp = (invite, newUser) => {
        setFormButtonDisabled(true);
        setFormButtonText("Сохранение... ");

        pdService.update(invite, newUser).then(
            user => {
                alert('Сохранено!');
                setFormButtonDisabled(false);
                setFormButtonText(defaultFormButtonText);
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

    let newUser = {
            last_name:lastName,
            first_name:firstName,
            middle_name:middleName,
            snils:snils,
            address:address,
            p_series:pSeries,
            p_number:pNumber,
            p_issued_by:pIssuedBy,
            p_department_code:pDepartmentCode,
            p_date:pDate,
            birthday:birthday,
            place_of_birth:placeOfBirth,
            inn:inn,
        }
    
    signUp(props.match.params.invite, newUser);
    
  }
  
  useEffect( () => {
      pdService.get(props.match.params.invite).then(
        result => {
            setLastName(result.last_name);
            setFirstName(result.first_name);
            setMiddleName(result.middle_name);
            setAddress(result.address);
            setSnils(result.snils);
            setPSeries(result.p_series);
            setPNumber(result.p_number);
            setPIssuedBy(result.p_issued_by);
            setPDepartmentCode(result.p_department_code);
            setPDate(result.p_date && result.p_date.substring(0,10));
            let pDate = document.getElementById('p-date');
            pDate.value = result.p_date && result.p_date.substring(0,10);
            setBirthday(result.birthday && result.birthday.substring(0,10));
            let birthday = document.getElementById('birthday');
            birthday.value = result.birthday && result.birthday.substring(0,10);
            setPlaceOfBirth(result.place_of_birth);
            setInn(result.inn);
        },
        error  => (history.push('/'))
      )
  },[]);
  console.log(pDate);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar} src="/tfoms.png" />
        <Typography component="h1" variant="h5">
          Данные для выпуска сертификата
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
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
                id="birthday"
                label="Дата рождения"
                type="date"
                fullWidth
                defaultValue={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              /> 
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                id="placeOfBirth"
                label="Место рождения"
                name="placeOfBirth"
                multiline
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
              <TextField
                variant="outlined"
                required
                
                InputProps={{ inputProps: { pattern:"[0-9]{12}" } }}
                fullWidth
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                id="inn"
                label="ИНН"
                name="inn"
                helperText="Введите 12 цифр ИНН без пробелов и тире"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                id="address"
                label="Адрес проживания"
                name="address"
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={pSeries}
                onChange={(e) => setPSeries(e.target.value)}
                id="p-series"
                label="Серия паспорта"
                name="p-series"
                InputProps={{ inputProps: { pattern:"[0-9]{4}" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={pNumber}
                onChange={(e) => setPNumber(e.target.value)}
                id="p-number"
                label="Номер паспорта"
                name="p-number"
                InputProps={{ inputProps: { pattern:"[0-9]{6}" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={pIssuedBy}
                onChange={(e) => setPIssuedBy(e.target.value)}
                id="p-issued-by"
                label="Кем выдан"
                name="p-issued-by"
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={pDepartmentCode}
                onChange={(e) => setPDepartmentCode(e.target.value)}
                id="p-department-code"
                label="Код подразделения"
                name="p-department-code"
                InputProps={{ inputProps: { pattern:"[0-9]{3}-[0-9]{3}" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="standard"
                id="p-date"
                label="Дата выдачи"
                type="date"
                defaultValue={pDate}
                onChange={(e) => setPDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }} />
            </Grid>
            
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
          { formButtonText }
          </Button>
          
        </form>
      </div>
      <Box mt={5}>

      </Box>
    </Container>
  );
}
import React, {useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authPermissionsSelector } from './store/auth/authSelectors';
import { styled } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://ktfoms.orbitel.ru/" underline="hover">
        ТФ ОМС Курганской области
      </Link>{' '}
      2021-{new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const StartPageContainer = styled(Container)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
}))

const CardMediaStyled = styled(CardMedia)(({theme}) => ({
  paddingTop: '56.25%', // 16:9
}))

const CardContentStyled = styled(CardContent)(({theme}) => ({
  flexGrow: 1,
}))

const FooterStyled = styled('footer')(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6),
}))

const AvatarStyled = styled(Avatar)(({theme}) => ({
    margin: theme.spacing(1),
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: 'white',  
}))

const CardLnc = styled(Card)(({theme}) => ({
  textDecoration: 'none',
    '&:focus, &:hover, &:visited, &:link, &:active': {
        textDecoration: 'none'
    }
}))

const cards = [
    {id:1, title:'Почта', text:'Отправка сообщений и подписанных электронной подписью файлов', image:"/images/mail.jpg", to:'/mail'  },
    {id:2, title:'Счета', text:'Отправка подписанных электронной подписью счетов и актов сверки', image:"/images/75cb.jpg", to:'/bills' },
    {id:3, title:'Экспертиза', text:'Отправка подписанных электронной подписью актов (МЭК, МЭЭ)', image:"/images/exp.jpg", to:'/expertise' },
    {id:4, title:'Реестры', text:'Отправка подписанных электронной подписью реестров', image:"/images/tfoms.png", to:'/registers' },
    {id:5, title:'Соглашения', text:'Подписание соглашений и договоров', image:"/images/dogovor.jpg", to:'/agreements' },
    {id:6, title:'Админ', text:'', image:"/images/tfoms.png", to:'/admin', permission:'assign-role mo-lider' },
    {id:8, title:'Подписать файлы ЭП', text:'', image:"/images/tfoms.png", to:'/eissoi', permission:'service file-dsign' },
    {id:9,  title:'Проф. мероприятия', text:'Списки сотрудников на проф.мероприятия', image:"/images/displist2.jpg", to:'/displist', permission:'service displist' },
    {id:10, title:'Диспансерное наблюдение', text:'Списки сотрудников на диспансерное наблюдение', image:"/images/dn.jpg", to:'/dn', permission:'service dn' },
];
const cardsNew = [
    {id:10, title:'Заявки СМО', text:'', image:"/images/smoFin.png", to:'/smo-fin', permission:'service smo-fin' },
];
const cards2 = [
    // {id:8, title:'Мониторинг', text:'Мониторинг приема реестров', image:"/images/monitoring.png", to:'/f1' }, 
];
const cardsOut= [
    {id:3, title:'Учет направлений на госпитализацию', text:''/*'Персонифицированная база данных по учету направлений на госпитализацию и информирований о необходимости прохождения профессиональных осмотров'*/, image:"/images/doctor.jpg", to:'http://192.168.12.1:8080/iso/f?p=101' },
    {id:4, title:'Учет обращений граждан (для СМО)', text:'', image:"/images/callcenter.jpg", to:'http://192.168.12.1:8082/adv/backend/web' },
];


export default function StartPage() {
  const permissions = useSelector(authPermissionsSelector);

  useEffect( () => {
      document.title = "DSign App";
  },[]);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          
          <AvatarStyled src="/tfoms.png" />
          <Typography variant="h6" color="inherit" noWrap>
            ТФ ОМС Курганской области
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <StartPageContainer maxWidth="md">
          <Grid container spacing={4}>
            {cards.map((card) => {
              if(card.permission && !permissions.includes(card.permission)) {
                return null;
              }

              return (
                <Grid item key={card.id} xs={12} sm={4} md={3}>
                  <CardLnc component={RouterLink} to={ card.to } >
                    <CardMediaStyled
                      image={ card.image }
                      title={ card.title }
                    />
                    <CardContentStyled>
                      <Typography gutterBottom variant="h5" component="h2">
                      { card.title }
                      </Typography>
                      <Typography >
                      { card.text }
                      </Typography>
                    </CardContentStyled>
                    {/*
                    <CardActions>
                      <Button   size="small" color="primary">
                        Открыть
                      </Button>
                    </CardActions>
                    */}
                  </CardLnc>
                </Grid>
            )})}
            {cardsNew.map((card) => {
              if(card.permission && !permissions.includes(card.permission)) {
                return null;
              }
              return (
              <Grid item key={card.id} xs={12} sm={4} md={3}>
                <CardLnc component={RouterLink} to={ card.to } >
                  <CardMediaStyled
                    image={ card.image }
                    title={ card.title }
                  />
                  <CardContentStyled disabled >
                    <Typography gutterBottom variant="h5" component="h2">
                    { card.title }
                    </Typography>
                    <Typography >
                    { card.text }
                    </Typography>
                    <Typography color="secondary">
                    НОВОЕ
                    </Typography>
                  </CardContentStyled>
                  {/*
                  <CardActions>
                    <Button   size="small" color="primary">
                      Открыть
                    </Button>
                  </CardActions>
                  */}
                </CardLnc>
              </Grid>
            )
            })}
            {cards2.map((card) => (
              <Grid item key={card.id} xs={12} sm={4} md={3}>
                <CardLnc component={RouterLink} to={ card.to } >
                  <CardMediaStyled
                    image={ card.image }
                    title={ card.title }
                  />
                  <CardContentStyled>
                    <Typography gutterBottom variant="h5" component="h2">
                    { card.title }
                    </Typography>
                    <Typography >
                    { card.text }
                    </Typography>
                  </CardContentStyled>
                  {/*
                  <CardActions>
                    <Button   size="small" color="primary">
                      Открыть
                    </Button>
                  </CardActions>
                  */}
                </CardLnc>
              </Grid>
            ))}
            {cardsOut.map((card) => (
              <Grid item key={card.id} xs={12} sm={4} md={3}>
                <Card component={Link} href={ card.to } target="_blank" rel="noopener noreferrer" color="inherit" underline="none" disabled>
                  <CardMediaStyled
                    image={ card.image }
                    title={ card.title }
                  />
                  <CardContentStyled>
                    <Typography gutterBottom variant="h5" component="h2" >
                    { card.title }
                    </Typography>
                    <Typography>
                    { card.text }
                    </Typography>
                  </CardContentStyled>
                  {/*
                  <CardActions>
                    <Button size="small" color="primary">
                      Открыть
                    </Button>
                  </CardActions>
                  */}
                </Card>
              </Grid>
            ))}
          </Grid>
        </StartPageContainer>
      </main>
      {/* Footer */}
      <FooterStyled>
          {/*
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
          */}
        <Copyright />
      </FooterStyled>
      {/* End footer */}
    </React.Fragment>
  );
}
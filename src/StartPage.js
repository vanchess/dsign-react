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
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authPermissionsSelector } from './store/auth/authSelectors';

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

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: 'white',
  },
  lnk: {
    textDecoration: 'none',
    '&:focus, &:hover, &:visited, &:link, &:active': {
        textDecoration: 'none'
    }
  }
}));

const cards = [
    {id:1, title:'Почта', text:'Отправка сообщений и подписанных электронной подписью файлов', image:"/images/mail.jpg", to:'/mail'  },
    {id:2, title:'Счета', text:'Отправка подписанных электронной подписью счетов и актов сверки', image:"/images/75cb.jpg", to:'/bills' },
    {id:3, title:'Экспертиза', text:'Отправка подписанных электронной подписью актов (МЭК, МЭЭ)', image:"/images/exp.jpg", to:'/expertise' },
    {id:4, title:'Реестры', text:'Отправка подписанных электронной подписью реестров', image:"/images/tfoms.png", to:'/registers' },
    {id:5, title:'Соглашения', text:'Подписание соглашений и договоров', image:"/images/dogovor.jpg", to:'/agreements' },
    {id:6, title:'Админ', text:'', image:"/images/tfoms.png", to:'/admin', permission:'assign-role mo-lider' },
    {id:8, title:'Подписать файлы ЭП', text:'', image:"/images/tfoms.png", to:'/eissoi', permission:'service file-dsign' },
];
const cardsNew = [
    
];
const cards2 = [
    // {id:8, title:'Мониторинг', text:'Мониторинг приема реестров', image:"/images/monitoring.png", to:'/f1' }, 
];
const cardsOut= [
    {id:3, title:'Учет направлений на госпитализацию', text:''/*'Персонифицированная база данных по учету направлений на госпитализацию и информирований о необходимости прохождения профессиональных осмотров'*/, image:"/images/doctor.jpg", to:'http://192.168.12.1:8080/iso/f?p=101' },
    {id:4, title:'Учет обращений граждан (для СМО)', text:'', image:"/images/callcenter.jpg", to:'http://192.168.12.1:8082/adv/backend/web' },
];


export default function StartPage() {
  const classes = useStyles();
  const permissions = useSelector(authPermissionsSelector);

  useEffect( () => {
      document.title = "DSign App";
  },[]);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          
          <Avatar className={classes.avatar} src="/tfoms.png" />
          <Typography variant="h6" color="inherit" noWrap>
            ТФ ОМС Курганской области
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {cards.map((card) => {
              if(card.permission && !permissions.includes(card.permission)) {
                return null;
              }

              return (
                <Grid item key={card.id} xs={12} sm={4} md={3}>
                  <Card className={/*classes.card*/ classes.lnk} component={RouterLink} to={ card.to } >
                    <CardMedia
                      className={classes.cardMedia}
                      image={ card.image }
                      title={ card.title }
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                      { card.title }
                      </Typography>
                      <Typography >
                      { card.text }
                      </Typography>
                    </CardContent>
                    {/*
                    <CardActions>
                      <Button   size="small" color="primary">
                        Открыть
                      </Button>
                    </CardActions>
                    */}
                  </Card>
                </Grid>
            )})}
            {cardsNew.map((card) => (
              <Grid item key={card.id} xs={12} sm={4} md={3}>
                <Card className={/*classes.card*/ classes.lnk} component={RouterLink} to={ card.to } >
                  <CardMedia
                    className={classes.cardMedia}
                    image={ card.image }
                    title={ card.title }
                  />
                  <CardContent className={classes.cardContent} disabled >
                    <Typography gutterBottom variant="h5" component="h2">
                    { card.title }
                    </Typography>
                    <Typography >
                    { card.text }
                    </Typography>
                    <Typography color="secondary">
                    НОВОЕ
                    </Typography>
                  </CardContent>
                  {/*
                  <CardActions>
                    <Button   size="small" color="primary">
                      Открыть
                    </Button>
                  </CardActions>
                  */}
                </Card>
              </Grid>
            ))}
            {cards2.map((card) => (
              <Grid item key={card.id} xs={12} sm={4} md={3}>
                <Card className={/*classes.card*/ classes.lnk} component={RouterLink} to={ card.to } >
                  <CardMedia
                    className={classes.cardMedia}
                    image={ card.image }
                    title={ card.title }
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                    { card.title }
                    </Typography>
                    <Typography >
                    { card.text }
                    </Typography>
                  </CardContent>
                  {/*
                  <CardActions>
                    <Button   size="small" color="primary">
                      Открыть
                    </Button>
                  </CardActions>
                  */}
                </Card>
              </Grid>
            ))}
            {cardsOut.map((card) => (
              <Grid item key={card.id} xs={12} sm={4} md={3}>
                <Card component={Link} href={ card.to } target="_blank" rel="noopener noreferrer" color="inherit" underline="none" disabled>
                  <CardMedia
                    className={classes.cardMedia}
                    image={ card.image }
                    title={ card.title }
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2" >
                    { card.title }
                    </Typography>
                    <Typography>
                    { card.text }
                    </Typography>
                  </CardContent>
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
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
          {/*
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
          */}
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
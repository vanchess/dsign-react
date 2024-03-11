import React from 'react';
import clsx from 'clsx';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';

import withStyles from '@mui/styles/withStyles';

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
})

class Dashboard extends React.Component {
    
    constructor(props){
      super(props);
       
      this.props.setTitle('Dashboard');

    }
  
  render() {
      const { classes } = this.props;
      const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
      //this.props.handleSetTitle('123');
      
      
      
      return (
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                  
                {/* Chart */}
                {/*<Grid item xs={12} md={8} lg={9}>
                  <Paper className={fixedHeightPaper}>
                    <Chart />
                  </Paper>
                </Grid>
                {/* Recent Deposits */}
                {/*<Grid item xs={12} md={4} lg={3}>
                  <Paper className={fixedHeightPaper}>
                    <Deposits />
                  </Paper>
                </Grid>
                {/* Recent Orders */}
                {/*<Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Orders />
                  </Paper>
                </Grid>*/}
              </Grid>
            </Container>
          </main>
      );
  }
}

export default withStyles(styles)(Dashboard);
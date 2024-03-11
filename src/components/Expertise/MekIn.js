import React from 'react';
import { withRouter } from "react-router-dom";
import withStyles from '@mui/styles/withStyles';
import { green } from '@mui/material/colors';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import MekList from './MekList';
import MekShowMessage from '../Expertise/MekShowMessage';

import { connect } from 'react-redux';

import { messageStatusFetch } from '../../store/messageStatus/messageStatusAction.js'
import { createColumns } from './columnsDataGrid.js'
import FullScreenDialog from '../Dialog/FullScreenDialog'
import MekFilter from './MekFilter'

const styles = theme => ({
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
  
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSendDiv: {
    textAlign: 'right',
  }
})


class MekInMessage extends React.Component {
    
    constructor(props){
      super(props);
      
      this.state = {
        openMessageDialog: false,
        title: 'Акты',
        msgTitle: 'Акты',
      };
      
      this.handleClickShowItem   = this.handleClickShowItem.bind(this);
      this.handleCloseDialog     = this.handleCloseDialog.bind(this);
    }
    
    componentDidMount(){
        this.props.fetchMessageStatuses();
        
        if (this.props.match.params.id) {
            this.setState({openMessageDialog: true});
        }
        
        const type = this.props.match.params.type;
        let c = `Акты`;
        let m = 'Акты';
        if (type === 'mee') {
            c = `Акты МЭЭ`;
            m = 'Акты МЭЭ';
        }
        if (type === 'mek') {
            c = `Акты МЭК`;
            m = `Акты МЭК`;
        }
        
        this.setState({
            title: c,
            msgTitle: m
        });
        this.props.setTitle(this.state.title);
    }
    
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params.id !== this.props.match.params.id) {
        if (this.props.match.params.id) {
            this.setState({openMessageDialog: true});
        } else {
            this.setState({openMessageDialog: false});
        }
      }
      
      if (prevProps.match.params.type !== this.props.match.params.type) {
        const type = this.props.match.params.type;
        let c = `Акты`;
        let m = 'Акты';
        if (type === 'mee') {
            c = `Акты МЭЭ`;
            m = 'Акты МЭЭ';
        }
        if (type === 'mek') {
            c = `Акты МЭК`;
            m = `Акты МЭК`;
        }
        
        this.setState({
            title: c,
            msgTitle: m
        });
      }
      if (prevState.title !== this.state.title) {
          this.props.setTitle(this.state.title);
      }
    }
  
    handleClickShowItem(id){
        this.props.history.push(`/expertise/list/${this.props.match.params.type}/${id}`);
    }

    handleCloseDialog = () => {
        this.props.history.push(`/expertise/list/${this.props.match.params.type}`);
        this.props.setTitle(this.state.title);
    };
    
    render() {
      const { classes } = this.props;
      const type = this.props.match.params.type;
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
      
      /*
      if (columns.length > 0) {
        const statusColumn = columns.find((column) => column.field === 'status');
        const statusColIndex = columns.findIndex((col) => col.field === 'status');

        const newStatusColumn = {
          ...statusColumn,
          filterOperators: [inOperator(this.props.statuses), notInOperator(this.props.statuses)],
        };

        columns[statusColIndex] = newStatusColumn;
        columns = Array.from(columns);
      }
      */
      let columns = createColumns(this.props.statuses, this.handleClickShowItem, type);
      
      return (
          <div>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <MekFilter msgType={type} />
                    <MekList 
                        rowsPerPageOptions={[10, 15, 20, 50, 100]}
                        pageSize={this.props.perPage}
                        items = {this.props.items}
                        columns = {columns}
                        statuses = {this.props.statuses}
                        loading = {this.props.loading}
                        
                        
                        page={this.props.page}
                           backIconButtonProps={{
                             'aria-label': 'Previous Page',
                           }}
                           nextIconButtonProps={{
                             'aria-label': 'Next Page',
                           }}
                           
                           //onChangePage={this.props.handleChangePage}
                           //onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                     />
                  </Paper>
                </Grid>
              </Grid>
            </Container>
            <FullScreenDialog title={this.state.msgTitle} open={this.state.openMessageDialog} onClose={this.handleCloseDialog}>
                <MekShowMessage setTitle={this.props.setTitle}/>
            </FullScreenDialog>
          </div>
      );
    }
}

const mapStateToProps = function(store, ownProps) {
  const type = ownProps.match.params.type;
  let c = null;
  if (type === 'mek') {
      c = store.expertiseReducer.incoming;
  }
  if (type === 'mee') {
      c = store.expertiseReducer.mee;
  }
  return {
      items: c.items, 
      loading: c.loading,
      statuses: store.messageStatusReducer.items, 
    };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchMessageStatuses: () => {
        dispatch(messageStatusFetch(0, -1));
    },
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(MekInMessage)));
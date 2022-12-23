import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import { PrivateRoute } from '../_components';

import Dashboard  from '../dashboard/Dashboard.js'
import MyFiles    from  '../components/UploadFile/MyFiles.js'
import BillsNewMessage  from  '../components/Bills/BillsNewMessage.js'
import BillsShowMessage from  '../components/Bills/BillsShowMessage.js'
import BillsInRejected  from  '../components/Bills/BillsInRejected.js' 
import ReconciliationActNewMessage from  '../components/Bills/ReconciliationActNewMessage.js' 
import ReconciliationActMessage from  '../components/Bills/ReconciliationActMessage.js' 
import BillsIn from  '../components/Bills/BillsIn.js' 
import ReconciliationActIn from  '../components/Bills/ReconciliationActIn.js' 

class Routes extends React.Component {

    render(){

      let path = this.props.match.path;
      return (
            <Switch>
              <Route exact path={`${path}`} >
                <Redirect to={`${path}/list/bill`} />
              </Route>
              <PrivateRoute path={`${path}upload-file`} component={MyFiles} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/bill/new`} component={BillsNewMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:type/new`} component={ReconciliationActNewMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/reconciliation-act`}  component={ReconciliationActMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/in/rejected`}  component={BillsInRejected}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              
              <PrivateRoute path={`${path}/msg/:id`}  component={BillsShowMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/bill/:id`} component={BillsIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/bill`} component={BillsIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/reconciliation-act/:id`} component={ReconciliationActIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/reconciliation-act`} component={ReconciliationActIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              
              <PrivateRoute component={Dashboard} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
            </Switch>
      );
    }
}

export default withRouter(Routes);

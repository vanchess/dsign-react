import React from 'react';
import { Switch, withRouter } from 'react-router-dom';


import { PrivateRoute } from '../_components';


import Dashboard  from '../dashboard/Dashboard.js'
import MedicalInstitution from  '../components/MedicalInstitution/MedicalInstitution.js'
import MyFiles    from  '../components/UploadFile/MyFiles.js'
import NewMessage  from  '../components/Message/NewMessage.js'
import ShowMessage from  '../components/Message/ShowMessage.js'
import InMessage   from  '../components/Message/InMessage.js'
import OutMessage  from  '../components/Message/OutMessage.js'

class Routes extends React.Component {

    render(){

      let path = this.props.match.path;
      return (
            <Switch>
              <PrivateRoute exact path={`${path}`} component={InMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}upload-file`} component={MyFiles} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/new`} component={NewMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/out`} component={OutMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/in`}  component={InMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:id`}  component={ShowMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/medical-institution`} component={MedicalInstitution} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute component={Dashboard} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
            </Switch>
      );
    }
}

export default withRouter(Routes);

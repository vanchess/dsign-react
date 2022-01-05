import React from 'react';
import { Switch, withRouter } from 'react-router-dom';


import { PrivateRoute } from '../_components';


import Dashboard  from '../dashboard/Dashboard.js'
import MedicalInstitution from  '../components/MedicalInstitution/MedicalInstitution.js'
import MyFiles    from  '../components/UploadFile/MyFiles.js'
import MekNewMessage  from  '../components/Expertise/MekNewMessage.js'
import MekShowMessage from  '../components/Expertise/MekShowMessage.js'
import MekInMessage   from  '../components/Expertise/MekInMessage.js'
import MekOutMessage  from  '../components/Expertise/MekOutMessage.js'
import MeeInMessage   from  '../components/Expertise/MeeInMessage.js'

class Routes extends React.Component {

    render(){

      let path = this.props.match.path;
      return (
            <Switch>
              <PrivateRoute exact path={`${path}`} component={MekInMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:type/new`} component={MekNewMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:type/:id`} component={MekShowMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/mee`} component={MeeInMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/mek`} component={MekInMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute component={Dashboard} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
            </Switch>
      );
    }
}

export default withRouter(Routes);

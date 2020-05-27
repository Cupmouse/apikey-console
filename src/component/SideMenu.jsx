import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default class SideMenu extends React.Component {
  render() {
    return (
      <Menu fluid vertical tabular>
        <Menu.Item as={NavLink}
          to="/dashboard"
          name="dashboard"
          activeClassName="active"
        />
        <Menu.Item as={NavLink}
          to="/apikeys"
          name="apikey"
          content="API-Key"
          activeClassName="active"
        />
      </Menu>
    );
  }
}

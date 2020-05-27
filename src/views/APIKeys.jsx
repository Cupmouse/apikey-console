import React, { Component } from 'react';
import {
  Header, Loader, Message, Table, Dimmer, Button, Breadcrumb,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import APIKeyEnableCheckbox from '../component/APIKeyEnableCheckbox';
import DeleteAPIKeyButton from '../component/DeleteAPIKeyButton';
import { postCustomerAPIKeys, postCreateAPIKey } from '../ajax';
import RedirectToLogin from '../component/RedirectToLogin';
import { API_ERR_NOT_LOGGED_IN } from '../constants';
import { getCustomerKey } from '../util';

export default class Customer extends Component {
  state = {
    apikeyLoading: true,
    apikeyCreating: false,
    messageType: null,
    message: null,
    apikeys: [],
    sureNotLoggedIn: false,
  };

  loadAPIKeys = async () => {
    const customerKey = getCustomerKey();
    if (customerKey === null) {
      return;
    }

    this.setState({
      apikeyLoading: true,
    });

    try {
      const apikeys = await postCustomerAPIKeys(customerKey);
      this.setState({
        apikeys,
        apikeyLoading: false,
      });
    } catch (e) {
      if (e.message === API_ERR_NOT_LOGGED_IN) {
        this.setState({
          sureNotLoggedIn: true,
        });
      } else {
        this.setState({
          messageType: 'error',
          message: e.toString(),
          apikeyLoading: false,
        });
      }
    }
  }

  componentDidMount = async () => await this.loadAPIKeys();

  createNewAPIKey = async() => {
    const customerKey = getCustomerKey();
    if (customerKey === null) {
      return;
    }

    this.setState({
      apikeyCreating: true,
    });

    try {
      const { key } = await postCreateAPIKey(customerKey);
      this.setState({
        messageType: 'success',
        message: `New API-Key created: ${key}`,
        apikeyCreating: false,
      });
      this.loadAPIKeys();
    } catch (e) {
      if (e.message === API_ERR_NOT_LOGGED_IN) {
        this.setState({
          sureNotLoggedIn: true,
          apikeyCreating: false,
        });
      } else {
        this.setState({
          messageType: 'error',
          message: e.toString(),
          apikeyCreating: false,
        });
      }
    }
  }

  render() {
    const {
      apikeyLoading,
      apikeyCreating,
      messageType,
      message,
      apikeys,
      sureNotLoggedIn,
    } = this.state;

    return (
      <div>
        <Breadcrumb size="large">
          <Breadcrumb.Section as={Link} to="/dashboard" link content="Dashboard" />
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section active content="API-Keys" />
        </Breadcrumb>
        <Header size="medium" content="List of Your API-Keys" />
        {
          message !== null ? (
            <Message
              positive={messageType === 'success'}
              negative={messageType === 'error'}
              content={message}
            />
          ) : ''
        }
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content="API-Key" />
              <Table.HeaderCell content="Enabled" />
              <Table.HeaderCell content="Delete" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              apikeys.map((row) => (
                <Table.Row key={row.apikey}>
                  <Table.Cell><Link to={`/apikey/${row.apikey}`}>{row.apikey}</Link></Table.Cell>
                  <Table.Cell collapsing positive={row.enabled}>
                    <APIKeyEnableCheckbox apikey={row.apikey} enabled={row.enabled} />
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <DeleteAPIKeyButton apikey={row.apikey} onDeletionComplete={this.loadAPIKeys} />
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>
                <Button
                  primary
                  icon="add"
                  content="Create new API-key (Up to 10 api-keys)"
                  loading={apikeyCreating}
                  disabled={apikeys.length > 10}
                  onClick={this.createNewAPIKey}
                />
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
        <Dimmer active={apikeyLoading}>
          <Loader />
        </Dimmer>
        <RedirectToLogin reportNotLoggedIn={sureNotLoggedIn} />
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Header, Breadcrumb, Table, Popup, Icon, Progress, Dimmer, Loader, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import RedirectToLogin from '../component/RedirectToLogin';
import CreateQuota from '../component/CreateTicket';
import DeleteTicketButton from '../component/DeleteTicketButton';
import { postTickets } from '../ajax';
import { humanReadableBytes } from '../util';
import { API_ERR_NOT_LOGGED_IN } from '../constants';

const humanReadableWithPopup = (bytes) => (
  <Popup content={`${bytes} bytes`} trigger={<span style={{ borderBottom: '1px dotted' }}>{humanReadableBytes(bytes)}</span>} />
);

class APIKeyTickets extends Component {
  state = {
    loading: true,
    quotas: [],
    error: null,
    listReload: 0,
    sureNotLoggedIn: false,
  };

  componentDidUpdate = async (props) => {
    const { reload: newReload } = this.props;
    if (props.reload === newReload) {
      return;
    }
    await this.loadQuotas();
  }

  getTable = () => {
    const { match } = this.props;
    const { apikey } = match.params;
    const { quotas } = this.state;
    return quotas.map((row) => {
      const ticketKey = BigNumber(row.ticketKey);
      const quota = BigNumber(row.quota);
      const used = BigNumber(row.used);
      const left = quota.minus(used);
      const leftPercent = left.times(1000).dividedToIntegerBy(quota).toNumber() / 10;
      return [(
        <Table.Row key={`${row.startDate}-${row.endDate}-0`}>
          <Table.Cell rowSpan={2}>
            {row.startDate}
            <Icon name="arrow circle right" />
            {row.endDate}
          </Table.Cell>
          <Table.Cell>{humanReadableWithPopup(quota)}</Table.Cell>
          <Table.Cell>{humanReadableWithPopup(used)}</Table.Cell>
          <Table.Cell>{humanReadableWithPopup(left)}</Table.Cell>
          <Table.Cell rowSpan={2}>
            <DeleteTicketButton
              apikey={apikey}
              ticketKey={ticketKey}
              startDate={row.startDate}
              endDate={row.endDate}
              onDeletionComplete={this.loadQuotas}
            />
          </Table.Cell>
        </Table.Row>
      ), (
        <Table.Row key={`${row.startDate}-${row.endDate}--1`}>
          <Table.Cell colSpan={3}>
            <Progress
              percent={leftPercent}
              error={leftPercent <= 5}
              warning={leftPercent > 5 && leftPercent <= 30}
              success={leftPercent > 30}
              progress="percent"
            />
          </Table.Cell>
        </Table.Row>
      )];
    }).flat(1);
  }

  loadTickets = async () => {
    const { match } = this.props;
    const { apikey } = match.params;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      loading: true,
    });
    try {
      const res = await postTickets(apikey);
      this.setState({
        quotas: res,
        loading: false,
      });
    } catch (e) {
      if (e.message === API_ERR_NOT_LOGGED_IN) {
        this.setState({
          sureNotLoggedIn: true,
        });
      } else {
        this.setState({
          error: e.toString(),
          loading: false,
        });
      }
    }
  }

  componentDidMount = async () => await this.loadTickets();

  render() {
    const { match } = this.props;
    const { apikey } = match.params;
    const { loading, error, sureNotLoggedIn } = this.state;

    return (
      <div>
        <Breadcrumb size="large">
          <Breadcrumb.Section as={Link} to="/dashboard" link content="Dashboard" />
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section as={Link} to="/apikeys" link content="API-Keys" />
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section active content="Tickets" />
        </Breadcrumb>
        <Header size="medium" content={`Tickets for API-key ${apikey}`} />
        <Header size="medium">
          Create a new ticket
        </Header>
        {
          error !== null ? (
            <Message negative>
              <Message.Header>Error occurred</Message.Header>
              {error}
            </Message>
          ) : ''
        }
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan={2}>Period</Table.HeaderCell>
              <Table.HeaderCell colSpan={3}>Quota</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2} collapsing>Delete</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Limit</Table.HeaderCell>
              <Table.HeaderCell>Used</Table.HeaderCell>
              <Table.HeaderCell>Left</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.getTable()}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>
                <CreateQuota
                  apikey={apikey}
                  onChange={() => {
                    this.setState({ listReload: Math.random() });
                  }}
                />
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <RedirectToLogin reportNotLoggedIn={sureNotLoggedIn} />
      </div>
    );
  }
}

APIKeyTickets.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      apikey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default APIKeyTickets;

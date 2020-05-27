import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

import AttentionModal from './AttentionModal';
import { postRemoveTicket } from '../ajax';

class DeleteTicketButton extends Component {
    state = {
      deleting: false,
      modalOpen: false,
      error: null,
    };

  deleteTicket = async () => {
    const { apikey, ticketKey, onDeletionComplete } = this.props;
    this.setState({ deleting: true });
    try {
      await postRemoveTicket(apikey, ticketKey);
      this.setState({
        modalOpen: false,
        deleting: false,
      });
      onDeletionComplete();
    } catch (e) {
      this.setState({
        error: e.toString(),
        deleting: false,
      });
    }
  }

  render() {
    const {
      apikey,
      ticketKey,
      startDate,
      endDate,
    } = this.props;
    const { deleting, modalOpen, error } = this.state;
    return (
      <div>
        <Button
          basic
          negative
          icon="close"
          content="DELETE"
          onClick={() => this.setState({ modalOpen: true })}
        />
        <AttentionModal
          open={modalOpen}
          waiting={deleting}
          error={error}
          onCancel={() => this.setState({ modalOpen: false })}
          onOK={this.deleteTicket}
        >
          <p>You are tring to delete the ticket:</p>
          <p>
            Ticket-key:
            {' '}
            {ticketKey.toString()}
          </p>
          <p>
            API-key:
            {' '}
            {apikey}
          </p>
          <p>
            {startDate.toString()}
            {' '}
            to
            {' '}
            {endDate.toString()}
          </p>
          <p>Are you sure you want to delete this ticket?</p>
          <p>Remaining quota on this ticket will be discarded and cannot be refunded.</p>
          <p>This action cannot be undone.</p>
        </AttentionModal>
      </div>
    );
  }
}

DeleteTicketButton.propTypes = {
  apikey: PropTypes.string.isRequired,
  ticketKey: PropTypes.instanceOf(BigNumber).isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onDeletionComplete: PropTypes.func,
};

DeleteTicketButton.defaultProps = {
  onDeletionComplete: () => {},
};

export default DeleteTicketButton;

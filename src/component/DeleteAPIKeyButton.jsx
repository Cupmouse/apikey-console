import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AttentionModal from './AttentionModal';
import { postRemoveAPIKey } from '../ajax';

class DeleteAPIKeyButton extends Component {
  state = {
    deleting: false,
    modalOpen: false,
    error: null,
  };

  deleteAPIKey = async () => {
    const { apikey, onDeletionComplete } = this.props;
    this.setState({ deleting: true });
    try {
      await postRemoveAPIKey(apikey);
      this.setState({
        modalOpen: false,
        deleting: false
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
    const { apikey } = this.props;
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
          onOK={this.deleteAPIKey}
        >
          <p>You are tring to delete a API-key shown below:</p>
          <p>{apikey}</p>
          <p>Are you sure you want to delete this API-key?</p>
          <p>ALL tickets associated with this API-key will not be able to access afterwards.</p>
          <p>No refunds.</p>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>This is permanent and cannot be undone.</p>
        </AttentionModal>
      </div>
    );
  }
}

DeleteAPIKeyButton.propTypes = {
  apikey: PropTypes.string.isRequired,
  onDeletionComplete: PropTypes.func,
};

DeleteAPIKeyButton.defaultProps = {
  onDeletionComplete: () => {},
};

export default DeleteAPIKeyButton;

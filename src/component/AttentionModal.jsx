import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Button, Icon, Message,
} from 'semantic-ui-react';

function AttentionModal(props) {
  const {
    onCancel, onOK, waiting, error, children, open,
  } = props;

  return (
    <Modal size="small" open={open}>
      <Modal.Header>
        <Icon name="warning circle" />
        Attention
      </Modal.Header>
      <Modal.Content>
        {children}
        {
            error !== null ? (
              <Message negative>
                {error}
              </Message>
            ) : ''
          }
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          disabled={waiting}
          content="Cancel"
          onClick={onCancel}
        />
        <Button
          negative
          disabled={waiting}
          loading={waiting}
          icon="close"
          labelPosition="right"
          content="OK"
          onClick={onOK}
        />
      </Modal.Actions>
    </Modal>
  );
}

AttentionModal.propTypes = {
  children: PropTypes.node.isRequired,
  // set this true to open modal
  open: PropTypes.bool,
  // set this true to disable buttons and show loading icon on OK button
  waiting: PropTypes.bool,
  // set error message to this to show it in modal message
  error: PropTypes.string,
  onCancel: PropTypes.func,
  // called when OK button was pressed, usually you want to do some destructive stuff
  onOK: PropTypes.func,
};

AttentionModal.defaultProps = {
  open: false,
  waiting: false,
  error: null,
  onCancel: () => {},
  onOK: () => {},
};

export default AttentionModal;

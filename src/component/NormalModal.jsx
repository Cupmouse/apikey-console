import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Button, Message,
} from 'semantic-ui-react';

function NormalModal(props) {
  const {
    title,
    onCancel,
    onOK,
    okButtonContent,
    cancelButtonContent,
    buttonLoading,
    error,
    children,
    open,
  } = props;

  return (
    <Modal size="small" open={open}>
      <Modal.Header content={title} />
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
          disabled={buttonLoading}
          content={okButtonContent}
          loading={buttonLoading}
          onClick={onOK}
        />
        <Button
          disabled={buttonLoading}
          content={cancelButtonContent}
          onClick={onCancel}
        />
      </Modal.Actions>
    </Modal>
  );
}

NormalModal.propTypes = {
  children: PropTypes.node.isRequired,
  // set this true to open modal
  open: PropTypes.bool,
  title: PropTypes.node.isRequired,
  okButtonContent: PropTypes.string,
  cancelButtonContent: PropTypes.string,
  // set this true to disable buttons and show loading icon on OK button
  buttonLoading: PropTypes.bool,
  // set error message to this to show it in modal message
  error: PropTypes.string,
  onCancel: PropTypes.func,
  // called when OK button was pressed, usually you want to do some destructive stuff
  onOK: PropTypes.func,
};

NormalModal.defaultProps = {
  open: false,
  buttonLoading: false,
  error: null,
  okButtonContent: 'OK',
  cancelButtonContent: 'Cancel',
  onCancel: () => {},
  onOK: () => {},
};

export default NormalModal;

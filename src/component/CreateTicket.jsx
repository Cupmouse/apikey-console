import React, { Component } from 'react';
import {
  Button, Message, Input,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

import { postPrepareTicket } from '../ajax';
import NormalModal from './NormalModal';
import BigNumber from 'bignumber.js';
import { calcPrice } from '../constants';


class PaymentModal extends React.Component {
  state = {
    preparing: false,
    error: null,
  }

  createTicket = async () => {
    const {
      apikey,
      stripe,
      elements,
      quota,
      onPaymentComplete,
    } = this.props;
    
    this.setState({
      preparing: true,
    });

    try {
      const { clientSecret } = await postPrepareTicket(apikey, quota);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });
  
      if (result.error) {
        throw new Error(`error during payment processing: ${result.error.message}`)
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onPaymentComplete();
        }
        this.setState({
          error: null,
          preparing: false,
        })
      }
    } catch (e) {
      this.setState({
        error: e.message,
        preparing: false,
      });
    }
  }

  render() {
    const { stripe, elements } = this.props;
    if (stripe === null) {
      return "";
    }
    const { modalOpened, onCancel, quota } = this.props;
    const { preparing, error } = this.state;
    return (
      <NormalModal
        title="Purchasing A New Ticket"
        error={error}
        open={modalOpened}
        okButtonContent="Confirm Payment"
        onOK={this.createTicket}
        onCancel={onCancel}
        buttonLoading={preparing}
      >
        <p>You are purchasing a new ticket of {quota.toString()}GB.</p>
        <p>We are charging you:</p>
        <p>${calcPrice(quota).toString()}</p>
        <p>Ticket will expire in 30 days.</p>
        <p>To continue, enter your credit card information below.</p>
        <CardElement stripe={stripe} elements={elements} />
      </NormalModal>
    );
  }
}

PaymentModal.propTypes = {
  apikey: PropTypes.string.isRequired,
  modalOpened: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  stripe: PropTypes.object,
  elements: PropTypes.object,
  quota: PropTypes.instanceOf(BigNumber).isRequired,
  onPaymentComplete: PropTypes.func,
}

PaymentModal.defaultProps = {
  stripe: null,
  elements: null,
}

class CreateQuota extends Component {
  state = {
    creating: false,
    quota: '',
    messageType: null,
    message: null,
    paymentError: null,
    modalOpened: false,
  };

  handleChange = (event, { value }) => {
    this.setState({ quota: value });
  }

  handleClick = () => {
    const { quota } = this.state;
    if (/^[1-9][0-9]*$/.test(quota)) {
      this.setState({ message: null, modalOpened: true });
    } else {
      this.setState({ messageType: 'error', message: 'Please enter quota in integer' });
    }
  }

  handlePaymentComplete = () => {
    this.setState({
      buttonLoading: false,
      modalOpened: false,
      messageType: 'success',
      message: 'Payment Successful! Tickets will not be added until we can successfully capture the payment.'
    })
  }

  render() {
    const { apikey } = this.props;
    const {
      messageType,
      message,
      modalOpened,
      quota: quotaStr,
    } = this.state;

    const quota = BigNumber(quotaStr);

    return (
      <div>
        {
          message !== null ? (
            <Message negative={messageType === 'error'} positive={messageType === 'success'}>
              {message}
            </Message>
          ) : ''
        }
        <Input
          name="quota"
          label="GB"
          labelPosition="right"
          placeholder="Enter desired quota"
          onChange={this.handleChange}
        />
        <Button
          icon
          primary
          disabled={modalOpened}
          content="Create A New Ticket"
          onClick={this.handleClick}
        />
        <ElementsConsumer>
          {({stripe, elements}) => (
            <PaymentModal
              apikey={apikey}
              stripe={stripe}
              elements={elements}
              modalOpened={modalOpened}
              onCancel={() => this.setState({ modalOpened: false })}
              quota={quota}
              onPaymentComplete={this.handlePaymentComplete}
            />
          )}
        </ElementsConsumer>
      </div>
    );
  }
}

CreateQuota.propTypes = {
  apikey: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

CreateQuota.defaultProps = {
  onChange: () => {},
};

export default CreateQuota;

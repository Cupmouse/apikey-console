import React from 'react';
import { Form, Segment, Header, Message } from 'semantic-ui-react';
import { Component } from 'react';
import { postLogin } from '../ajax';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    error: null,
    redirect: false,
    loading: false,
  }

  onSubmit = async () => {
    const { email, password } = this.state;
    this.setState({
      loading: true,
    });

    try {
      const res = await postLogin(email, password);
    
      localStorage.setItem("customerKey", res.customerKey);

      this.setState({
        redirect: true,
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: e.message,
        loading: false,
      });
    }
  };

  handleChange = (event, target) => {
    this.setState({
      [target.name]: target.value,
    })
  };

  render() {
    const {
      email,
      password,
      loading,
      redirect,
      error,
    } = this.state;
    return (
      <Segment>
        <Header
          size="huge"
          textAlign="center"
          content="API-Key Console"
        />
        {
          error !== null ?
            <Message negative content={error} />
          : ""
        }
        <Form>
          <Form.Input
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={this.handleChange}
          />
          <Form.Input
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={this.handleChange}
          />
          <Form.Button
            primary
            icon="user"
            content="Login"
            disabled={loading}
            loading={loading}
            onClick={this.onSubmit}
          />
        </Form>
        {
          redirect ?
            <Redirect to="/dashboard" />
          : ""
        }
      </Segment>
    );
  }
}

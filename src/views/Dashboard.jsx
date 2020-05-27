import React from 'react';
import { Card } from 'semantic-ui-react';

class Dashboard extends React.Component {
  render() {
    return (
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>Quota Left</Card.Header>

          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>API-Keys</Card.Header>

          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}

export default Dashboard;

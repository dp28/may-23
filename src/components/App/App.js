import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

import './App.css';

export const App = () => (
  <div className="App">
    <Grid>
      <Row>
        <Col xs={12}>
          Test
        </Col>
      </Row>
    </Grid>
  </div>
);

export const ConnectedApp = connect()(App);

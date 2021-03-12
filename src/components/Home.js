import React, { Component } from 'react';

class Home extends Component {

  render() {
    return (
      <div>
        Thanks for logging in {this.props.userId}
      </div>
    );
  }
}

export default Home;
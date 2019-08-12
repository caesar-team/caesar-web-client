import React, { Component } from 'react';

class HoldClickBehaviour extends Component {
  timer = null;

  handleButtonPress = () => {
    const { delay = 250, onHoldStart } = this.props;

    this.timer = setTimeout(onHoldStart, delay);
  };

  handleButtonRelease = () => {
    const { onHoldEnd } = this.props;

    clearTimeout(this.timer);

    onHoldEnd();
  };

  render() {
    const { onHoldStart, onHoldEnd, ...props } = this.props;

    return (
      <div
        {...props}
        role="presentation"
        onTouchStart={this.handleButtonPress}
        onTouchEnd={this.handleButtonRelease}
        onMouseDown={this.handleButtonPress}
        onMouseUp={this.handleButtonRelease}
        onMouseLeave={this.handleButtonRelease}
      />
    );
  }
}

export default HoldClickBehaviour;

import React, { Component } from 'react';

class LongClickBehaviour extends Component {
  timer = null;

  handleButtonPress = () => {
    const { delay = 250, onLongClickStart } = this.props;

    this.timer = setTimeout(onLongClickStart, delay);
  };

  handleButtonRelease = () => {
    const { onLongClickEnd } = this.props;

    clearTimeout(this.timer);

    onLongClickEnd();
  };

  render() {
    const { onLongClickStart, onLongClickEnd, ...props } = this.props;

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

export default LongClickBehaviour;

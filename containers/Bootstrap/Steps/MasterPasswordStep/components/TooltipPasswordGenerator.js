import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import { PasswordGenerator, Tooltip } from 'components';

class TooltipPasswordGenerator extends Component {
  handleClickOutside() {
    this.props.onToggleVisibility();
  }

  render() {
    const { isVisible, onGeneratePassword } = this.props;

    return (
      <Tooltip
        show={isVisible}
        arrowAlign="center"
        position="bottom center"
        textBoxWidth="300px"
        padding="0px 30px 10px 30px"
      >
        <PasswordGenerator onGeneratePassword={onGeneratePassword} />
      </Tooltip>
    );
  }
}

export default enhanceWithClickOutside(TooltipPasswordGenerator);

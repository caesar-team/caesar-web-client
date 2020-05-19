import React, { Component } from 'react';
// TODO: Replace with import {useClickAway} from 'react-use';
import enhanceWithClickOutside from 'react-click-outside';
import { PasswordGenerator, Tooltip } from '@caesar/components';
import { generator } from '@caesar/common/utils/password';

const DEFAULT_LENGTH = 16;

class TooltipPasswordGenerator extends Component {
  state = this.prepareInitialState();

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      this.onGeneratePasswordCallback();
    }
  }

  // eslint-disable-next-line
  handleClickOutside() {
    const { onToggleVisibility = Function.prototype } = this.props;

    onToggleVisibility();
  }

  getLengthValue(event) {
    return event.target.value.toValue;
  }

  getOptionValue(optionType) {
    const { [optionType]: value } = this.state;

    return !value;
  }

  onGeneratePasswordCallback = () => {
    const { onGeneratePassword } = this.props;
    const { length, digits, specials } = this.state;

    onGeneratePassword(generator(length, { digits, specials }));
  };

  handleChangeOption = optionType => event => {
    const value =
      optionType === 'length'
        ? this.getLengthValue(event)
        : this.getOptionValue(optionType);

    this.setState(
      {
        [optionType]: value,
      },
      this.onGeneratePasswordCallback,
    );
  };

  prepareInitialState() {
    return {
      length: DEFAULT_LENGTH,
      digits: true,
      specials: true,
    };
  }

  render() {
    const { length, digits, specials } = this.state;
    const { isVisible } = this.props;

    return (
      <Tooltip
        show={isVisible}
        arrowAlign="top"
        position="right center"
        textBoxWidth="300px"
      >
        <PasswordGenerator
          length={length}
          digits={digits}
          specials={specials}
          onChangeOption={this.handleChangeOption}
        />
      </Tooltip>
    );
  }
}

export default enhanceWithClickOutside(TooltipPasswordGenerator);

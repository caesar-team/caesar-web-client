import React, { PureComponent, createContext } from 'react';
import { connect } from 'react-redux';
import { createAbility } from '@caesar/common/ability';
import { caslUserDataSelector } from '@caesar/common/selectors/user';
import { createStructuredSelector } from 'reselect';

const Context = createContext({});
const { Provider, Consumer } = Context;

class AbilityProvider extends PureComponent {
  render() {
    const { userData, children } = this.props;

    const ability = createAbility(userData);

    return <Provider value={ability}>{children}</Provider>;
  }
}

const mapStateToProps = createStructuredSelector({
  userData: caslUserDataSelector,
});

export const AbilityContext = Context;
export const AbilityConsumer = Consumer;

export default connect(
  mapStateToProps,
  null,
)(AbilityProvider);

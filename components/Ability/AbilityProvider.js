import React, { PureComponent, createContext } from 'react';
import { connect } from 'react-redux';
import { createAbility } from 'common/ability';
import { caslUserDataSelector } from 'common/selectors/user';
import { createStructuredSelector } from 'reselect';

const Context = createContext({});
const { Provider, Consumer } = Context;

class AbilityProvider extends PureComponent {
  render() {
    const { userData, children } = this.props;

    const ability = createAbility(userData);

    console.log('ability rules', ability.rules);

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

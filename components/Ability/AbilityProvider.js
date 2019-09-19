import React, { PureComponent, createContext } from 'react';
import { connect } from 'react-redux';
import { createAbility } from 'common/ability';
import { userDataSelector } from 'common/selectors/user';
import { createStructuredSelector } from 'reselect';

const { Consumer, Provider } = createContext({});

class AbilityProvider extends PureComponent {
  render() {
    const { userData, children } = this.props;

    const ability = createAbility(userData);

    return <Provider value={ability}>{children}</Provider>;
  }
}

const mapStateToProps = createStructuredSelector({
  userData: userDataSelector,
});

export const AbilityConsumer = Consumer;

export default connect(
  mapStateToProps,
  null,
)(AbilityProvider);

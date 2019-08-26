import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setMasterPassword } from 'common/actions/user';
import { resetStore } from 'common/actions/workflow';
import { masterPasswordSelector } from 'common/selectors/user';
import Bootstrap from './Bootstrap';

const mapStateToProps = createStructuredSelector({
  masterPassword: masterPasswordSelector,
});

const mapDispatchToProps = {
  setMasterPassword,
  resetStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bootstrap);

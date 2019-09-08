import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setMasterPassword } from 'common/actions/user';
import { resetWorkflowStore } from 'common/actions/workflow';
import { removeItemsData } from 'common/actions/entities/item';
import { masterPasswordSelector } from 'common/selectors/user';
import Bootstrap from './Bootstrap';

const mapStateToProps = createStructuredSelector({
  masterPassword: masterPasswordSelector,
});

const mapDispatchToProps = {
  setMasterPassword,
  resetWorkflowStore,
  removeItemsData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bootstrap);

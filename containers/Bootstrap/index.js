import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setMasterPassword } from 'common/actions/user';
import { resetWorkflowStore } from 'common/actions/workflow';
import { initCoresCount } from 'common/actions/application';
import { removeItemsData } from 'common/actions/entities/item';
import { masterPasswordSelector } from 'common/selectors/user';
import { isLoadingGlobalNotificationSelector } from 'common/selectors/application';
import Bootstrap from './Bootstrap';

const mapStateToProps = createStructuredSelector({
  masterPassword: masterPasswordSelector,
  isLoadingGlobalNotification: isLoadingGlobalNotificationSelector,
});

const mapDispatchToProps = {
  setMasterPassword,
  resetWorkflowStore,
  removeItemsData,
  initCoresCount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bootstrap);

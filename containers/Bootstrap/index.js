import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setMasterPassword } from 'common/actions/user';
import { resetWorkflowStore } from 'common/actions/workflow';
import {
  initCoresCount,
  updateGlobalNotification,
} from 'common/actions/application';
import { removeItemsData } from 'common/actions/entities/item';
import { masterPasswordSelector } from 'common/selectors/user';
import {
  isLoadingGlobalNotificationSelector,
  isErrorGlobalNotificationSelector,
  globalNotificationTextSelector,
} from 'common/selectors/application';
import Bootstrap from './Bootstrap';

const mapStateToProps = createStructuredSelector({
  masterPassword: masterPasswordSelector,
  isLoadingGlobalNotification: isLoadingGlobalNotificationSelector,
  isErrorGlobalNotification: isErrorGlobalNotificationSelector,
  globalNotificationText: globalNotificationTextSelector,
});

const mapDispatchToProps = {
  setMasterPassword,
  resetWorkflowStore,
  removeItemsData,
  initCoresCount,
  updateGlobalNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bootstrap);

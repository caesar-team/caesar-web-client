import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setMasterPassword, setKeyPair } from '@caesar/common/actions/user';
import { resetWorkflowStore } from '@caesar/common/actions/workflow';
import {
  initCoresCount,
  updateGlobalNotification,
} from '@caesar/common/actions/application';
import { removeItemsData } from '@caesar/common/actions/entities/item';
import { masterPasswordSelector } from '@caesar/common/selectors/user';
import {
  isLoadingGlobalNotificationSelector,
  isErrorGlobalNotificationSelector,
  globalNotificationTextSelector,
} from '@caesar/common/selectors/application';
import Bootstrap from './Bootstrap';

const mapStateToProps = createStructuredSelector({
  masterPassword: masterPasswordSelector,
  isLoadingGlobalNotification: isLoadingGlobalNotificationSelector,
  isErrorGlobalNotification: isErrorGlobalNotificationSelector,
  globalNotificationText: globalNotificationTextSelector,
});

const mapDispatchToProps = {
  setMasterPassword,
  setKeyPair,
  resetWorkflowStore,
  removeItemsData,
  initCoresCount,
  updateGlobalNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bootstrap);

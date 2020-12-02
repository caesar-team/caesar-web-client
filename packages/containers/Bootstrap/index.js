import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  setMasterPassword,
  fetchUserSelfSuccess,
  logout,
} from '@caesar/common/actions/currentUser';
import { addPersonalKeyPair as setKeyPair } from '@caesar/common/actions/keystore';
import { resetWorkflowState } from '@caesar/common/actions/workflow';
import {
  initCoresCount,
  updateGlobalNotification,
} from '@caesar/common/actions/application';
import { removeItemsData } from '@caesar/common/actions/entities/item';
import { masterPasswordSelector } from '@caesar/common/selectors/currentUser';
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
  fetchUserSelfSuccess,
  setMasterPassword,
  setKeyPair,
  resetWorkflowState,
  removeItemsData,
  initCoresCount,
  updateGlobalNotification,
  logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bootstrap);

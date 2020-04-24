import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ManageListContainer } from '@caesar/containers';
import {
  FullScreenLoader,
  Head,
  SettingsLayout,
  SettingsSidebar,
} from '@caesar/components';
import {
  currentTeamSelector,
  userDataSelector,
} from '@caesar/common/selectors/user';
import {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
} from '@caesar/common/actions/user';

class SettingsManageListPage extends Component {
  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchUserTeamsRequest();
  }

  render() {
    const { userData, currentTeam } = this.props;

    const shouldShowLoader = !userData;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <Fragment>
        <Head title="Lists" />
        <SettingsLayout user={userData} team={currentTeam}>
          <Fragment>
            <SettingsSidebar />
            <ManageListContainer />
          </Fragment>
        </SettingsLayout>
      </Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  userData: userDataSelector,
  currentTeam: currentTeamSelector,
});

const mapDispatchToProps = {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsManageListPage);

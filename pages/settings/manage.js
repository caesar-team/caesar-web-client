import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ManageListContainer } from 'containers';
import {
  FullScreenLoader,
  Head,
  SettingsLayout,
  SettingsSidebar,
} from 'components';
import { currentTeamSelector, userDataSelector } from 'common/selectors/user';
import {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
} from 'common/actions/user';

class SettingsManageListPage extends Component {
  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchUserTeamsRequest();
  }

  render() {
    const { userData, currentTeam } = this.props;

    const shouldShowLoader = !userData || !currentTeam;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <Fragment>
        <Head title="Manage List" />
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

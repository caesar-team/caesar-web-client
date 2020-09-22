import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TeamListContainer } from '@caesar/containers';
import {
  Head,
  SettingsLayout,
  SettingsSidebar,
  FullScreenLoader,
} from '@caesar/components';
import {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
} from '@caesar/common/actions/user';
import { userDataSelector } from '@caesar/common/selectors/user';

class SettingsTeamsPage extends Component {
  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchUserTeamsRequest();
  }

  render() {
    const { userData } = this.props;

    const shouldShowLoader = !userData;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <>
        <Head title="Teams" />
        <SettingsLayout user={userData}>
          <>
            <SettingsSidebar />
            <TeamListContainer />
          </>
        </SettingsLayout>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  userData: userDataSelector,
});

const mapDispatchToProps = {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsTeamsPage);

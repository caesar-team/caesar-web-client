import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TeamContainer } from '@caesar/containers';
import {
  Head,
  SettingsLayout,
  SettingsSidebar,
  FullScreenLoader,
} from '@caesar/components';
import { userDataSelector } from '@caesar/common/selectors/user';
import { initTeamSettings } from '@caesar/common/actions/workflow';

class SettingsTeamPage extends Component {
  componentDidMount() {
    this.props.initTeamSettings();
  }

  render() {
    const { userData } = this.props;

    const shouldShowLoader = !userData;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <>
        <Head title="Team" />
        <SettingsLayout user={userData}>
          <>
            <SettingsSidebar />
            <TeamContainer />
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
  initTeamSettings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsTeamPage);

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
import { userDataSelector } from '@caesar/common/selectors/user';
import { initTeamsSettings } from '@caesar/common/actions/workflow';

class SettingsTeamsPage extends Component {
  componentDidMount() {
    this.props.initTeamsSettings();
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
  initTeamsSettings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsTeamsPage);

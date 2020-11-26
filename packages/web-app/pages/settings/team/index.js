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
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import { initTeamsSettings } from '@caesar/common/actions/workflow';

class SettingsTeamsPage extends Component {
  componentDidMount() {
    this.props.initTeamsSettings();
  }

  render() {
    const { currentUserData } = this.props;

    const shouldShowLoader = !currentUserData;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <>
        <Head title="Teams" />
        <SettingsLayout currentUser={currentUserData}>
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
  currentUserData: currentUserDataSelector,
});

const mapDispatchToProps = {
  initTeamsSettings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsTeamsPage);

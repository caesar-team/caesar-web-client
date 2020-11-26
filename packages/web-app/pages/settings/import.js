import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  FullScreenLoader,
  Head,
  SettingsLayout,
  SettingsSidebar,
} from '@caesar/components';
import { ImportContainer } from '@caesar/containers';
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import { initImportSettings } from '@caesar/common/actions/workflow';

class SettingsImportPage extends Component {
  componentDidMount() {
    this.props.initImportSettings();
  }

  render() {
    const { currentUserData } = this.props;
    const shouldShowLoader = !currentUserData;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <>
        <Head title="Import" />
        <SettingsLayout currentUser={currentUserData}>
          <>
            <SettingsSidebar />
            <ImportContainer />
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
  initImportSettings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsImportPage);

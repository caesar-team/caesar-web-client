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
import { userDataSelector } from '@caesar/common/selectors/user';
import { initImportSettings } from '@caesar/common/actions/workflow';

class SettingsImportPage extends Component {
  componentDidMount() {
    this.props.initImportSettings();
  }

  render() {
    const { userData } = this.props;
    const shouldShowLoader = !userData;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <>
        <Head title="Import" />
        <SettingsLayout user={userData}>
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
  userData: userDataSelector,
});

const mapDispatchToProps = {
  initImportSettings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsImportPage);

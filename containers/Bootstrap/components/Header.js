import React, { Fragment, memo } from 'react';
import styled from 'styled-components';
import { Icon, NavigationPanel } from 'components';

const IconStyled = styled(Icon)`
  margin-right: auto;
`;

const Header = memo(({ steps, currentStep }) => (
  <Fragment>
    <IconStyled name="logo-new" width={142} height={40} />
    <NavigationPanel
      isDisabledNavigation
      steps={steps}
      currentStep={currentStep}
    />
  </Fragment>
));

export default Header;

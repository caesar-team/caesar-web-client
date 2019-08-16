import styled from 'styled-components';
import { NavigationPanel } from 'components';

// hack to ignore parent width container
const NavigationPanelStyled = styled(NavigationPanel)`
  position: absolute;
  width: calc(100vw - 122px);
  margin-left: calc(50% - 50vw);
  top: 0;
`;

export default NavigationPanelStyled;

import React, { forwardRef } from 'react';
import { useLocation } from 'react-use';
import styled from 'styled-components';
import { getDomainName } from '@caesar/common/utils/getDomainName';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const StyledIcon = styled(Icon)`
  max-width: 100%;
  max-height: 100%;
`;

const DomainName = styled.span`
  position: absolute;
  bottom: 0;
  left: 36%;
  font-size: ${({ height }) => (3 / 8) * height}px;
  line-height: 1;
  letter-spacing: 0.5px;
  color: ${({ color, theme }) => theme.color[color]};
`;

const DEFAULT_LOGO_WIDTH = 102;
const DEFAULT_LOGO_HEIGHT = 32;

export const LogoCaesarDomain = forwardRef(
  (
    {
      color = 'black',
      domainNameColor = 'gray',
      width = DEFAULT_LOGO_WIDTH,
      height = DEFAULT_LOGO_HEIGHT,
    },
    ref,
  ) => {
    const { hostname } = useLocation();
    const domainName = getDomainName(hostname);

    return (
      <Wrapper width={width} height={height} ref={ref}>
        <StyledIcon name="logo-caesar-company" color={color} />
        <DomainName color={domainNameColor} height={height}>
          {domainName}
        </DomainName>
      </Wrapper>
    );
  },
);

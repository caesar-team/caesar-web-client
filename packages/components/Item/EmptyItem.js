import React from 'react';
import styled from 'styled-components';
import { Icon } from '@caesar/components';
import EmptyLeftImg from '@caesar/assets/images/empty-left.png';
import EmptyRightImg from '@caesar/assets/images/empty-right.png';

const ImageLeft = styled.img`
  position: absolute;
  top: 60px;
  left: 0;
`;

const ImageRight = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
  fill: ${({ theme }) => theme.color.emperor};
`;

const EmptyItem = () => (
  <>
    {/* <ImageLeft src={EmptyLeftImg} /> */}
    <StyledIcon name="logo-caesar" width={205} height={46} />
    {/* <ImageRight src={EmptyRightImg} /> */}
  </>
);

export default EmptyItem;

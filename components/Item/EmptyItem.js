import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Icon } from 'components';
import EmptyImg from 'static/images/empty.png';
import EmptyImg2x from 'static/images/empty@2x.png';

const Image = styled.img`
  padding-top: 45px;
  padding-left: 15px;
  object-fit: contain;
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 380px;
  left: 240px;
  fill: ${({ theme }) => theme.emperor};
`;

const EmptyItem = props => (
  <Fragment>
    <Image
      src={EmptyImg}
      srcSet={`${EmptyImg} 1x, ${EmptyImg2x} 2x`}
      {...props}
    />
    <StyledIcon name="logo" width={205} height={46} />
  </Fragment>
);

export default EmptyItem;

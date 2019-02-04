import React, { Fragment } from 'react';
import styled from 'styled-components';
import EmptyImg from 'static/images/empty-list.png';
import EmptyImg2x from 'static/images/empty-list@2x.png';

const Image = styled.img`
  margin-top: 15px;
  margin-left: -25px;
  object-fit: contain;
`;

const Text = styled.div`
  position: absolute;
  top: 325px;
  left: 50%;
  font-size: 18px;
  letter-spacing: 0.6px;
  transform: translateX(-50%);
`;

const EmptyList = props => (
  <Fragment>
    <Image
      src={EmptyImg}
      srcSet={`${EmptyImg} 1x, ${EmptyImg2x} 2x`}
      {...props}
    />
    <Text>No elements</Text>
  </Fragment>
);

export default EmptyList;

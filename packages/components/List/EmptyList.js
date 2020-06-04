import React from 'react';
import styled from 'styled-components';
import EmptyImg from '@caesar/assets/images/empty-list.png';
import EmptyImg2x from '@caesar/assets/images/empty-list@2x.png';
import EmptyImg3x from '@caesar/assets/images/empty-list@3x.png';

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
  transform: translateX(-50%);
`;

export const EmptyList = () => (
  <>
    <Image srcSet={`${EmptyImg2x} 2x, ${EmptyImg3x} 3x`} src={EmptyImg} />
    <Text>No elements</Text>
  </>
);

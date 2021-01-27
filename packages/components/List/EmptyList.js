import React from 'react';
import styled from 'styled-components';

const Text = styled.div`
  position: absolute;
  top: 325px;
  left: 50%;
  font-size: 18px;
  transform: translateX(-50%);
`;

export const EmptyList = () => <Text>No elements</Text>;

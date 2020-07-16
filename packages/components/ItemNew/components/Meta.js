import React from 'react';
import styled from 'styled-components';
import { formatDate } from '@caesar/common/utils/dateUtils';
import { Row } from '../../ItemFields/common';
import { Wrapper } from './Wrapper';

const LastUpdated = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
`;

export const Meta = ({ item: { lastUpdated } }) => (
  <Row>
    <LastUpdated>
      Last updated {formatDate(lastUpdated, 'LLLL dd, yyyy')}
    </LastUpdated>
  </Row>
);

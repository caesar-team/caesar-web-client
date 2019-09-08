import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../Icon';

const IconStyled = styled(Icon)`
  width: 10px;
  height: 10px;
  fill: ${({ theme }) => theme.gray};
  cursor: pointer;
`;

const RemoveControl = ({ className, onClick }) => (
  <IconStyled name="close" className={className} onClick={onClick} />
);

export default RemoveControl;

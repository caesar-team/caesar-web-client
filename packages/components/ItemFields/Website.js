import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import { Input } from './Input';

const EyeIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Website = ({ value, handleClickAcceptEdit }) => {
  const handleclickGoTo = () => {
    window.open(value, '_blank');
  };

  return (
    <Input
      label="Website"
      value={value}
      withEllipsis
      handleClickAcceptEdit={handleClickAcceptEdit}
      addonIcons={
        <EyeIcon
          name="go-to"
          color="gray"
          width={20}
          height={20}
          onClick={handleclickGoTo}
        />
      }
    />
  );
};

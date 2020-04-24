import React from 'react';
import styled from 'styled-components';
import Input from './Input';
import { Icon } from '../Icon';

const InputStyled = styled(Input)`
  padding-left: 20px;

  ${Input.InputField} {
    border-bottom: none;
    background-color: ${({ theme }) => theme.white};
  }

  ${Input.Prefix} {
    left: 0;
  }
`;

const CloseIcon = styled(Icon)`
  cursor: pointer;
`;

const SearchInput = ({
  searchedText,
  onClickReset = Function.prototype,
  ...props
}) => {
  const SearchIconComponent = <Icon name="search" width={18} height={18} />;

  const CloseIconComponent = (
    <CloseIcon name="close" width={18} height={18} onClick={onClickReset} />
  );

  const iconComponent = searchedText ? CloseIconComponent : SearchIconComponent;

  return (
    <InputStyled
      prefix={iconComponent}
      placeholder="Search by Caesar…"
      value={searchedText}
      {...props}
    />
  );
};

export default SearchInput;

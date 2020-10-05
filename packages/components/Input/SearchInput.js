import React, { memo } from 'react';
import styled from 'styled-components';
import { Input } from './Input';
import { Icon } from '../Icon';

const InputStyled = styled(Input)`
  padding-left: 34px;

  ${Input.InputField} {
    border-bottom: none;
    background-color: ${({ theme }) => theme.color.white};
  }

  ${Input.Prefix} {
    left: 0;
  }
`;

const CloseIcon = styled(Icon)`
  cursor: pointer;
`;

const SearchIconComponent = (
  <Icon name="search" width={20} height={20} color="gray" />
);

const CloseIconComponent = ({ onClickReset }) => (
  <CloseIcon name="close" width={16} height={16} onClick={onClickReset} />
);

const SearchInputComponent = ({
  searchedText,
  onClickReset = Function.prototype,
  ...props
}) => {
  const iconComponent = searchedText ? (
    <CloseIconComponent onClickReset={onClickReset} />
  ) : (
    SearchIconComponent
  );

  return <InputStyled prefix={iconComponent} value={searchedText} {...props} />;
};

export const SearchInput = memo(SearchInputComponent);

import React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import { Label } from '../Label';
import { Input } from '../Input';
import { Icon } from '../Icon';

const Wrapper = styled.div``;

const StyledLabel = styled(Label)`
  padding: 4px 16px;
`;

const Inner = styled.div`
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 3px;
`;

const Active = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 8px 16px;
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
  border-radius: 3px;
`;

const SearchInput = styled(Input)`
  padding-left: 32px;

  ${Input.InputField} {
    border-bottom: none;
    background-color: ${({ theme }) => theme.color.white};
  }
`;

export const SelectVisible = ({
  label,
  active,
  options,
  searchPlaceholder,
  searchValue,
  setSearchValue,
  className,
}) => (
  <Wrapper className={className}>
    <StyledLabel>{label}</StyledLabel>
    <Inner>
      <Active>{active}</Active>
      <SearchInput
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        prefix={<Icon name="search" width={16} height={16} color="gray" />}
      />
      <Scrollbars style={{ height: 160 }}>
        {options.map(option => option)}
      </Scrollbars>
    </Inner>
  </Wrapper>
);

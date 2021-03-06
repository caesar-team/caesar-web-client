import React from 'react';
import styled from 'styled-components';
import { Input } from './Input';

const StyledInput = styled(Input)`
  ${Input.InputField} {
    padding: 0 80px 0 0;
    font-size: ${({ theme }) => theme.font.size.big};
    line-height: ${({ theme }) => theme.font.lineHeight.big};
    background-color: ${({ theme }) => theme.color.white};
    border-bottom: 1px solid transparent;
  }

  ${Input.ValueWrapper} {
    justify-content: flex-start;
    padding: 0;
    margin-bottom: ${({ marginBottom }) => marginBottom}px;
    border-bottom: 1px solid transparent;
  }

  ${Input.ValueInner} {
    margin-right: unset;
  }

  ${Input.Value} {
    font-size: ${({ theme }) => theme.font.size.big};
    line-height: ${({ theme }) => theme.font.lineHeight.big};
  }

  ${Input.PencilIcon} {
    align-self: flex-start;
    margin-top: 8px;
  }
`;

export const Title = ({
  value,
  itemSubject,
  schema,
  onClickAcceptEdit,
  marginBottom = 0,
}) => {
  return (
    <StyledInput
      value={value}
      itemSubject={itemSubject}
      schema={schema}
      name="name"
      placeholder="Enter the title"
      withEllipsis
      withCopyButton={false}
      onClickAcceptEdit={onClickAcceptEdit}
      marginBottom={marginBottom}
    />
  );
};

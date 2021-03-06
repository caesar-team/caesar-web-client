import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../Icon';
import { Input } from './Input';

const GoToIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Website = ({ value, itemSubject, schema, onClickAcceptEdit }) => {
  const handleClickGoTo = () => {
    const url = value.match(/^https?:/) ? value : `//${value}`;

    window.open(url, '_blank');
  };

  return (
    <Input
      label="Website"
      name="website"
      value={value}
      itemSubject={itemSubject}
      schema={schema}
      withEllipsis
      allowBlankValue
      onClickAcceptEdit={onClickAcceptEdit}
      addonIcons={
        value && (
          <GoToIcon
            name="go-to"
            color="gray"
            width={20}
            height={20}
            onClick={handleClickGoTo}
          />
        )
      }
    />
  );
};

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.color.white};
`;

const Item = styled.div`
  font-size: 16px;
  color: ${({ isFirst, theme }) =>
    isFirst ? theme.color.black : theme.color.gray};

  &::after {
    content: '—';
    margin: 0 8px;
    color: ${({ theme }) => theme.color.gallery};
  }
`;

const Breadcrumbs = ({ list, ...props }) => {
  const renderedItems = list.map((name, index) => (
    <Item key={index} isFirst={index === 0}>
      {name}
    </Item>
  ));

  return <Wrapper {...props}>{renderedItems}</Wrapper>;
};

export default Breadcrumbs;

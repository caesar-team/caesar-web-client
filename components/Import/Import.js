import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
`;

class Import extends Component {
  render() {
    return (
      <Wrapper>
        Import component
      </Wrapper>
    );
  }
}

export default Import;

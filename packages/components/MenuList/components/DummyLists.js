import React from 'react';
import styled from 'styled-components';
import { Icon } from '@caesar/components';
import { DummyRect, Loader } from '../../Item/types/styles';

const Wrapper = styled.div`
  position: relative;
  height: 150px;
  padding-top: 24px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 24px;
`;

const DummyIcon = styled(DummyRect)`
  border-radius: 50%;
`;

const Title = styled(DummyRect)`
  margin-right: auto;
  margin-left: 24px;
`;

const DummyItem = (
  <ListItem>
    <DummyIcon width={30} height={30}/>
    <Title width={150} height={24} />
    <DummyRect width={20} height={24} />
  </ListItem>
);

export const DummyLists = () => (
  <Wrapper>
    <Loader>
      <Icon name="caesar" width={30} height={40} />
      Decryption in progress...
    </Loader>   
    {[DummyItem, DummyItem, DummyItem, DummyItem]}
  </Wrapper>  
);
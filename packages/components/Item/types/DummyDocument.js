import React from 'react';
import { Icon } from '@caesar/components';
import {
  Wrapper,
  Loader,
  DummyRect,
  Title,
  Avatar,
  OwnerWrapper,
  Owner,
  OwnerName,
  Attachments,
} from './styles';

export const DummyDocument = ({ isSharedItem = false }) => (
  <Wrapper>
    <Loader>
      <Icon name="caesar" width={30} height={40} />
      Decryption in progress...
    </Loader>
    <Title width={200} height={32} />
    {!isSharedItem && (
      <OwnerWrapper>
        <Avatar width={40} height={40} />
        <Owner>
          <OwnerName width={100} height={16} />
          <DummyRect width={60} height={12} />
        </Owner>
      </OwnerWrapper>
    )}
    <DummyRect height={120} />
    <Attachments width={100} height={24} />
    <DummyRect width={210} height={16} />
  </Wrapper>
);

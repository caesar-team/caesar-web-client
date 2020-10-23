import React, { memo } from 'react';
import styled from 'styled-components';
import { SCHEMA } from '@caesar/common/validation';
import { TEAM_TYPE } from '@caesar/common/constants';
import {
  Title,
  Input,
  Password,
  Website,
  Note,
  Attachments,
} from '../../ItemFields/view';
import { Row } from '../../ItemFields/common';
import { OwnerAndShares } from '../components';

const PasswordRow = styled(Row)`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.basic};
`;

const CredentialsComponent = ({
  item,
  itemSubject,
  onClickAcceptEdit,
  onClickShare,
  isSharedItem,
  isVisibleDragZone,
}) => {
  const { name, login, password, website, note, attachments, raws } = item.data;

  return (
    <>
      <Title
        value={name}
        itemSubject={itemSubject}
        schema={SCHEMA.REQUIRED_LIMITED_STRING()}
        onClickAcceptEdit={onClickAcceptEdit}
        marginBottom={isSharedItem ? 24 : 0}
      />
      {!isSharedItem && (
        <OwnerAndShares
          showShares={item.teamId === TEAM_TYPE.PERSONAL}
          invited={item.invited}
          itemSubject={itemSubject}
          onClickShare={onClickShare}
        />
      )}
      <Row>
        <Input
          label="Login"
          name="login"
          value={login}
          itemSubject={itemSubject}
          schema={SCHEMA.REQUIRED_LIMITED_STRING()}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <PasswordRow>
        <Password
          value={password}
          itemSubject={itemSubject}
          schema={SCHEMA.REQUIRED_LIMITED_STRING()}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </PasswordRow>
      <Row>
        <Website
          value={website}
          itemSubject={itemSubject}
          schema={SCHEMA.WEBSITE}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row marginBottom={24}>
        <Note
          value={note}
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row marginBottom={24}>
        <Attachments
          attachments={attachments}
          raws={raws}
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
          isVisibleDragZone={isVisibleDragZone}
        />
      </Row>
    </>
  );
};

export const Credentials = memo(CredentialsComponent);

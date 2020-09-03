import React, { memo } from 'react';
import { SCHEMA } from '@caesar/common/validation';
import {
  Title,
  Input,
  Password,
  Website,
  Note,
  Attachments,
} from '../../ItemFields/view';
import { Row } from '../../ItemFields/common';
import { OwnerAndInvitation } from '../components';

const CredentialsComponent = ({
  item,
  itemSubject,
  onClickAcceptEdit,
  onClickShare,
  isSharedItem,
}) => {
  const { name, login, pass, website, note, attachments, raws } = item.data;

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
        <OwnerAndInvitation
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
      <Row>
        <Password
          value={pass}
          itemSubject={itemSubject}
          schema={SCHEMA.REQUIRED_LIMITED_STRING()}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
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
        />
      </Row>
    </>
  );
};

export const Credentials = memo(CredentialsComponent);

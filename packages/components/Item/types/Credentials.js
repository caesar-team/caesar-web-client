import React from 'react';
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
import { Meta, OwnerAndInvitation } from '../components';

export const Credentials = ({
  item,
  itemSubject,
  onClickAcceptEdit,
  onClickShare,
}) => {
  const {
    data: { name, login, pass, website, note, attachments = [] },
  } = item;

  return (
    <>
      <Title
        value={name}
        itemSubject={itemSubject}
        schema={SCHEMA.REQUIRED_LIMITED_STRING()}
        onClickAcceptEdit={onClickAcceptEdit}
      />
      <OwnerAndInvitation
        itemSubject={itemSubject}
        onClickShare={onClickShare}
      />
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
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Meta item={item} />
    </>
  );
};

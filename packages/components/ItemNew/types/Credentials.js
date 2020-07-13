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
import { Wrapper, OwnerAndInvitation, RemoveButton } from '../components';

export const Credentials = ({
  item,
  onClickAcceptEdit,
  onClickShare,
  onClickMoveToTrash,
}) => {
  const {
    data: { name, login, pass, website, note, attachments = [] },
  } = item;

  return (
    <Wrapper>
      <Title
        value={name}
        schema={SCHEMA.REQUIRED_LIMITED_STRING()}
        onClickAcceptEdit={onClickAcceptEdit}
      />
      <OwnerAndInvitation onClickShare={onClickShare} />
      <Row>
        <Input
          label="Login"
          name="login"
          value={login}
          schema={SCHEMA.REQUIRED_LIMITED_STRING()}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row>
        <Password
          value={pass}
          schema={SCHEMA.REQUIRED_LIMITED_STRING()}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row>
        <Website
          value={website}
          schema={SCHEMA.WEBSITE}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row marginBottom={24}>
        <Note value={note} onClickAcceptEdit={onClickAcceptEdit} />
      </Row>
      <Row marginBottom={24}>
        <Attachments
          attachments={attachments}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      {onClickMoveToTrash && (
        <Row>
          <RemoveButton onClick={onClickMoveToTrash} />
        </Row>
      )}
    </Wrapper>
  );
};

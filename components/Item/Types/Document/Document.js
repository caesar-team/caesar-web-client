import React from 'react';
import { Label } from 'components';
import {
  ItemHeader,
  Wrapper,
  Attachments,
  FieldWrapper,
  Field,
  FieldValue,
  RemoveButtonWrapper,
  RemoveButton,
} from '../components';

export const Document = props => {
  const {
    allLists,
    onClickMoveToTrash,
    isTrashItem,
    item: {
      listId,
      secret: { note, attachments },
    },
  } = props;
  const listName = allLists.find(({ id }) => id === listId).label;
  const shouldShowNote = !!note;
  const shouldShowAttachments = attachments.length > 0;

  return (
    <Wrapper>
      <ItemHeader {...props} />
      <FieldWrapper>
        <Field>
          <Label>List</Label>
          <FieldValue>{listName}</FieldValue>
        </Field>
        {shouldShowNote && (
          <Field>
            <Label>Note</Label>
            <FieldValue>{note}</FieldValue>
          </Field>
        )}
      </FieldWrapper>
      {shouldShowAttachments && <Attachments attachments={attachments} />}
      {!isTrashItem && (
        <RemoveButtonWrapper>
          <RemoveButton color="white" icon="trash" onClick={onClickMoveToTrash}>
            Remove
          </RemoveButton>
        </RemoveButtonWrapper>
      )}
    </Wrapper>
  );
};

export default Document;

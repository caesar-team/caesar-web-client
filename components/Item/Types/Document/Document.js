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
    allLists = [],
    onClickMoveToTrash,
    isTrashItem,
    isReadOnly,
    isSharedItem,
    item: {
      listId,
      data: { note, attachments = [] },
    },
    childItems,
  } = props;
  const shouldShowNote = !!note;
  const shouldShowAttachments = attachments && attachments.length > 0;
  const shouldShowRemove = !isSharedItem && !isTrashItem;
  const listName =
    allLists.length > 0 ? allLists.find(({ id }) => id === listId).label : null;

  return (
    <Wrapper>
      <ItemHeader
        isReadOnly={isReadOnly}
        allLists={allLists}
        childItems={childItems}
        {...props}
      />
      <FieldWrapper>
        {listName && (
          <Field>
            <Label>List</Label>
            <FieldValue>{listName}</FieldValue>
          </Field>
        )}
        {shouldShowNote && (
          <Field>
            <Label>Note</Label>
            <FieldValue>{note}</FieldValue>
          </Field>
        )}
      </FieldWrapper>
      {shouldShowAttachments && <Attachments attachments={attachments} />}
      {shouldShowRemove && (
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

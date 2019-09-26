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
      data: { note, attachments = [] },
    },
    childItems,
  } = props;
  const shouldShowNote = !!note;
  const shouldShowAttachments = attachments && attachments.length > 0;
  const shouldShowRemove = !isSharedItem && !isTrashItem;

  return (
    <Wrapper>
      <ItemHeader
        isReadOnly={isReadOnly}
        allLists={allLists}
        childItems={childItems}
        {...props}
      />
      <FieldWrapper>
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
          <RemoveButton
            withOfflineCheck
            color="white"
            icon="trash"
            onClick={onClickMoveToTrash}
          >
            Remove
          </RemoveButton>
        </RemoveButtonWrapper>
      )}
    </Wrapper>
  );
};

export default Document;

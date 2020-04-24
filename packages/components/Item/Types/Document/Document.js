import React from 'react';
import { Label, Can } from '@caesar/components';
import { DELETE_PERMISSION } from '@caesar/common/constants';
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
    item,
    childItems,
  } = props;

  const {
    data: { note, attachments = [] },
  } = item;

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
        <Can I={DELETE_PERMISSION} of={item}>
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
        </Can>
      )}
    </Wrapper>
  );
};

export default Document;

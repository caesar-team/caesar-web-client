import React from 'react';
import { styled } from 'styled-components';
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

const Meta = styled.div`
`;

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
    lastUpdated,
  } = item;

  const shouldShowNote = !!note;
  const shouldShowAttachments = attachments?.length > 0;
  const shouldShowRemove = !isSharedItem && !isTrashItem;

  return (
    <Wrapper>11111
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
      <Meta>
        Last updated {lastUpdated}
      </Meta>
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

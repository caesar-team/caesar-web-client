import React from 'react';
import {
  Wrapper,
  FieldWrapper,
  Field,
  FieldValue,
  Title,
} from '@caesar/components';
import { Label } from '@caesar-ui';

export const Document = props => {
  const {
    item: {
      data: { name, note },
    },
  } = props;
  const shouldShowNote = !!note;

  return (
    <Wrapper>
      <Title>{name}</Title>
      <FieldWrapper>
        {shouldShowNote && (
          <Field>
            <Label>Note</Label>
            <FieldValue>{note}</FieldValue>
          </Field>
        )}
      </FieldWrapper>
    </Wrapper>
  );
};

export default Document;

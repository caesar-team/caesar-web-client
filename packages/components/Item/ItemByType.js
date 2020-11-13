import React from 'react';
import { ITEM_TYPE } from '@caesar/common/constants';
import { TextError } from '../Error';
import { Credentials, Document, DummyDocument, DummyCredentials } from './types';

export const ItemByType = props => {
  switch (props.item.type) {
    case ITEM_TYPE.CREDENTIALS:
      return props.isDummy
        ? <DummyCredentials {...props} />
        : <Credentials {...props} />;
    case ITEM_TYPE.DOCUMENT:
      return props.isDummy
        ? <DummyDocument {...props} />
        : <Document {...props} />;
    default:
      return <TextError>Unknown type</TextError>;
  }
};

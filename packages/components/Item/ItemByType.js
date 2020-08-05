import React from 'react';
import { ITEM_TYPE } from '@caesar/common/constants';
import { TextError } from '../Error';
import { Credentials, Document } from './types';

export const ItemByType = props => {
  switch (props.item.type) {
    case ITEM_TYPE.CREDENTIALS:
      return <Credentials {...props} />;
    case ITEM_TYPE.DOCUMENT:
      return <Document {...props} />;
    default:
      return <TextError>Unknown type</TextError>;
  }
};

import React from 'react';
import { ITEM_TYPE } from '@caesar/common/constants';
import { TextError } from '../../Error';
import { Credentials, Document } from '../types';

export const FormByType = props => {
  switch (props.type) {
    case ITEM_TYPE.CREDENTIALS:
      return <Credentials {...props} />;
    case ITEM_TYPE.DOCUMENT:
      return <Document {...props} />;
    default:
      return <TextError>Unknown type</TextError>;
  }
};

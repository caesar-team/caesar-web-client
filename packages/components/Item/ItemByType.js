import React from 'react';
import { ITEM_TYPE } from '@caesar/common/constants';
import { TextError } from '../Error';
import { Credentials, Document } from './types';

const ITEM_COMPONENT_TYPE = {
  [ITEM_TYPE.CREDENTIALS]: props => <Credentials {...props} />,
  [ITEM_TYPE.DOCUMENT]: props => <Document {...props} />,
};

export const ItemByType = props => {
  const itemComponent = ITEM_COMPONENT_TYPE[props.item.type](props) || (
    <TextError>Unknown type</TextError>
  );

  return itemComponent;
};

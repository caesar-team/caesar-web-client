import React, { memo } from 'react';
import { useEffectOnce } from 'react-use';
import { useDispatch } from 'react-redux';
import { SharingLayout } from '@caesar/components';
import { ItemByType } from '@caesar/components/Item/ItemByType';
import { initShare } from '@caesar/common/actions/workflow';

const SharingComponent = () => {
  const item = null;
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(initShare());
  });

  if (!item) {
    return null;
  }

  return (
    <SharingLayout>
      <ItemByType
        item={item}
        itemSubject={item?._permissions || {}}
        isSharedItem
      />
    </SharingLayout>
  );
};

export const Sharing = memo(SharingComponent);

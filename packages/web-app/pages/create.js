import React from 'react';
import { useRouter } from 'next/router';
import { Head } from '@caesar/components';
import { Bootstrap, Create } from '@caesar/containers';
import { ITEM_TEXT_TYPE } from '@caesar/common/constants';

const CreatePage = () => {
  const { query } = useRouter();

  return (
    <>
      <Head title={`Create ${ITEM_TEXT_TYPE[query.type]}`} />
      <Bootstrap component={Create} />
    </>
  );
};

export default CreatePage;

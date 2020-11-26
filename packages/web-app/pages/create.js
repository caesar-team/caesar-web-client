import React from 'react';
import { useRouter } from 'next/router';
import { Head } from '@caesar/components';
import { Create } from '@caesar/containers';
import { ITEM_CONTENT_TYPE } from '@caesar/common/constants';

const CreatePage = () => {
  const { query } = useRouter();

  return (
    <>
      <Head title={`Create ${ITEM_CONTENT_TYPE[query.type]}`} />
      <Create />
    </>
  );
};

export default CreatePage;

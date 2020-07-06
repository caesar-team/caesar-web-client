import React from 'react';
import { Head } from '@caesar/components';
import { Bootstrap, Create } from '@caesar/containers';

const CreatePage = () => (
  <>
    <Head title="Create" />
    <Bootstrap component={Create} />
  </>
);

export default CreatePage;

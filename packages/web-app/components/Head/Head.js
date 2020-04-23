import React from 'react';
import NextHead from 'next/head';

const Head = ({ title = '', description = '' }) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </NextHead>
);

export default Head;

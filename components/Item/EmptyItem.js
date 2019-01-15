import React from 'react';
import styled from 'styled-components';
import EmptyImg from 'static/images/empty.jpg';

const Image = styled.img`
  object-fit: contain;
`;

const EmptyItem = props => <Image src={EmptyImg} {...props} />;

export default EmptyItem;

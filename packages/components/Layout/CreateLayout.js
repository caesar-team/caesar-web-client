import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import LayoutConstructor from './LayoutConstructor';
import { PrimaryHeader } from './PrimaryHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 848px;
    padding: 0 24px;
    margin: 0 auto;
  }

  ${LayoutConstructor.BottomWrapper} {
    position: relative;
    width: 100%;
    padding: 24px;
  }
`;

export const CreateLayout = ({ children, ...props }) => {
  const currentUser = useSelector(currentUserDataSelector);

  return (
    <LayoutConstructorStyled
      headerComponent={<PrimaryHeader currentUser={currentUser} />}
      {...props}
    >
      {children}
    </LayoutConstructorStyled>
  );
};

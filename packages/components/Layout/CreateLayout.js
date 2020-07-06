import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ROUTES } from '@caesar/common/constants';
import {
  userDataSelector,
  currentTeamSelector,
} from '@caesar/common/selectors/user';
import { workInProgressListSelector } from '@caesar/common/selectors/workflow';
import { AppVersion } from '../AppVersion';
import { Button } from '../Button';
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

const StyledAppVersion = styled(AppVersion)`
  position: absolute;
  left: 24px;
  bottom: 24px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 848px;
  padding: 0 24px;
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;

export const CreateLayout = ({ children, ...props }) => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const team = useSelector(currentTeamSelector);
  const workInProgressList = useSelector(workInProgressListSelector);

  const handleClickCancel = () => {
    push(ROUTES.DASHBOARD);
  };

  const handleClickCreateItem = () => {
    console.log('handleClickCreateItem: ');
  };

  // const handleClickCreateItem = (name, type) => {
  //   dispatch(resetWorkInProgressItemIds());
  //   dispatch(
  //     setWorkInProgressItem(
  //       initialItemData(type, workInProgressList.id),
  //       ITEM_MODE.WORKFLOW_CREATE,
  //     ),
  //   );
  // };

  return (
    <LayoutConstructorStyled
      headerComponent={<PrimaryHeader user={user} />}
      footerComponent={
        <>
          <StyledAppVersion />
          <ButtonsWrapper>
            <StyledButton color="white" onClick={handleClickCancel}>
              Cancel
            </StyledButton>
            <Button onClick={handleClickCreateItem}>Create</Button>
          </ButtonsWrapper>
        </>
      }
      {...props}
    >
      {children}
    </LayoutConstructorStyled>
  );
};

import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, TeamCard } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
  padding: 60px;
  position: relative;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
`;

const TeamListWrapper = styled.div`
  display: flex;
  padding: 30px;
  flex-wrap: wrap;

  > {
    &:nth-child(2n + 1) {
      margin-right: 60px;
    }
  }
`;

const TeamCardStyled = styled(TeamCard)`
  width: calc((100% - 60px) / 2);
  margin-bottom: 30px;
`;

class TeamListContainer extends Component {
  render() {
    return (
      <Wrapper>
        <TopWrapper>
          <Title>Teams</Title>
          <Button
            withOfflineCheck
            onClick={this.handleClickCreateList}
            icon="plus"
            color="black"
          >
            ADD TEAM
          </Button>
        </TopWrapper>
        <TeamListWrapper>
          <TeamCardStyled />
          <TeamCardStyled />
          <TeamCardStyled />
          <TeamCardStyled />
        </TeamListWrapper>
      </Wrapper>
    );
  }
}

export default TeamListContainer;

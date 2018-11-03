import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { match } from 'common/utils/match';
import { postSetMaster, postCheckMaster } from 'common/api';
import { PasswordInput, Icon } from '../../components';
import {
  REGEXP_TEXT_MATCH,
  STEP_CONFIRM_MASTER_PASSWORD,
  STEP_CREATE_MASTER_PASSWORD,
} from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #fff;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 90px;
  min-width: 540px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const NiceToMeetYouText = styled.div`
  font-size: 24px;
  color: #2e2f31;
  text-transform: uppercase;
`;

const SetMasterPasswordText = styled.div`
  font-size: 18px;
  color: #888b90;
  margin: 20px 0 20px;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
`;

const Label = styled.div`
  font-size: 18px;
  color: #888b90;
  text-align: center;
  margin-bottom: 20px;
`;

const StyledPasswordInput = styled(PasswordInput)`
  > input {
    height: 60px;
    font-size: 18px;
    padding: 20px;
  }
`;

const Error = styled.div`
  font-size: 15px;
  color: #f5222d;
  margin-top: 15px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &[disabled],
  &[disabled]:hover {
    color: #fff;
    background: #3d70ff;
    opacity: 0.5;
  }
`;

const ReturnToStepWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  top: 60px;
  left: 140px;
  cursor: pointer;
`;

const ReturnTo = styled.div`
  font-size: 18px;
  color: #888b90;
  margin-left: 6px;
`;

const StyledIcon = styled(Icon)`
  margin-top: 2px;
`;

const checkIsPasswordValid = (rules, value) =>
  rules.every(({ regexp }) => regexp.test(value));

class MasterPassword extends Component {
  state = this.prepareInitialState();

  handleClickNext = event => {
    event.preventDefault();

    this.setState({
      step: STEP_CONFIRM_MASTER_PASSWORD,
    });
  };

  handleClickConfirm = async event => {
    event.preventDefault();

    const { confirmPassword } = this.state;
    const {
      isFullWorkflow,
      onSetMasterPassword = Function.prototype,
    } = this.props;

    const action = isFullWorkflow ? postSetMaster : postCheckMaster;

    this.setState({
      isLoading: true,
    });

    try {
      await action(confirmPassword);
      onSetMasterPassword();
    } catch (e) {
      this.setState({
        isFailed: true,
        isLoading: false,
      });
    }
  };

  handleChangePassword = name => value => {
    this.setState(prevState => ({
      ...prevState,
      isFailed: false,
      [name]: value,
    }));
  };

  handleClickReturn = () => {
    this.setState({
      step: STEP_CREATE_MASTER_PASSWORD,
    });
  };

  prepareInitialState() {
    const { isFullWorkflow } = this.props;

    return {
      isFailed: false,
      isLoading: false,
      step: isFullWorkflow
        ? STEP_CREATE_MASTER_PASSWORD
        : STEP_CONFIRM_MASTER_PASSWORD,
      password: '',
      confirmPassword: '',
    };
  }

  renderCreateStep() {
    const { password } = this.state;

    const isDisabledButton = !checkIsPasswordValid(REGEXP_TEXT_MATCH, password);

    return (
      <Form onSubmit={this.handleClickNext}>
        <SetMasterPasswordText>
          Create master password for Caesar
        </SetMasterPasswordText>
        <Label>Master password</Label>
        <StyledPasswordInput
          autoFocus
          withIndicator
          rules={REGEXP_TEXT_MATCH}
          name="password"
          value={password}
          placeholder="Enter your password…"
          onChange={this.handleChangePassword('password')}
        />
        <StyledButton
          type="primary"
          htmlType="submit"
          disabled={isDisabledButton}
        >
          Next <StyledIcon type="right" />
        </StyledButton>
      </Form>
    );
  }

  renderConfirmStep() {
    const { isFullWorkflow } = this.props;
    const { step, password, confirmPassword, isLoading, isFailed } = this.state;

    const errorText = isFullWorkflow
      ? 'Something wrong, please try again'
      : 'Wrong password';

    const isDisabledButton =
      !checkIsPasswordValid(REGEXP_TEXT_MATCH, confirmPassword) ||
      (isFullWorkflow && password !== confirmPassword) ||
      isFailed;

    return (
      <Form onSubmit={this.handleClickConfirm}>
        <SetMasterPasswordText>
          {isFullWorkflow
            ? 'Confirm your master password'
            : 'Write your master password'}
        </SetMasterPasswordText>
        <Label>Master password</Label>
        <StyledPasswordInput
          autoFocus
          key={step}
          name="confirmPassword"
          placeholder="Enter your password…"
          onChange={this.handleChangePassword('confirmPassword')}
        />
        {isFailed && <Error>{errorText}</Error>}
        <StyledButton
          type="primary"
          disabled={isDisabledButton}
          loading={isLoading}
          onClick={this.handleClickConfirm}
        >
          Confirm
        </StyledButton>
      </Form>
    );
  }

  render() {
    const { isFullWorkflow } = this.props;
    const { step } = this.state;

    const shouldShowBackButton =
      isFullWorkflow && step === STEP_CONFIRM_MASTER_PASSWORD;

    const renderedStep = match(
      step,
      {
        STEP_CREATE_MASTER_PASSWORD: this.renderCreateStep(),
        STEP_CONFIRM_MASTER_PASSWORD: this.renderConfirmStep(),
      },
      null,
    );

    return (
      <Wrapper>
        {shouldShowBackButton && (
          <ReturnToStepWrapper onClick={this.handleClickReturn}>
            <Icon type="left" size="large" />
            <ReturnTo>Back to previous step</ReturnTo>
          </ReturnToStepWrapper>
        )}
        <InnerWrapper>
          <NiceToMeetYouText>Nice to meet you!</NiceToMeetYouText>
          {renderedStep}
        </InnerWrapper>
      </Wrapper>
    );
  }
}

export default MasterPassword;

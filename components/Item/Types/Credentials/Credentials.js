import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon, Label } from 'components';
import { copyToClipboard } from 'common/utils/clipboard';
import {
  Wrapper,
  Row,
  ItemHeader,
  FieldWrapper,
  Field,
  FieldValue,
  Attachments,
  RemoveButton,
  RemoveButtonWrapper,
} from '../components';

const StyledEyeIcon = styled(Icon)`
  margin-right: 20px;
  cursor: pointer;
  fill: ${({ theme }) => theme.gray};
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  fill: ${({ theme }) => theme.gray};
`;

const StyledWebsiteLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: inherit;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.emperor};
  }
`;

class Credentials extends Component {
  state = {
    isPasswordVisible: false,
  };

  handleTogglePasswordVisibility = () => {
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  handleCopy = field => () => {
    const {
      item: { secret },
    } = this.props;

    copyToClipboard(secret[field]);
  };

  render() {
    const { isPasswordVisible } = this.state;

    const {
      allLists,
      onClickMoveToTrash,
      isTrashItem,
      item: {
        listId,
        secret: { login, pass, website, note, attachments },
      },
    } = this.props;

    const pwd = isPasswordVisible ? pass : pass.replace(/./g, '*');
    const listName = allLists.find(({ id }) => id === listId).label;
    const eyeIconName = isPasswordVisible ? 'eye-off' : 'eye-on';

    const shouldShowWebsite = !!website;
    const shouldShowNote = !!note;
    const shouldShowAttachments = attachments.length > 0;

    return (
      <Wrapper>
        <ItemHeader {...this.props} />
        <FieldWrapper>
          <Field>
            <Label>Login</Label>
            <Row>
              <FieldValue>
                {login}
                <StyledIcon
                  name="copy"
                  width={19}
                  height={19}
                  onClick={this.handleCopy('login')}
                />
              </FieldValue>
            </Row>
          </Field>
          <Field>
            <Label>Password</Label>
            <Row>
              <FieldValue>
                {pwd}
                <Row>
                  <StyledEyeIcon
                    name={eyeIconName}
                    width={20}
                    height={20}
                    onClick={this.handleTogglePasswordVisibility}
                  />
                  <StyledIcon
                    name="copy"
                    width={19}
                    height={19}
                    onClick={this.handleCopy('pass')}
                  />
                </Row>
              </FieldValue>
            </Row>
          </Field>
          {shouldShowWebsite && (
            <Field>
              <Label>Website</Label>
              <FieldValue>
                <StyledWebsiteLink href={website} target="_blank">
                  {website}
                </StyledWebsiteLink>
              </FieldValue>
            </Field>
          )}
          <Field>
            <Label>List</Label>
            <FieldValue>{listName}</FieldValue>
          </Field>
          {shouldShowNote && (
            <Field>
              <Label>Note</Label>
              <FieldValue>{note}</FieldValue>
            </Field>
          )}
        </FieldWrapper>
        {shouldShowAttachments && <Attachments attachments={attachments} />}
        {!isTrashItem && (
          <RemoveButtonWrapper>
            <RemoveButton
              color="white"
              icon="trash"
              onClick={onClickMoveToTrash}
            >
              Remove
            </RemoveButton>
          </RemoveButtonWrapper>
        )}
      </Wrapper>
    );
  }
}

export default Credentials;

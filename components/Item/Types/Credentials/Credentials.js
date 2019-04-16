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
import { TRASH_TYPE } from '../../../../common/constants';

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
      notification,
      item: { secret },
    } = this.props;

    copyToClipboard(secret[field]);

    const fieldText = field === 'login' ? 'Login' : 'Password';

    notification.show({
      text: `${fieldText} has copied.`,
    });
  };

  render() {
    const { isPasswordVisible } = this.state;

    const {
      allLists = [],
      onClickMoveToTrash,
      isTrashItem,
      isReadOnly,
      isSharedItem = false,
      item: {
        listId,
        secret: { login, pass, website, note, attachments = [] },
      },
    } = this.props;

    const pwd = isPasswordVisible ? pass : pass.replace(/./g, '*');
    const eyeIconName = isPasswordVisible ? 'eye-off' : 'eye-on';
    const listName =
      allLists.length > 0
        ? allLists.find(({ id }) => id === listId).label
        : null;

    const shouldShowWebsite = !!website;
    const shouldShowNote = !!note;
    const shouldShowAttachments = attachments.length > 0;
    const shouldShowRemove = !isTrashItem && !isSharedItem;

    return (
      <Wrapper>
        <ItemHeader
          isSharedItem={isSharedItem}
          isReadOnly={isReadOnly}
          allLists={allLists}
          {...this.props}
        />
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
          {listName && (
            <Field>
              <Label>List</Label>
              <FieldValue>{listName}</FieldValue>
            </Field>
          )}
          {shouldShowNote && (
            <Field>
              <Label>Note</Label>
              <FieldValue>{note}</FieldValue>
            </Field>
          )}
        </FieldWrapper>
        {shouldShowAttachments && <Attachments attachments={attachments} />}
        {shouldShowRemove && (
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

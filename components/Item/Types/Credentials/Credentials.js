import React, { Component } from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { Icon, Label, HoldClickBehaviour } from 'components';
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

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
  cursor: pointer;

  fill: ${({ theme }) => theme.gray};

  &:hover {
    fill: ${({ theme }) => theme.black};
  }
`;

const EyeIconStyled = styled(IconStyled)`
  margin-right: 20px;
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

const FixedSizeField = styled.div`
  display: flex;
  width: calc(100% - 80px);
  overflow: hidden;
`;

class Credentials extends Component {
  state = {
    isPasswordVisible: false,
  };

  handleToggleVisibility = visible => () => {
    this.setState(() => ({
      isPasswordVisible: visible,
    }));
  };

  handleCopy = field => () => {
    const {
      notification,
      item: { data },
    } = this.props;

    copy(data[field]);

    const fieldText = field === 'login' ? 'Login' : 'Password';

    notification.show({
      text: `The ${fieldText} has copied.`,
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
        data: { login, pass, website, note, attachments = [] },
      },
      childItems,
    } = this.props;

    const pwd = isPasswordVisible ? pass : pass.replace(/./g, '*');
    const eyeIconName = isPasswordVisible ? 'eye-off' : 'eye-on';

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
          childItems={childItems}
          {...this.props}
        />
        <FieldWrapper>
          <Field>
            <Label>Login</Label>
            <Row>
              <FieldValue>
                <FixedSizeField>{login}</FixedSizeField>
                <IconStyled name="copy" onClick={this.handleCopy('login')} />
              </FieldValue>
            </Row>
          </Field>
          <Field>
            <Label>Password</Label>
            <Row>
              <FieldValue>
                <FixedSizeField>{pwd}</FixedSizeField>
                <Row>
                  <HoldClickBehaviour
                    onHoldStart={this.handleToggleVisibility(true)}
                    onHoldEnd={this.handleToggleVisibility(false)}
                  >
                    <EyeIconStyled name={eyeIconName} />
                  </HoldClickBehaviour>
                  <IconStyled
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
              withOfflineCheck
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

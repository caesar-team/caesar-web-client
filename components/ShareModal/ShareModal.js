import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  Modal,
  ModalTitle,
  Button,
  Checkbox,
  Toggle,
  TagsInput,
} from 'components';
import { copyToClipboard } from 'common/utils/clipboard';
import { base64ToObject, objectToBase64 } from 'common/utils/cipherUtils';
import { generateSharingUrl } from 'common/utils/sharing';
import { KEY_CODES } from 'common/constants';

const ModalDescription = styled.div`
  padding-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.black};
`;

const Row = styled.div`
  margin-bottom: 20px;
`;

const LinkRow = styled.div`
  margin-top: 20px;
`;

const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
`;

const ToggleLabelText = styled.span`
  padding-left: 10px;
  font-size: 14px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
  text-transform: uppercase;
`;

const SharedLinkWrapper = styled.div`
  max-width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.snow};
  border-radius: 3px;
`;

const SharedLink = styled.div`
  position: relative;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  word-break: break-all;
  white-space: pre-wrap;
`;

const SharedLinkActions = styled.div`
  display: flex;
  align-items: center;
  padding-top: 20px;
`;

const SharedLinkActionsButtons = styled.div`
  display: flex;
  margin-left: auto;
`;

const SharedLinkActionsButton = styled(Button)`
  text-transform: uppercase;
  margin-left: 20px;
`;

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const getEncryption = link => link.match(/\/([\w|+-]+)$/)[1];
const getShareId = link => link.match(/share\/(.+)\//)[1];

const getAnonymousLink = shared =>
  (shared.find(({ link }) => !!link) || {}).link;

export class ShareModal extends Component {
  state = this.prepareInitialState();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.isLoading && !!getAnonymousLink(nextProps.shared)) {
      return {
        isLoading: false,
      };
    }

    return null;
  }

  handleShareByLinkChange = () => {
    const {
      shared,
      onActivateSharedByLink,
      onDeactivateSharedByLink,
    } = this.props;

    const link = getAnonymousLink(shared);

    if (!link) {
      this.setState(
        {
          isLoading: true,
        },
        onActivateSharedByLink,
      );
    } else {
      onDeactivateSharedByLink();
    }
  };

  handleToggleSeparateLink = () => {
    this.setState(prevState => ({
      isUseMasterPassword: !prevState.isUseMasterPassword,
    }));
  };

  handleCopySharedLink = () => {
    const { isUseMasterPassword } = this.state;
    const { notification, shared = [] } = this.props;

    copyToClipboard(
      this.generateLinkText(getAnonymousLink(shared), isUseMasterPassword),
    );

    notification.show({
      text: `Shared link has copied.`,
    });
  };

  handleShare = () => {
    const { onShare } = this.props;
    const { emails } = this.state;

    return onShare && onShare(emails);
  };

  handleAddEmail = emails => {
    this.setState({ emails });
  };

  handleRemoveEmail = email => () => {
    this.setState(prevState => ({
      emails: prevState.emails.filter(oldEmail => oldEmail !== email),
    }));
  };

  generateLinkText(link, isUseMasterPassword) {
    const linkObj = base64ToObject(getEncryption(link));

    if (!isUseMasterPassword) {
      return link;
    }

    const { mp, ...linkData } = linkObj;

    return `${generateSharingUrl(
      getShareId(link),
      objectToBase64(linkData),
    )}\nMaster password: ${mp}`;
  }

  prepareInitialState() {
    return {
      emails: [],
      isUseMasterPassword: false,
      isLoading: false,
    };
  }

  render() {
    const { isUseMasterPassword, isLoading } = this.state;
    const { onCancel, shared = [], withAnonymousLink } = this.props;

    const link = withAnonymousLink ? getAnonymousLink(shared) : '';
    const switcherText = link ? 'Link access enabled' : 'Link access disabled';
    const linkText = link
      ? this.generateLinkText(link, isUseMasterPassword)
      : '';

    return (
      <Modal
        isOpen
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <ModalTitle>Share</ModalTitle>
        <ModalDescription>
          Share item will be available in read mode
        </ModalDescription>
        <Row>
          <TagsInput
            addOnPaste
            value={this.state.emails}
            validationRegex={EMAIL_REGEX}
            inputProps={{ placeholder: '' }}
            addKeys={[KEY_CODES.TAB, KEY_CODES.SPACE, KEY_CODES.ENTER]}
            onChange={this.handleAddEmail}
          />
        </Row>
        {withAnonymousLink && (
          <Fragment>
            <LinkRow>
              <ToggleLabel>
                <Toggle
                  value={!!link}
                  isLoading={isLoading}
                  onChange={this.handleShareByLinkChange}
                />
                <ToggleLabelText>{switcherText}</ToggleLabelText>
              </ToggleLabel>
            </LinkRow>
            {link && (
              <Row>
                <SharedLinkWrapper>
                  <SharedLink>{linkText}</SharedLink>
                  <SharedLinkActions>
                    <Checkbox
                      checked={isUseMasterPassword}
                      onChange={this.handleToggleSeparateLink}
                    >
                      Use master password
                    </Checkbox>
                    <SharedLinkActionsButtons>
                      <SharedLinkActionsButton
                        color="white"
                        icon="copy"
                        onClick={this.handleCopySharedLink}
                      >
                        Copy
                      </SharedLinkActionsButton>
                    </SharedLinkActionsButtons>
                  </SharedLinkActions>
                </SharedLinkWrapper>
              </Row>
            )}
          </Fragment>
        )}
        <ButtonsWrapper>
          <StyledButton color="white" onClick={onCancel}>
            Cancel
          </StyledButton>
          <StyledButton color="black" onClick={this.handleShare}>
            Done
          </StyledButton>
        </ButtonsWrapper>
      </Modal>
    );
  }
}

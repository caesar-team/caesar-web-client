import React, { Component } from 'react';
import styled from 'styled-components';
import TagsInput from 'react-tagsinput';
import Toggle from 'react-toggle';
import { copyToClipboard } from 'common/utils/clipboard';
import { Icon, Modal, ModalTitle, Button, Checkbox } from 'components';
import 'common/styles/react-tagsinput.css';
import 'common/styles/react-toggle.css';

const ModalDescription = styled.div`
  padding-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.emperor};
`;

const Row = styled.div`
  margin-bottom: 20px;
`;

const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
`;

const ToggleLabelText = styled.span`
  padding-left: 10px;
  font-size: 14px;
`;

const SharedListTitle = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.emperor};
  padding-bottom: 3px;
`;

const SharedList = styled.div`
  margin-bottom: 30px;
`;

const SharedItem = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
  background-color: ${({ theme }) => theme.snow};
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;
const SharedItemEmail = styled.div`
  margin-right: auto;
  font-size: 16px;
  color: ${({ theme }) => theme.black};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SharedItemDate = styled.div`
  flex-shrink: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.gray};
  padding-left: 20px;
`;

const SharedItemRemove = styled.button`
  border: none;
  background: none;
  padding: 4px;
  margin-left: 20px;
  color: ${({ theme }) => theme.gray};
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    color: ${({ theme }) => theme.black};
  }
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

  &::before {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    content: ${({ isLoading }) => isLoading && ''};
  }
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

export class ShareModal extends Component {
  state = {
    isLinkActivateLoading: false,
    hasLink: !!this.props.item.link,
    tags: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      item: { link },
    } = nextProps;
    const { hasLink, isLinkActivateLoading } = prevState;

    if (isLinkActivateLoading && !hasLink && link) {
      return {
        isLinkActivateLoading: false,
        hasLink: true,
      };
    }

    if (isLinkActivateLoading && hasLink && !link) {
      return {
        isLinkActivateLoading: false,
        hasLink: false,
      };
    }

    return null;
  }

  handleChange = tags => {
    this.setState({ tags });
  };

  handleShareByLinkChange = () => {
    const {
      item: { link },
      onActivateSharedByLink,
      onDeactivateSharedByLink,
    } = this.props;

    this.setState({
      isLinkActivateLoading: true,
    });

    if (!link) {
      onActivateSharedByLink(false);
    } else {
      onDeactivateSharedByLink();
    }
  };

  handleUseMasterPasswordChange = isUseMasterPassword => {
    const { onActivateSharedByLink } = this.props;
    this.setState({
      isLinkActivateLoading: true,
    });
    onActivateSharedByLink(isUseMasterPassword);
  };

  handleCopySharedLink = () => {
    const {
      notification,
      item: { link },
    } = this.props;

    copyToClipboard(link.data);

    notification.show({
      text: `Shared link has copied.`,
    });
  };

  render() {
    const {
      onCancel,
      item: { link },
    } = this.props;
    const { tags, isLinkActivateLoading } = this.state;
    // TODO: implement check of isUseMasterPassword (may be by parse link.data)
    const isUseMasterPassword = link ? link.isUseMasterPassword : false;
    const switcherText = link ? 'Link access enabled' : 'Link access disabled';

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
            value={tags}
            onChange={this.handleChange}
            inputProps={{ placeholder: 'Enter email addresses…' }}
          />
        </Row>
        <SharedListTitle>Shared with </SharedListTitle>
        <SharedList>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
        </SharedList>
        <Row>
          <ToggleLabel>
            <Toggle
              checked={!!link}
              disabled={isLinkActivateLoading}
              icons={false}
              onChange={() => this.handleShareByLinkChange(false)}
            />
            <ToggleLabelText>{switcherText}</ToggleLabelText>
          </ToggleLabel>
        </Row>
        {link && (
          <Row>
            <SharedLinkWrapper>
              <SharedLink isLoading={isLinkActivateLoading}>
                {link.data}
              </SharedLink>
              <SharedLinkActions>
                <Checkbox
                  isDisabled={isLinkActivateLoading}
                  isChecked={isUseMasterPassword}
                  onChange={value => this.handleUseMasterPasswordChange(value)}
                >
                  Use master password
                </Checkbox>
                <SharedLinkActionsButtons>
                  <SharedLinkActionsButton
                    disabled={isLinkActivateLoading}
                    color="white"
                    icon="mail"
                  >
                    Send email
                  </SharedLinkActionsButton>
                  <SharedLinkActionsButton
                    disabled={isLinkActivateLoading}
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
        <ButtonsWrapper>
          <StyledButton color="white" onClick={onCancel}>
            Cancel
          </StyledButton>
          <StyledButton color="black">Done</StyledButton>
        </ButtonsWrapper>
      </Modal>
    );
  }
}

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Button, Col, Divider, Row } from 'antd';
import { downloadFile } from 'common/utils/file';
import { copyToClipboard } from 'common/utils/clipboard';
import CopyIcon from 'static/images/svg/icon-copy.svg';
import { Icon } from '../../../Icon';
import Panel from '../../Panel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 24px;
  color: #2e2f31;
`;

const Left = styled.div`
  font-size: 18px;
  color: #888b90;
`;

const Right = styled.div`
  font-size: 18px;
  color: #2e2f31;
`;

const StyledRow = styled(Row)`
  display: flex;
  align-items: center;
`;

const IconsWrapper = styled(Col)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Attachment = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;

  &:hover {
    a {
      color: #3d70ff;
    }

    svg {
      fill: #3d70ff;
    }
  }
`;

const AttachmentLink = styled.a`
  color: #2e2f31;
  margin: 0 10px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const DownloadIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  margin-left: 20px;

  > svg {
    fill: #888b90;
  }

  &:hover {
    > svg {
      fill: #3d70ff;
    }
  }
`;

const StyledEyeIcon = styled(({ isActive, ...props }) => <Icon {...props} />)`
  cursor: pointer;

  > svg {
    fill: ${({ isActive }) => (isActive ? '#3d70ff' : '#888b90')};
  }

  &:hover {
    > svg {
      fill: #3d70ff;
    }
  }
`;

class CredentialsPost extends Component {
  state = {
    isPasswordVisible: false,
    attachmentHoverIndex: null,
  };

  handleTogglePasswordVisibility = () => {
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  handleCopy = field => () => {
    const {
      post: { secret },
    } = this.props;

    copyToClipboard(secret[field]);
  };

  handleClickDownloadFiles = () => {
    const {
      post: {
        secret: { attachments },
      },
    } = this.props;

    attachments.forEach(({ name, raw }) => downloadFile(raw, name));
  };

  handleClickDownloadFile = index => () => {
    const {
      post: {
        secret: { attachments },
      },
    } = this.props;

    const { raw, name } = attachments[index];

    downloadFile(raw, name);
  };

  handleMouseEnter = index => () => {
    this.setState({
      attachmentHoverIndex: index,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      attachmentHoverIndex: null,
    });
  };

  render() {
    const { isPasswordVisible, attachmentHoverIndex } = this.state;
    const {
      isTrashPost,
      allLists,
      members,
      onClickRemovePost,
      onClickEditPost,
      onClickShare,
      onClickRestorePost,
      post: {
        listId,
        shared,
        owner: isOwner,
        secret: { name, login, pass, note, attachments },
      },
    } = this.props;

    const pwd = isPasswordVisible ? pass : pass.replace(/./g, '*');

    const listName = allLists.find(({ id }) => id === listId).label;
    const avatars = shared.map(userId => members[userId]);

    const renderedLoginRow = (
      <Fragment>
        <StyledRow>
          <Col span={6}>
            <Left>Login</Left>
          </Col>
          <Col span={14}>
            <Right>{login}</Right>
          </Col>
          <IconsWrapper span={4}>
            <StyledIcon
              component={CopyIcon}
              size={16}
              onClick={this.handleCopy('login')}
            />
          </IconsWrapper>
        </StyledRow>
        <Divider />
      </Fragment>
    );

    const renderedPasswordRow = (
      <Fragment>
        <StyledRow>
          <Col span={6}>
            <Left>Password</Left>
          </Col>
          <Col span={14}>
            <Right>{pwd}</Right>
          </Col>
          <IconsWrapper span={4}>
            <StyledEyeIcon
              type="eye"
              size={20}
              isActive={isPasswordVisible}
              onClick={this.handleTogglePasswordVisibility}
            />
            <StyledIcon
              component={CopyIcon}
              size={16}
              onClick={this.handleCopy('pass')}
            />
          </IconsWrapper>
        </StyledRow>
        <Divider />
      </Fragment>
    );

    const renderedListRow = (
      <Fragment>
        <StyledRow>
          <Col span={6}>
            <Left>List</Left>
          </Col>
          <Col span={18}>
            <Right>{listName}</Right>
          </Col>
        </StyledRow>
        <Divider />
      </Fragment>
    );

    const renderedNoteRow = note && (
      <Fragment>
        <StyledRow>
          <Col span={6}>
            <Left>Note</Left>
          </Col>
          <Col span={18}>
            <Right>{note}</Right>
          </Col>
        </StyledRow>
        <Divider />
      </Fragment>
    );

    const renderedAttachments =
      attachments.length > 0 &&
      attachments.map((attachment, index) => (
        <Attachment
          key={index}
          onMouseEnter={this.handleMouseEnter(index)}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClickDownloadFile(index)}
        >
          <Icon type="paper-clip" />
          <AttachmentLink>{attachment.name}</AttachmentLink>
          {index === attachmentHoverIndex && <DownloadIcon type="download" />}
        </Attachment>
      ));

    const renderedAttachmentsRow = attachments.length > 0 && (
      <Fragment>
        <StyledRow>
          <Left>Attachments</Left>
        </StyledRow>
        <StyledRow>
          <Right>{renderedAttachments}</Right>
        </StyledRow>
        <StyledRow>
          <StyledButton
            type="dashed"
            icon="download"
            size="large"
            onClick={this.handleClickDownloadFiles}
          >
            Download all
          </StyledButton>
        </StyledRow>
      </Fragment>
    );

    return (
      <Wrapper>
        <Title>{name}</Title>
        <Panel
          isOwner={isOwner}
          isTrashPost={isTrashPost}
          avatars={avatars}
          onClickRemovePost={onClickRemovePost}
          onClickEditPost={onClickEditPost}
          onClickShare={onClickShare}
          onClickRestorePost={onClickRestorePost}
        />
        {renderedLoginRow}
        {renderedPasswordRow}
        {renderedListRow}
        {renderedNoteRow}
        {renderedAttachmentsRow}
      </Wrapper>
    );
  }
}

export default CredentialsPost;

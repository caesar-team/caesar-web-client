import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 15px;
  background: ${({ theme }) => theme.color.black};
  position: relative;
  border-radius: 3px;
  box-shadow: 0 11px 23px 0 rgba(0, 0, 0, 0.08);
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.color.white};
  margin-right: 20px;
`;

const Text = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.white};
`;

const TextItem = styled.div`
  margin-bottom: 4px;
`;

const ActionLink = styled.a`
  text-transform: uppercase;
  font-size: 16px;
  color: ${({ theme }) => theme.color.white};

  &:hover {
    color: ${({ theme }) => theme.color.gray};
  }
`;

class Notification extends PureComponent {
  actionRef = React.createRef();

  previousFocus = null;

  componentDidMount() {
    const elButton = this.actionRef.current;

    if (!elButton) return;

    if (document.activeElement instanceof HTMLElement) {
      this.previousFocus = document.activeElement;
    }

    elButton.focus();
  }

  componentWillUnmount() {
    this.restoreFocus();
  }

  handleActionClick = event => {
    const { onActionClick } = this.props;

    if (onActionClick) onActionClick(event);
  };

  handleActionBlur = () => {
    this.restoreFocus();
  };

  restoreFocus = () => {
    if (document.activeElement !== this.actionRef.current) return;

    if (this.previousFocus && this.previousFocus.focus) {
      const scrollPosition = window.pageYOffset;

      this.previousFocus.focus();

      window.scrollTo({ top: scrollPosition });
    }

    this.previousFocus = null;
  };

  render() {
    const { text, actionText, icon } = this.props;
    const content = Array.isArray(text)
      ? text.map(item => <TextItem>{item}</TextItem>)
      : text;

    return (
      <Wrapper>
        {icon && <StyledIcon name={icon} width={20} height={20} />}
        <Text>{content}</Text>
        {actionText && (
          <ActionLink
            onClick={this.handleActionClick}
            onBlur={this.handleActionBlur}
            ref={this.actionRef}
          >
            {actionText}
          </ActionLink>
        )}
      </Wrapper>
    );
  }
}

export default Notification;

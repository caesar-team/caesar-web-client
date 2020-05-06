import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import { PORTAL_ID } from '@caesar/common/constants';
import { isClient, isServer } from '@caesar/common/utils/isEnvironment';
import Portal from './Portal';

const DEFAULT_BODY_OPEN_CLASSNAME = 'modal-is-opened';

class Modal extends PureComponent {
  node = isClient ? document.createElement('div') : null;

  componentDidMount() {
    if (isServer) {
      return;
    }

    const { containerId = PORTAL_ID } = this.props;

    const reactPortalRoot = document.getElementById(containerId);

    if (reactPortalRoot && this.node) {
      reactPortalRoot.appendChild(this.node);
    }
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    if (!prevProps.isOpen && !isOpen) {
      // eslint-disable-next-line
      return;
    }
  }

  componentWillUnmount() {
    const { containerId = PORTAL_ID } = this.props;

    const reactPortalRoot = document.getElementById(containerId);

    if (reactPortalRoot && this.node) {
      reactPortalRoot.removeChild(this.node);
    }
  }

  render() {
    if (!this.node) {
      return null;
    }

    const {
      bodyOpenClassName = DEFAULT_BODY_OPEN_CLASSNAME,
      ...props
    } = this.props;

    return createPortal(
      <Portal {...props} bodyOpenClassName={bodyOpenClassName} />,
      this.node,
    );
  }
}

export default Modal;

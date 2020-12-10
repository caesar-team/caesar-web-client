import React, { useState, useRef, memo } from 'react';
import styled from 'styled-components';
import { useClickAway } from 'react-use';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

const Wrapper = styled.div`
  position: relative;
  height: 16px;
`;

const MoreIcon = styled(Icon)``;

const DottedWrapper = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  user-select: none;

  &:hover {
    ${MoreIcon} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;

const DottedMenuComponent = ({
  tooltipProps = {},
  forceClosed,
  children,
  className,
}) => {
  const [isOpened, setOpened] = useState(false);
  const menuRef = useRef(null);

  useClickAway(menuRef, () => {
    setOpened(false);
  });

  const handleToggle = event => {
    event.preventDefault();
    event.stopPropagation();
    setOpened(!isOpened);
  };

  return (
    <Wrapper ref={menuRef} className={className}>
      <DottedWrapper onClick={handleToggle}>
        <MoreIcon name="more" color="gray" width={16} height={16} />
      </DottedWrapper>
      <Tooltip {...tooltipProps} show={isOpened && !forceClosed}>
        {children}
      </Tooltip>
    </Wrapper>
  );
};

export const DottedMenu = memo(DottedMenuComponent);

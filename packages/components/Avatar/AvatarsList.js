import React from 'react';
import styled from 'styled-components';
import { Avatar } from './Avatar';

const Wrapper = styled.div`
  display: flex;
  z-index: ${({ theme }) => theme.zIndex.basic};
`;

const StyledAvatar = styled(Avatar)`
  z-index: ${({ zIndex }) => zIndex};
  margin-right: -8px;
  border: 1px solid ${({ theme }) => theme.color.white};
`;

const DEFAULT_VISIBLE_AVATARS_COUNT = 3;

const AvatarsList = ({
  avatars = [],
  size,
  fontSize,
  visibleCount = DEFAULT_VISIBLE_AVATARS_COUNT,
  ...props
}) => {
  const visibleAvatars = avatars.length ? avatars.slice(0, visibleCount) : [];
  const invisibleCount = avatars.length - visibleAvatars.length;
  const shouldShowLast = invisibleCount > 0;

  const renderedAvatars = visibleAvatars
    .map(({ name, email, avatar }, index) => (
      <StyledAvatar
        hint={name || email}
        size={size}
        fontSize={fontSize}
        key={index}
        name={name}
        email={email}
        avatar={avatar}
        zIndex={avatars.length - index}
      />
    ))
    .concat(
      shouldShowLast ? (
        <StyledAvatar
          size={size}
          fontSize={fontSize}
          key={visibleAvatars.length}
        >
          +{invisibleCount}
        </StyledAvatar>
      ) : null,
    );

  return <Wrapper {...props}>{renderedAvatars}</Wrapper>;
};

export default AvatarsList;

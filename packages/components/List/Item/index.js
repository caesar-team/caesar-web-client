/* eslint-disable camelcase */
import React from 'react';
import {
  PERMISSION,
  PERMISSION_MESSAGES,
  TEAM_TYPE,
} from "@caesar/common/constants";
import { Icon } from '../../Icon';
import { Can } from '../../Ability';
import {
  Row,
  TypeIconWrapper,
  CheckboxStyled,
  NotEditIconWrapper,
  NotEditIcon,
  Tooltip,
  IconWrapper,
  ItemTypeIcon,
  Title,
  Addon,
  AddonText,
  CloseIcon,
  WebsiteFavIcon,
} from './styles';

export const Item = ({
  id,
  title,
  data,
  type,
  invited = [],
  isMultiItem = false,
  isClosable = false,
  hasHover = true,
  isInModal = false,
  favorite,
  style,
  teamId,
  _permissions = {},
  index,
  teamMembersCount = 0,
  onClickClose = Function.prototype,
  onClickItem = Function.prototype,
  onSelectItem = Function.prototype,
  workInProgressItemIds,
  workInProgressItem,
  ...props
}) => {
  const { attachments = [], website } = data || {};
  const sharedCount =
    invited?.length +
    (teamMembersCount > 0 ? teamMembersCount - 1 : teamMembersCount);
  const shouldShowMembers = teamId === TEAM_TYPE.PERSONAL && sharedCount > 0;
  const shouldShowAttachments =
    attachments && Array.isArray(attachments) && attachments.length > 0;

  const shouldShowFavoriteIcon = favorite && !isClosable;
  const isActive = workInProgressItem?.id === id;
  const isChecked = isMultiItem && workInProgressItemIds.includes(id);

  const showTooltipUnder = index > 0;

  return (
    <Row
      key={id}
      style={style}
      onClick={onClickItem(id)}
      isActive={isActive}
      isChecked={isChecked}
      isMultiItem={isMultiItem}
      hasHover={hasHover}
      isInModal={isInModal}
      {...props}
    >
      <Can I={PERMISSION.MULTISELECT} an={_permissions} passThrough>
        {allowed => (
          <TypeIconWrapper
            onClick={e => {
              e.stopPropagation();
            }}
            isForbiddenMultiItem={!allowed && isMultiItem}
          >
            {allowed ? (
              <CheckboxStyled
                checked={isChecked}
                onChange={() => {
                  onSelectItem(id);
                }}
              />
            ) : (
              <NotEditIconWrapper>
                <NotEditIcon
                  name="not-edit"
                  width={20}
                  height={20}
                  color="white"
                />
                <Tooltip showUnder={showTooltipUnder}>
                  {PERMISSION_MESSAGES.FORBIDDEN_SELECT}
                </Tooltip>
              </NotEditIconWrapper>
            )}
            <IconWrapper>
              {website ? (
                <WebsiteFavIcon
                  website={website}
                  src={`https://www.google.com/s2/favicons?domain=${website}`}
                  alt={`The website favicon for address: ${website}`}
                />
              ) : (
                <ItemTypeIcon type={type} />
              )}
            </IconWrapper>
          </TypeIconWrapper>
        )}
      </Can>
      <Title>{title}</Title>
      {shouldShowAttachments && (
        <Addon isInModal={isInModal}>
          <Icon name="clip" width={16} height={16} />
          <AddonText>{attachments.length}</AddonText>
        </Addon>
      )}
      {shouldShowMembers && (
        <Addon isInModal={isInModal}>
          <Icon name="members" width={16} height={16} />
          <AddonText>{sharedCount}</AddonText>
        </Addon>
      )}
      {shouldShowFavoriteIcon && (
        <Addon>
          <Icon name="favorite-active" width={16} height={16} color="emperor" />
        </Addon>
      )}
      {isClosable && (
        <CloseIcon name="close" width={10} height={10} onClick={onClickClose} />
      )}
    </Row>
  );
};

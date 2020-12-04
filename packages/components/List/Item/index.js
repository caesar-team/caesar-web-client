/* eslint-disable camelcase */
import React from 'react';
import { PERMISSION, PERMISSION_MESSAGES } from '@caesar/common/constants';
import { getItemMetaData } from '@caesar/common/utils/item';
import { getOriginDomain } from '@caesar/common/utils/url';
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

const ItemIcon = ({ website, type }) => {
  const websiteUrl = website ? getOriginDomain(website) : null;

  return (
    <IconWrapper>
      {websiteUrl ? (
        <WebsiteFavIcon
          website={websiteUrl}
          src={`https://www.google.com/s2/favicons?domain=${websiteUrl}`}
          alt={`The website favicon for address: ${websiteUrl}`}
        />
      ) : (
        <ItemTypeIcon type={type} />
      )}
    </IconWrapper>
  );
};

const AttachmentsCount = ({ isInModal = false, attachmentsCount = 0 }) => {
  if (attachmentsCount <= 0) return <></>;

  return (
    <Addon isInModal={isInModal}>
      <Icon name="clip" width={16} height={16} />
      <AddonText>{attachmentsCount}</AddonText>
    </Addon>
  );
};

const SharedUsersCount = ({ isInModal = false, sharedCount = 0 }) => {
  if (sharedCount <= 0) return <></>;

  return (
    <Addon isInModal={isInModal}>
      <Icon name="members" width={16} height={16} />
      <AddonText>{sharedCount}</AddonText>
    </Addon>
  );
};

const FavItemIcon = ({ favorite = false, isClosable = true }) => {
  if (!favorite || isClosable) return <></>;

  return (
    <Addon>
      <Icon name="favorite-active" width={16} height={16} color="emperor" />
    </Addon>
  );
};

const CloseItemIcon = ({
  isClosable = true,
  onClickClose = Function.prototype,
}) => {
  if (!isClosable) return <></>;

  return (
    <CloseIcon name="close" width={10} height={10} onClick={onClickClose} />
  );
};

export const Item = ({
  id,
  meta,
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
  onClickClose = Function.prototype,
  onClickItem = Function.prototype,
  onSelectItem = Function.prototype,
  workInProgressItemIds,
  workInProgressItem,
  ...props
}) => {
  const { website, attachmentsCount, title } = getItemMetaData({ meta });
  const sharedCount = invited?.length;
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
            <ItemIcon {...{ website, type }} />
          </TypeIconWrapper>
        )}
      </Can>
      <Title>{title}</Title>
      <AttachmentsCount
        attachmentsCount={attachmentsCount}
        isInModal={isInModal}
      />
      <SharedUsersCount isInModal={isInModal} sharedCount={sharedCount} />
      <FavItemIcon favorite={favorite} isClosable={isClosable} />
      <CloseItemIcon isClosable={isClosable} onClickClose={onClickClose} />
    </Row>
  );
};

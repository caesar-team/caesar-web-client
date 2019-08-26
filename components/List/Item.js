import React from 'react';
import styled, { css } from 'styled-components';
import { formatDate } from 'common/utils/dateUtils';
import { ITEM_CREDENTIALS_TYPE, ITEM_ICON_TYPES } from 'common/constants';
import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';

const ItemType = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.gray};
  border-radius: 3px;
  margin-right: 20px;
  width: 40px;
  min-width: 40px;
  height: 40px;
`;

const Details = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  line-height: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 8px;
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBox = styled(Box)`
  margin-left: 20px;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const IconText = styled.div`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
  margin-right: 5px;
`;

const FavoriteIcon = styled(Icon)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const CheckboxStyled = styled(Checkbox)`
  ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.emperor};
    border: 1px solid ${({ theme }) => theme.emperor};

    ${({ checked }) => `
      > svg {
        display: ${checked ? 'block' : 'none'};
      }
    `}
  }
`;

const Row = styled.div`
  position: relative;
  display: flex;
  padding: 20px 30px 20px;
  background: ${({ theme, isActive }) =>
    isActive ? theme.white : theme.lightBlue};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};

  ${({ isMultiItem, isActive }) =>
    isActive &&
    isMultiItem &&
    css`
      background: ${({ theme }) => theme.gallery};
    `}
`;
const ItemTypeIcon = props => {
  const { type } = props;
  const icon = ITEM_ICON_TYPES[type] || ITEM_ICON_TYPES[ITEM_CREDENTIALS_TYPE];
  return <Icon name={icon} width={20} height={20} fill="#fff" />;
};
const Item = ({
  id,
  lastUpdated,
  data: { name, attachments },
  type,
  invited,
  isMultiItem = false,
  isActive = false,
  isClosable = false,
  favorite,
  style,
  onClickClose = Function.prototype,
  onClickItem = Function.prototype,
  ...props
}) => {
  const shouldShowMembers = !!invited.length;
  const shouldShowAttachments = attachments && attachments.length > 0;
  const shouldShowFavoriteIcon = favorite && !isClosable;

  return (
    <Row
      key={id}
      style={style}
      onClick={onClickItem(id)}
      isActive={isActive}
      isMultiItem={isMultiItem}
      {...props}
    >
      <ItemType>
        {isMultiItem ? (
          <CheckboxStyled checked={isActive} onChange={Function.prototype} />
        ) : (
          <ItemTypeIcon type={type} />
        )}
      </ItemType>
      <Details>
        <Title>{name}</Title>
        <Box>
          <Text>{formatDate(lastUpdated)}</Text>
          <Box>
            {shouldShowAttachments && (
              <Box>
                <StyledIcon name="clip" width={14} height={14} />
                <IconText>{attachments.length}</IconText>
              </Box>
            )}
            {shouldShowMembers && (
              <StyledBox>
                <StyledIcon name="group" width={14} height={14} />
                <IconText>{invited.length}</IconText>
              </StyledBox>
            )}
          </Box>
        </Box>
      </Details>
      {shouldShowFavoriteIcon && (
        <FavoriteIcon name="favorite-active" width={14} height={14} />
      )}
      {isClosable && (
        <CloseIcon name="close" width={14} height={14} onClick={onClickClose} />
      )}
    </Row>
  );
};

export default Item;

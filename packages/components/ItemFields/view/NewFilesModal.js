import React, { useState } from 'react';
import styled from 'styled-components';
import { getPlural } from '@caesar/common/utils/string';
import { Scrollbar } from '../../Scrollbar';
import { File } from '../../File';
import { Icon } from '../../Icon';

const Wrapper = styled.div`
  position: fixed;
  right: 40px;
  bottom: 24px;
  z-index: ${({ theme }) => theme.zIndex.basic};
  width: 320px;
  overflow: hidden;
  border-radius: 3px;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
`;

const HeaderText = styled.div`
  margin-right: auto;
`;

const StyledIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;
`;

const ArrowIcon = styled(StyledIcon)`
  transform: ${({ isDropdownOpened }) =>
    isDropdownOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const Inner = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.color.white};
`;

export const NewFilesModal = ({ files, closeModal }) => {
  const [isDropdownOpened, setDropdownOpened] = useState(true);

  const handleToggleDropdown = () => {
    setDropdownOpened(!isDropdownOpened);
  };

  return (
    <Wrapper>
      <Header>
        <HeaderText>
          {files.length} {getPlural(files.length, ['upload', 'uploads'])}
        </HeaderText>
        <ArrowIcon
          name="arrow-triangle"
          color="white"
          width={16}
          height={16}
          isDropdownOpened={isDropdownOpened}
          onClick={handleToggleDropdown}
        />
        <StyledIcon
          name="close"
          color="white"
          width={16}
          height={16}
          onClick={closeModal}
        />
      </Header>
      {isDropdownOpened && (
        <Inner>
          <Scrollbar autoHeight autoHeightMax={300}>
            {files.map(({ name, raw, error }) => (
              <File key={raw} name={name} raw={raw} error={error} />
            ))}
          </Scrollbar>
        </Inner>
      )}
    </Wrapper>
  );
};

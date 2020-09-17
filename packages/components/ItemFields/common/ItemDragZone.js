import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { TOTAL_MAX_UPLOADING_FILES_SIZES } from '@caesar/common/constants';
import { Icon } from '../../Icon';

const DragZone = styled.div`
  position: absolute;
  top: -30px;
  left: -45px;
  z-index: ${({ theme }) => theme.zIndex.basic};
  width: calc(100% + 45px * 2);
  height: calc(100% + 30px * 2);
  background: white;
  border: 1px dashed blue;
  opacity: 0.95;
`;

const ActiveDragDescription = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.basic};
  text-align: center;
  transform: translate(-50%, -50%);
`;

const ActiveDragText = styled.div`
  margin-top: 24px;
  margin-bottom: 8px;
`;

const ActiveDragTip = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
`;

const DownloadIcon = styled(Icon)``;

export const ItemDragZone = forwardRef((props, ref) => (
  <div ref={ref} {...props}>
    <DragZone />
    <ActiveDragDescription>
      <DownloadIcon name="download" width={40} height={40} color="black" />
      <ActiveDragText>Drop your files to upload</ActiveDragText>
      <ActiveDragTip>
        Not more than {TOTAL_MAX_UPLOADING_FILES_SIZES}
      </ActiveDragTip>
    </ActiveDragDescription>
  </div>
));

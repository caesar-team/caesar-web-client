import React from 'react';
import styled from 'styled-components';
import { downloadFile, downloadAsZip } from 'common/utils/file';
import { Icon } from 'components/Icon';
import { Row } from './Row';
import { File } from '../../../File';

const AttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 52px;
`;

const AttachmentsHeaderRow = styled(Row)`
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 24px;
`;

const StyledDownloadIcon = styled(Icon)`
  margin-right: 10px;
  vertical-align: baseline;
  transition: all 0.2s;
`;

const DownloadAll = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.black};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.emperor};

    svg {
      fill: ${({ theme }) => theme.emperor};
    }
  }
`;

const StyledFile = styled(File)`
  margin-bottom: 30px;
  margin-right: auto;
  padding-right: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Attachments = ({ attachments }) => {
  const handleClickDownloadFile = index => () => {
    const { raw, name } = attachments[index];

    downloadFile(raw, name);
  };

  const renderedAttachments = attachments.map((attachment, index) => (
    <StyledFile
      key={index}
      onClick={handleClickDownloadFile(index)}
      {...attachment}
    />
  ));

  const handleClickDownloadFiles = () => {
    downloadAsZip(attachments);
  };

  return (
    <AttachmentsWrapper>
      <AttachmentsHeaderRow>
        <Title>Attachments</Title>
        <Row>
          <DownloadAll onClick={handleClickDownloadFiles}>
            <StyledDownloadIcon name="download" width={14} height={14} />
            Download {attachments.length} files
          </DownloadAll>
        </Row>
      </AttachmentsHeaderRow>
      {renderedAttachments}
    </AttachmentsWrapper>
  );
};

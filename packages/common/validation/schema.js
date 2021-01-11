import * as yup from 'yup';
import { ERROR } from './constants';
import { checkFileSize, checkAllFileSizes } from './utils';
import {
  getRealFileSizeForBase64enc,
  humanizeSize,
  getRealFileSizesForBase64enc,
} from '../utils/file';

const STRING_MAX_LENGTH = 100;
const WEBSITE_MAX_LENGTH = 2048;

// eslint-disable-next-line no-useless-escape
const rUrl = /(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
export const singleAttachmentSchema = yup
  .string()
  .test(
    'fileSize',
    raw =>
      ERROR.FILE_SIZE(
        humanizeSize(
          raw.value ? getRealFileSizeForBase64enc(raw.value.length) : 0,
          true,
        ),
      ),
    checkFileSize,
  );

const allAttachmentsSchema = yup
  .array()
  .test(
    'allFilesSize',
    raw =>
      ERROR.ALL_FILES_SIZE(
        humanizeSize(getRealFileSizesForBase64enc(raw.value), true),
      ),
    checkAllFileSizes,
  );

const arrayOfAttachmentsSchema = yup
  .array(
    yup.object({
      name: yup.string().required(),
      raw: yup
        .string()
        .test(
          'fileSize',
          file =>
            ERROR.FILE_SIZE(
              humanizeSize(
                file.value ? getRealFileSizeForBase64enc(file.value.length) : 0,
                true,
              ),
            ),
          checkFileSize,
        ),
    }),
  )
  .test(
    'allFilesSize',
    raw =>
      ERROR.ALL_FILES_SIZE(
        humanizeSize(getRealFileSizesForBase64enc(raw.value), true),
      ),
    checkAllFileSizes,
  );

export const SCHEMA = {
  REQUIRED_FIELD: yup.string().required(ERROR.REQUIRED),
  REQUIRED_STRING: yup.string().required(ERROR.REQUIRED_TEXT),
  REQUIRED_LIMITED_STRING: (max = STRING_MAX_LENGTH) =>
    yup
      .string()
      .trim()
      .required(ERROR.REQUIRED_TEXT)
      .max(max, ERROR.MAX_LENGTH(max)),
  LIMITED_STRING: (max = STRING_MAX_LENGTH) =>
    yup
      .string()
      .trim()
      .max(max, ERROR.MAX_LENGTH(max)),
  WEBSITE: yup
    .string()
    .nullable()
    .matches(rUrl, {
      message: ERROR.WEBSITE,
      excludeEmptyString: true,
    })
    .max(WEBSITE_MAX_LENGTH, ERROR.MAX_LENGTH(WEBSITE_MAX_LENGTH)),
  SINGLE_ATTACHMENT: singleAttachmentSchema,
  ALL_ATTACHMENTS: allAttachmentsSchema,
  ARRAY_OF_ATTACHMENTS: arrayOfAttachmentsSchema,
  RAWS: yup.string(),
};

import * as yup from 'yup';
import { ERROR } from '@caesar/common/validation/constants';

export const codeSchema = yup.object().shape({
  code: yup.number().required(),
});

export const agreeSchema = yup.object().shape({
  agreeCheck: yup.boolean().oneOf([true], ERROR.REQUIRED),
});

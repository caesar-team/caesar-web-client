import * as yup from 'yup';
import { errorMessages } from 'common/utils/errorMessages';

export const schema = yup.object({
  name: yup.string().required(errorMessages.required),
  note: yup.string(),
  attachments: yup.array(yup.mixed()),
});

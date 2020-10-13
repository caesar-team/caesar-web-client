export const getDataFiledsFromItem = item => {
  const {
    name = '',
    note = '',
    password = '',
    website = '',
    login = '',
    attachments = [],
    raws = {},
  } = item;

  return {
    name,
    note,
    password,
    website,
    login,
    attachments,
    raws,
  };
};

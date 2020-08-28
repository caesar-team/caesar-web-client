export const getDataFiledsFromItem = item => {
  const {
    name = '',
    note = '',
    pass = '',
    website = '',
    login = '',
    attachments = [],
    raws = {},
  } = item;

  return {
    name,
    note,
    pass,
    website,
    login,
    attachments,
    raws,
  };
};

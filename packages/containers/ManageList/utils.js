export const initialListData = () => ({
  label: '',
});

export const memberAdapter = members =>
  members.reduce((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {});

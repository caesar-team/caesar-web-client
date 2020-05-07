export function getServerErrorMessage(error) {
  try {
    return error.data.error.message;
  } catch (e) {
    return 'Something wrong. Please try again';
  }
}

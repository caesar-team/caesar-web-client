export function getServerErrorMessage(error) {
  try {
    return error.message || error;
  } catch (e) {
    return 'Something wrong. Please try again';
  }
}

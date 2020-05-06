function stripVowels(word) {
  return word.replace(/[aeiou]/gi, '');
}

function getFirstWord(string) {
  return string.replace(/ .*/, '');
}

export function generateTeamTag(teamName) {
  return teamName && typeof teamName === 'string'
    ? `#${stripVowels(getFirstWord(teamName.toLocaleLowerCase()))}`
    : '';
}

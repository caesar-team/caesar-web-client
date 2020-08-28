export function formatNumbersByColumns(numbers, columns) {
  const printCodes = numbers.map((number, index) => {
    const position = index + 1;
    if (position % columns === 0) return `${number}\n`;

    return `${number} `;
  });

  return printCodes.join('');
}

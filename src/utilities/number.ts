export const toMoneyFormat = (string: string) => {
  const stringParts = string.split('.');
  const firstPart = stringParts[0];
  const secondPart = stringParts[1];
  let formattedFirstPart = '';
  let counter = 0;
  for (let i = firstPart.length - 1; i >= 0; i--) {
    const currentNumber = firstPart[i];
    formattedFirstPart = `${currentNumber}${formattedFirstPart}`;
    counter += 1;
    if (counter !== firstPart.length && counter % 3 === 0) {
      formattedFirstPart = `,${formattedFirstPart}`;
    }
  }
  return `${formattedFirstPart}${secondPart !== undefined ? `.${secondPart}` : ''}`;
};

export const fromMoneyFormat = (string: string) => {
  return string.replace(/,/g, '');
};

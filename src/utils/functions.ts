function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function truncateString(string: string, maxLength: number) {
  if (string.length <= maxLength) {
    return string;
  }

  let lastIndex = string.lastIndexOf(' ', maxLength);

  // only alphanumeric characters may precede the ellipsis
  if (/^(?![a-z]|[0-9])/i.test(string.charAt(lastIndex - 1))) {
    lastIndex--;
  }

  return string.substring(0, lastIndex).trim() + '...';
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function titleize(string: string) {
  const exceptions = ['and', 'of', 'the'];

  let words = string.split(' ');
  words = words.map((element, index) => {
    if (index === 0) return capitalize(element);
    if (exceptions.includes(element.toLowerCase())) return element.toLowerCase();
    return capitalize(element);
  });

  return words.join(' ');
}

export { getErrorMessage, truncateString, capitalize, titleize };

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

  return string.substring(0, lastIndex) + '...';
}

export { getErrorMessage, truncateString };

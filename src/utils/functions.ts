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
  const match = string.search(/(?<=[^[a-z]|[0-9]\s])[a-z]|[0-9]/i);
  const index = match === -1 ? 0 : match;

  const characters = string.toLowerCase().split('');
  characters[index] = characters[index].toUpperCase();

  return characters.join('');
}

function titleize(string: string) {
  const exceptions = ['and', 'of', 'the', 'ft', 'feat']; // words that should be lowercase
  const regex = new RegExp(`(?<![\\w\\d])${exceptions.join('|')}(?![\\w\\d])`, 'i');

  let words = string.split(' ');
  words = words.map((element, index) => {
    if (index === 0) return capitalize(element);
    if (element.match(regex)) return element.toLowerCase();
    return capitalize(element);
  });

  return words.join(' ');
}

function formatTime(duration: string | number) {
  if (isNaN(+duration)) return 'Unknown';

  const hours = Math.floor(+duration / 3600);
  const minutes = Math.floor((+duration % 3600) / 60);
  const seconds = Math.floor(+duration % 60);

  const units = [hours, minutes, seconds].map(String);
  units.forEach((element, index) => (units[index] = +element < 10 ? '0' + element : element));

  if (hours === 0) units.splice(0, 1);

  return units.join(':');
}

export { getErrorMessage, truncateString, capitalize, titleize, formatTime };

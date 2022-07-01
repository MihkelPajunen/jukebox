/* eslint-disable no-undef */
function capitalize(string) {
  const match = string.search(/(?<=[^[a-z]|[0-9]\s])[a-z]|[0-9]/i);
  const index = match === -1 ? 0 : match;

  const characters = string.toLowerCase().split('');
  characters[index] = characters[index].toUpperCase();

  return characters.join('');
}

function titleize(string) {
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

module.exports = { capitalize, titleize };

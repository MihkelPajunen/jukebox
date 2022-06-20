/* eslint-disable no-undef */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function titleize(string) {
  const exceptions = ['and', 'of', 'the'];

  let words = string.split(' ');
  words = words.map((element, index) => {
    if (index === 0) return capitalize(element);
    if (exceptions.includes(element.toLowerCase())) return element.toLowerCase();
    return capitalize(element);
  });

  return words.join(' ');
}

module.exports = { capitalize, titleize };


/**
 * A function to get all sizes and arrange them in one line
 * @param {*} array - an array of all values from the table
 * @param {*} elIndex - the index by which the size arrays are searched
 * @returns - string of sizes
*/
function getSizes(array, elIndex) {
  return (array.values.filter((row, index) => index > 3 && row[elIndex] !== undefined && row[elIndex] !== "")
  .map((row) => {
    return row[0];
  })).join(', ');
}

module.exports.getSizes = getSizes;
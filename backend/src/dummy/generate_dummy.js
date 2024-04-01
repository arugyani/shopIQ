function selectOneFromEachCategory(jsonString) {
  //temporary function that selects one filter from each catergory
  const data = JSON.parse(jsonString);
  let selectedElements = {};

  for (let category in data) {
    if (category === "Product rating") {
      continue;
    }
    if (data[category].length > 0) {
      selectedElements[category] = data[category][0];
    } else {
      selectedElements[category] = [];
    }
  }
  return selectedElements;
}
module.exports = { selectOneFromEachCategory };

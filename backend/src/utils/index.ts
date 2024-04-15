export const removeTicks = (inputString: string) => {
  let lines = inputString.split("\n");
  lines = lines.filter((line) => !line.includes("```"));
  let modifiedString = lines.join("\n");

  return modifiedString;
};

const variableRe = new RegExp("<@[a-zA-Z]*@>");

module.exports.replaceVariables = replaceVariables;
function replaceVariables(string, data = {}) {
  const match = string.match(variableRe);
  if (!match) return string;
  const varName = match[0].slice(2).slice(0, -2);
  if (!data[varName])
    return replaceVariables(
      string.replace(`<@${varName}@>`, `<@!${varName}!@>`),
      data,
    );
  else
    return replaceVariables(
      string.replace(`<@${varName}@>`, data[varName]),
      data,
    );
}

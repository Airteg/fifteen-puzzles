export function Log(label = "Some data", ...variables) {
  const data = variables.reduce((acc, variable, index) => {
    const name = Object.keys(variable)[0] || `arg${index + 1}`;
    acc[name] = variable[name];
    return acc;
  }, {});
  console.log(`🚀 ~ ${label}:`, data);
}

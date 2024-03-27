const extractSecondUrl = (str) => {
  // Use regular expression to check if the string looks like a URL
  // and if so, extract the second URL from it

  if (!str) return null;

  const strSplits = str.split("com");
  return strSplits[1];
};

export default extractSecondUrl;

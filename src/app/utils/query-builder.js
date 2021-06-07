export default (param) => {
  const searchParams = new URLSearchParams();

  Object.keys(param).forEach(key => searchParams.append(key, param[key]));

  return searchParams.toString();
};

export default async (url, options = {}) => {
  const response = await fetch(url, options);

  if (response.status !== 200) {
    throw new ResponseException('The response is invalid', response.status);
  }

  const data = await response.json();

  if (data.error) {
    throw data;
  }

  return data;
};

function ResponseException(info, status) {
  this.status = status;
  this.info = info;
}

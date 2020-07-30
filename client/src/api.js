function request(url) {
  return fetch(url, {
    method: "get",
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    });
}

function getAccountDetails() {
  const url = "/api/accountDetails";
  return request(url);
}

function deleteUser() {
  const url = "/api/deleteAccount";
  return request(url);
}

export { getAccountDetails, deleteUser };

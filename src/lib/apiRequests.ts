export function getRequest(url: string) {
  return fetch(url).then((resp) => resp.json());
}

export function deleteRequest(url: string) {
  return fetch(url, { method: "DELETE" }).then((resp) => resp.json());
}

export function updateRequest(url: string, data: any) {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((resp) => resp.json());
}

export function postRequest(url: string, data: any) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((resp) => resp.json());
}

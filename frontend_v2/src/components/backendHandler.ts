export const backend_url = "http://localhost:5000/api";

const refreshjwtToken = async () : Promise<boolean> => {
  const response = await fetch(backend_url + "/auth/refreshJWT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
  });
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("jwt", data.jwt);
    return true;
  } else {
    console.error(
      "Failed to refresh token:",
      response.status,
      response.statusText
    );
    return false;
  }
};

export async function getBackend(url: string): Promise<any> {
  let response = await fetch(backend_url + url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    if (data.message != "Token expired") {
      console.error(
        "Failed to fetch",
        response.status,
        response.statusText
      );
      throw new Error(`Failed to fetch, ${response.status}, ${response.statusText}`);
    }
    const refreshed = await refreshjwtToken();
    if (refreshed) {
      return await getBackend(url);
    }
  }
  return data;
}
export async function postBackend(url: string, body: string): Promise<any> {
  let response = await fetch(backend_url + url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json",
    },
    body: body,
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.message != "Token expired") {
      console.error(
        "Failed to fetch",
        response.status,
        response.statusText
      );
      throw new Error(`Failed to fetch, ${response.status}, ${response.statusText}`);
    }
    const refreshed = await refreshjwtToken();
    if (refreshed) {
      return await postBackend(url, body);
    }
  }
  return data;
}

export async function signup(
  email: string,
  password: string,
  nickname: string
) {
  const url = backend_url + "/auth/signup";
  const body = {
    email: email,
    password: password,
    nickname: nickname,
  };
  console.log("body", body);
  console.log("url", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("refreshToken", data.refreshToken);
  } catch (error) {
    console.error(error);
  }
}
export async function signin(email: string, password: string) {
  const url = backend_url + "/auth/login";
  const body = {
    email: email,
    password: password,
  };
  console.log("body", body);
  console.log("url", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("refreshToken", data.refreshToken);
  } catch (error) {
    console.error(error);
  }
}

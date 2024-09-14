export const backend_url = "http://localhost:5000/api";

const refreshRefreshToken = async (): Promise<boolean> => {
  const response = await fetch(backend_url + "/auth/newRefreshToken", {
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
    localStorage.setItem("refreshToken", data.refreshToken);
    return true;
  } else {
    console.error(
      "Failed to refresh Refresh-Token:",
      response.status,
      response.statusText
    );
    return false;
  }
};

const refreshjwtToken = async (): Promise<boolean> => {
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
      console.error("Failed to fetch", response.status, response.statusText);
      throw new Error(
        `Failed to fetch, ${response.status}, ${response.statusText}`
      );
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
      console.error("Failed to fetch", response.status, response.statusText);
      throw new Error(
        `Failed to fetch, ${response.status}, ${response.statusText}`
      );
    }
    const refreshed = await refreshjwtToken();
    if (refreshed) {
      return await postBackend(url, body);
    }
  }
  return data;
}
export async function putBackend(url: string, body: string): Promise<any> {
  let response = await fetch(backend_url + url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json",
    },
    body: body,
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.message != "Token expired") {
      console.error("Failed to fetch", response.status, response.statusText);
      throw new Error(
        `Failed to fetch, ${response.status}, ${response.statusText}`
      );
    }
    const refreshed = await refreshjwtToken();
    if (refreshed) {
      return await postBackend(url, body);
    }
  }
  return data;
}
export async function deleteBackend(url: string): Promise<any> {
  let response = await fetch(backend_url + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json",
    }
  });

  const data = await response.json();
  if (!response.ok) {
    if (data.message != "Token expired") {
      console.error("Failed to fetch", response.status, response.statusText);
      throw new Error(
        `Failed to fetch, ${response.status}, ${response.statusText}`
      );
    }
    const refreshed = await refreshjwtToken();
    if (refreshed) {
      return await deleteBackend(url);
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
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("refreshToken", data.refreshToken);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function signin(email: string, password: string) {
  const url = backend_url + "/auth/login";
  const body = {
    email: email,
    password: password,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      alert("Fehler! Email oder Passwort falsch");
      return;
    }

    const data = await response.json();
    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("refreshToken", data.refreshToken);
  } catch (error) {
    alert("Fehler! Keine Verbindung zum Server!");
    console.error(error);
  }
}
function getUserIdFromJWT(token: string): string {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("The token is invalid");
    }

    // Decode the payload
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/_/g, "/").replace(/-/g, "+"));

    // Parse the payload
    const payloadObj = JSON.parse(decodedPayload);

    // Extract the userId (assuming it's stored as 'userId' in the token payload)
    const userId = payloadObj.userId;

    return userId;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    throw new Error("couldn't decode jwt");
    
  }
}
export function getMyUserID(): number {
  return parseInt(getUserIdFromJWT(localStorage.getItem("jwt") as string));
}

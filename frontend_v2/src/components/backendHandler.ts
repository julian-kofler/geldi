const backend_url = "http://localhost:5000/api";

export async function signup(email: string, password: string, nickname: string) {
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
  const url = backend_url + "/auth/signup";
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
import axios from "axios";

// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/*Make API request*/

/*Authenticate function*/
export async function authenticateUser(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "User name doesn't exist" };
  }
}

/*Get user data function*/
export async function getUser(username) {
  try {
    const { data, status } = await axios.get(
      `http://localhost:8080/api/user/${username}`
    );
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}

/*Register function*/
export async function registerUser(newUserData) {
  try {
    //register user
    const { data, status } = await axios.post(
      "http://localhost:8080/api/register",
      newUserData
    );
    //send Mail
    let { username, email } = newUserData;
    if (status === 201)
      await axios.post("http://localhost:8080/api/registerSendMail", {
        username,
        email,
      });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}

/*Login function*/
export async function loginUser({ username, password }) {
  try {
    if (username) {
      const { data, status } = await axios.post(
        "http://localhost:8080/api/login",
        {
          username,
          password,
        }
      );
      return Promise.resolve({ data, status });
    }
  } catch (error) {
    return Promise.reject({ error });
  }
}

/*Update function*/
export async function updateUser(userUpdateData) {
  try {
    //Get the JWT token from usere localstorge
    const token = JSON.parse(localStorage.getItem("token"));
    const { data, status } = await axios.put(
      "http://localhost:8080/api/updateuser",
      userUpdateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}

/*Generate OTP*/
export async function generateOTP(username) {
  try {
    const {
      data: { OTP },
      status,
    } = await axios.get(
      `http://localhost:8080/api/generateOTP?username=${username}`
    );
    console.log(OTP);

    //send Mail with OTP
    if (status === 201) {
      const {
        data: {
          user: { email },
        },
      } = await axios.get(`http://localhost:8080/api/user/${username}`);
      console.log(email);
      await axios.post("http://localhost:8080/api/recoverPasswordMail", {
        username,
        email,
        OTP,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function verifyOTP({ username, OTP }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, OTP },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function resetPassword({ username, newPassword }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password: newPassword,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}

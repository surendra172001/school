import axios from "axios";

/*
VARIABLES
*/
export const API = process.env.REACT_APP_BACKEND;

export const ROLES = {
  TEACHER: 0,
  ADMIN: 1,
};
export const RELIGIONS = ["HINDU", "MOMEDIAN", "OTHER"];
export const SEX = ["MALE", "FEMALE", "OTHER"];
export const NATIONALITY = ["INDIAN", "NRI", "OTHER"];
export const FEESCHEMES = ["1TIMEPAY", "2TIMEPAY", "3TIMEPAY", "OTHER"];
export const BLOODGROUPS = [
  "NA",
  "A+",
  "B+",
  "AB+",
  "O+",
  "A-",
  "B-",
  "AB-",
  "O-",
];

export const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", null];

/*
FUNCTIONS
*/
export const signIn = async (email, password) => {
  try {
    const multipartBody = new FormData();
    multipartBody.set("email", email);
    multipartBody.set("password", password);
    const URL = API + "/signin";
    const result = await postData(URL, "", multipartBody);
    return result["data"];
  } catch (error) {
    console.log(error);
  }
};

export const authenticate = (signinData) => {
  if (typeof window !== undefined) {
    localStorage.setItem("jwt", JSON.stringify(signinData));
  }
};

export const isSignedIn = () => {
  if (typeof window !== undefined) {
    const signinData = localStorage.getItem("jwt");
    if (signinData) {
      return JSON.parse(signinData);
    } else {
      return false;
    }
  }
  return false;
};

export const signOut = () => {
  if (typeof window !== undefined) {
    localStorage.removeItem("jwt");
    return fetchData(API + "/signout", "");
  }
};

export const getToken = () => {
  const userData = localStorage.getItem("jwt");
  if (userData) {
    return JSON.parse(userData)["token"];
  }
};

export async function fetchData(url, token) {
  const options = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  try {
    const result = await fetch(url, options);
    const data = await result.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function postData(URL, token, body) {
  try {
    const result = await axios.post(URL, body, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function fetchGrades() {
  const URL = API + "/allGrades";
  const token = getToken();
  const data = await fetchData(URL, token);
  return data;
}

export const checkAtleast3Years = (dob) => {
  const today = new Date();
  const age = Math.round((today - dob) / (1000 * 60 * 60 * 24));
  return age >= 3;
};

/*

function AppUtil() {
  const [grades, setGrades] = useState([]);
  const [value, setValue] = useState("");

  async function populateGrades() {
    const url = "http://localhost:8000/allGrades";
    const data = await fetchData(url, token);
    setGrades(data);
  }

  const checkConnection = () => {
    populateGrades();
  };

  useEffect(checkConnection, [value]);
  return (
    <div className="App">
      <h1>Frontend Start</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <pre>{JSON.stringify(grades)}</pre>
    </div>
  );
}
*/

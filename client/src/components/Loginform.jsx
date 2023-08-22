import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Matches from "../components/Matches";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "test",
    password: "test",
  });

  const [data, setData] = useState(null);

  const { username, password } = credentials;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const login = async () => {
    try {
      // axios is just a fetch request wor
      const { data } = await axios("/api/login/auth", {
        method: "POST",
        data: credentials,
      });

      //store it locally localStorage mini DB in the front end
      // methods setItem, getItem ... we can add things there with keys and values
      localStorage.setItem("token", data.token); // key name "token", value data.token

      console.log(data.message, data.token);
      // what is data
      setData(data.message);
      navigate("/matches");
    } catch (error) {
      console.log(error);
      setData(error.message);
    }
  };

  // log out is to delete the info inside
  const logout = () => {
    localStorage.removeItem("token");
  };

  const requestData = async () => {
    try {
      const { data } = await axios("/api/auth/profile", {
        headers: {
          //    authorization             you pass the key
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setData(data.message);
      console.log(data.message);
    } catch (error) {
      console.log(error);
      setData(error.message);
    }
  };

  return (
    <div>
      <div>
        <input
          value={username}
          onChange={handleChange}
          name="username"
          type="text"
          className="form-control mb-2"
        />
        <input
          value={password}
          onChange={handleChange}
          name="password"
          type="password"
          className="form-control mb-2"
        />
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-primary" onClick={login}>
            Log in
          </button>
          <button className="btn btn-outline-dark ml-2" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
      {/* <div className="text-center p-4">
        <button className=" btn btn-outline-primary" onClick={requestData}>
          Request protected data
        </button>
      </div> */}

      {data && (
        <div className="text-center p-4">
          <div className="alert">{data}</div>
        </div>
      )}
    </div>
  );
}

export default Login;

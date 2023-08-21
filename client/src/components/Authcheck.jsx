import { useState } from "react";

export default function Authcheck() {
  const [user, SetUser] = useState({
    username: "",
    password: "",
  });
  //   const [username, SetUsername] = useState("");
  //   const [password, SetPasword] = useState("");

  const handleChange = (event) => {
    SetUser((previnfo) => ({
      ...previnfo,
      [event.target.name]: event.target.value,
    }));
  };
  return (
    <div className="authcheck">
      <form>
        <label>username</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
        />
        <label>password</label>
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}

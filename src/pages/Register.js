import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();

    alert(`Account created for ${name}`);
  };

  return (
    <div>
      <h1>Create Your Account</h1>

      <form onSubmit={handleRegister}>
        <div>
          <label>Full Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <br />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
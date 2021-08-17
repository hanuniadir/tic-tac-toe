import "./Login.css";
import { useState } from "react";
import { TextField, Card } from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import axios from "axios";

export default function Login(props: any) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    axios.post("https://d9u7x85vp9.execute-api.us-east-2.amazonaws.com/production/auth",
      { email: email })
      .then((data: any) => {
        sessionStorage.setItem("token", data.data.token);
        console.log(`loginResponse, sessionStorage set with token value: ${data.data.token}`);
        props.updateSession();
      })
      .catch(console.error);
  };

  const validateEmail = () => {
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(email);
  };

  return (
    <Card className="loginCard">
      <CardContent>
        <TextField
          className="emailArea"
          label="Email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="search"
          variant="outlined"
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={() => handleSubmit()}
          disabled={!validateEmail()}
          size="small"
          color="primary"
        >
          Sign In
        </Button>
      </CardActions>
    </Card>
  );
}

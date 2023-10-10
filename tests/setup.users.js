import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "1m", target: 100 }, // Ramp-up to 100 users in 1 minute
    { duration: "5m", target: 1 }, // Stay at 100 users for 5 minutes
    { duration: "1m", target: 0 }, // Ramp-down to 0 users in 1 minute
  ],
};

// Step 1: Create unique credentials for all users only once

export default function () {
  let userCredentials = [];

  for (let i = 0; i < 100; i++) {
    const index = Math.floor(Math.random() * 100);
    let uniqueRegNo = "ABDEFaD" + index + "H";
    let uniqueEmail = "hello" + index + "@xyz.email.com";
    let uniquePassword = "HELLO" + index;

    userCredentials.push({
      regNo: uniqueRegNo,
      email: uniqueEmail,
      password: uniquePassword,
    });

    // Sign up each user
    let newUserPayload = {
      name: "Test",
      regNo: uniqueRegNo,
      email: uniqueEmail,
      password: uniquePassword,
    };

    let signupResponse = http.post(
      "http://localhost:8080/auth/signup",
      JSON.stringify(newUserPayload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(signupResponse.body);
    check(signupResponse, {
      "Signup successful": (r) => r.status === 201,
    });
  }

  // Sleep for a short random duration between 1 to 3 seconds
  sleep(Math.random() * 2 + 1);
}

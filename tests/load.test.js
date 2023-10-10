import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "2m", target: 50 }, // Ramp-up to 100 users in 1 minute
    { duration: "15m", target: 50 }, // Stay at 100 users for 5 minutes
    { duration: "10m", target: 0 }, // Ramp-down to 0 users in 1 minute
  ],
};

// Step 1: Create unique credentials for all users only once
let userCredentials = [];

export function setup() {
  for (let i = 0; i < 100; i++) {
    let uniqueRegNo = "ABDEFaD" + i + "H";
    let uniqueEmail = "hello" + i + "@xyz.email.com";
    let uniquePassword = "HELLO" + i;

    userCredentials.push({
      name: "Henry",
      regNo: uniqueRegNo,
      email: uniqueEmail,
      password: uniquePassword,
    });
  }
  // Store userCredentials in the K6 VU context
  return { userCredentials };
}

export default function (data) {
  let userCredentials = data.userCredentials;
  // Step 2: Have each virtual user hit the login and refresh routes multiple times

  // Login with unique user credentials
  const index = Math.floor(Math.random() * userCredentials.length);

  let loginResponse = http.post(
    "https://api-cookoff-prod.codechefvit.com/auth/login",
    JSON.stringify(userCredentials[index]),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(loginResponse, {
    "login is successful": (r) => r.status === 200,
  });
  console.log(loginResponse.body);

  // Hit the refresh route with the obtained refresh token multiple times
  for (let j = 0; j < 5; j++) {
    let refreshTokenPayload = {
      refreshToken: JSON.parse(loginResponse.body).refreshToken,
    };

    let refreshResponse = http.post(
      "https://api-cookoff-prod.codechefvit.com/auth/refresh",
      JSON.stringify(refreshTokenPayload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    check(refreshResponse, {
      "token refresh is successful": (r) => r.status === 201,
    });
    console.log(__VU);
    console.log(JSON.parse(refreshResponse.body).accessToken);
    let accessToken = JSON.parse(refreshResponse.body).accessToken;
    for (let j = 0; j < 5; j++) {
      let protectedResponse = http.get(
        "https://api-cookoff-prod.codechefvit.com/auth/dashboard",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      check(protectedResponse, {
        "token refresh is successful": (r) => r.status === 200,
      });
      console.log(__VU);
      console.log(protectedResponse.body);
      let evalResponse = http.post(
        "https://api-cookoff-prod.codechefvit.com/submit/eval",
        JSON.stringify({
          question_id: "650f8829e7566b329d8f3373",
          language_id: 71,
          code: 'a = input()\nprint("0")\nprint("1' + j + '")',
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      check(evalResponse, {
        "eval is successful": (r) => r.status === 201,
      });
      console.log(evalResponse.body);
    }
  }

  // Sleep for a short random duration between 1 to 3 seconds
  sleep(Math.random() * 2 + 1);
}

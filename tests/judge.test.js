import http from "k6/http";
import { check, sleep, group } from "k6";

export let options = {
  stages: [
    { duration: "1m", target: 200 }, // Ramp up to 100 users in 1 minute
    { duration: "9m", target: 200 }, // Maintain 500 users for 9 minutes
  ],
};

export default function () {
  // Define the batch submission payload
  const batchSubmissionPayload = {
    submissions: [
      {
        source_code:
          '#include <stdio.h>\nint main() {\n    int sum = 0;\n    for (int i = 1; i <= 10000; i++) {\n        sum += i;\n    }\n    printf("Sum of numbers from 1 to 10000: %d\\n", sum);\n    return 0;\n}',
        language_id: 50,
        input: "",
      },
      {
        source_code:
          '#include <stdio.h>\nint main() {\n    int factorial = 1;\n    for (int i = 1; i <= 10; i++) {\n        factorial *= i;\n    }\n    printf("Factorial of 10: %d\\n", factorial);\n    return 0;\n}',
        language_id: 50,
        input: "",
      },
      {
        source_code:
          '#include <stdio.h>\nint main() {\n    int n = 20;\n    long long fib[20];\n    fib[0] = 0;\n    fib[1] = 1;\n    for (int i = 2; i < n; i++) {\n        fib[i] = fib[i - 1] + fib[i - 2];\n    }\n    printf("Fibonacci series up to 20 terms:\\n");\n    for (int i = 0; i < n; i++) {\n        printf("%lld ", fib[i]);\n    }\n    return 0;\n}',
        language_id: 50,
        input: "",
      },
      {
        source_code:
          '#include <stdio.h>\nint main() {\n    int n = 1000;\n    int is_prime;\n    printf("Prime numbers up to 1000:\\n");\n    for (int i = 2; i <= n; i++) {\n        is_prime = 1;\n        for (int j = 2; j <= i / 2; j++) {\n            if (i % j == 0) {\n                is_prime = 0;\n                break;\n            }\n        }\n        if (is_prime) {\n            printf("%d ", i);\n        }\n    }\n    return 0;\n}',
        language_id: 50,
        input: "",
      },
      {
        source_code:
          '#include <stdio.h>\nint main() {\n    int n = 5;\n    int a = 0, b = 1, next;\n    printf("Fibonacci series up to 5 terms:\\n");\n    for (int i = 1; i <= n; i++) {\n        if (i == 1) {\n            printf("%d ", a);\n            continue;\n        }\n        if (i == 2) {\n            printf("%d ", b);\n            continue;\n        }\n        next = a + b;\n        a = b;\n        b = next;\n        printf("%d ", next);\n    }\n    return 0;\n}',
        language_id: 50,
        input: "",
      },
      {
        source_code:
          '#include <stdio.h>\nint main() {\n    int num, reversed_num = 0, remainder;\n    printf("Enter an integer: ");\n    scanf("%d", &num);\n    while (num != 0) {\n        remainder = num % 10;\n        reversed_num = reversed_num * 10 + remainder;\n        num /= 10;\n    }\n    printf("Reversed number: %d\\n", reversed_num);\n    return 0;\n}',
        language_id: 50,
        input: "",
      },
    ],
  };

  // Iterate through each user

  const headers = {
    "Content-Type": "application/json",
  };

  const createResponse = http.post(
    "https://judge0.codechefvit.com/submissions/batch",
    JSON.stringify(batchSubmissionPayload),
    { headers }
  );

  check(createResponse, {
    "Status is 200": (r) => r.status === 201,
  });

  const createdSubmissions = JSON.parse(createResponse.body);

  // Extract tokens from the created submissions
  const submissionTokens = createdSubmissions.map(
    (submission) => submission.token
  );

  // Step 2: Retrieve batch submissions using a single request
  const tokenString = submissionTokens.join(",");

  const retrieveResponse = http.get(
    `https://judge0.codechefvit.com/submissions/batch?tokens=${tokenString}&base64_encoded=false&fields=token,stdout,stderr,status_id,language_id`
  );
  console.log(retrieveResponse.body);
  check(retrieveResponse, {
    "Status is 200": (r) => r.status === 200,
  });

  // Sleep to simulate user think time (adjust as needed)
  sleep(2);
}

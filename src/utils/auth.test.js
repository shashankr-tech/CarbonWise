import { getTokenRole } from "./auth";

function createToken(payload) {
  const encode = (value) =>
    btoa(JSON.stringify(value))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.signature`;
}

beforeEach(() => {
  localStorage.clear();
});

test("reads the officer role from an unexpired JWT", () => {
  localStorage.setItem(
    "carbonWiseToken",
    createToken({
      role: "officer",
      exp: Math.floor(Date.now() / 1000) + 3600
    })
  );

  expect(getTokenRole()).toBe("officer");
});

test("reads the user role from an unexpired JWT", () => {
  localStorage.setItem(
    "carbonWiseToken",
    createToken({
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 3600
    })
  );

  expect(getTokenRole()).toBe("user");
});

test.each([
  ["a missing token", null],
  ["an invalid token", "not-a-jwt"],
  [
    "an expired token",
    createToken({ role: "officer", exp: Math.floor(Date.now() / 1000) - 1 })
  ],
  [
    "an unsupported role",
    createToken({ role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 })
  ]
])("returns no role for %s", (_description, token) => {
  if (token) {
    localStorage.setItem("carbonWiseToken", token);
  }

  expect(getTokenRole()).toBeNull();
});

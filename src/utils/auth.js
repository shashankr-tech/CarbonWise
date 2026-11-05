export function getTokenRole() {
  const token = localStorage.getItem("carbonWiseToken");

  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length !== 3 || !parts[1]) {
    return null;
  }

  try {
    const base64Payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const paddedPayload = base64Payload.padEnd(
      Math.ceil(base64Payload.length / 4) * 4,
      "="
    );
    const payload = JSON.parse(atob(paddedPayload));

    if (
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now() / 1000
    ) {
      return null;
    }

    return payload.role === "user" || payload.role === "officer"
      ? payload.role
      : null;
  } catch {
    return null;
  }
}

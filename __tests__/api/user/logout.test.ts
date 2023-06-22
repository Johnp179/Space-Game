import logout from "@/pages/api/user/logout";
import { createMocks } from "node-mocks-http";

describe("Tests for the logout API", () => {
  test("It should logout a user ", async () => {
    const { req, res } = createMocks();
    await logout(req as any, res as any);
    const cookieHeader = res._getHeaders()["set-cookie"]!;
    const cookie = cookieHeader[0].split(";")[0];
    expect(cookie).toBe("iron-session/examples/next.js=");
  });
});

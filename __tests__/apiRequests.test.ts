/**
 * @jest-environment jsdom
 */

import {
  getRequest,
  updateRequest,
  deleteRequest,
  postRequest,
} from "@/lib/apiRequests";

declare global {
  interface Window {
    fetch: any;
  }
}

describe("Tests for get requests", () => {
  test("It should return data", async () => {
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status: 200,
        ok: true,
        async json() {
          return data;
        },
      };
    });
    const result = await getRequest("/some-random-url");
    expect(result).toBe(data);
  });
  test("It should fail", async () => {
    const status = 500;
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status,
        ok: false,
        async json() {
          return data;
        },
      };
    });

    expect.assertions(1);
    try {
      await getRequest("/some-random-url");
    } catch (error) {
      const errorString = `Server responded with ${status} code`;
      expect((error as Error).message).toBe(errorString);
    }
  });
});

describe("Tests for delete requests", () => {
  test("It should return data", async () => {
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status: 200,
        ok: true,
        async json() {
          return data;
        },
      };
    });
    const result = await deleteRequest("/some-random-url");
    expect(result).toBe(data);
  });
  test("It should fail", async () => {
    const status = 400;
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status,
        ok: false,
        async json() {
          return data;
        },
      };
    });

    expect.assertions(1);
    try {
      await deleteRequest("/some-random-url/id");
    } catch (error) {
      const errorString = `Server responded with ${status} code`;
      expect((error as Error).message).toBe(errorString);
    }
  });
});

describe("Tests for update requests", () => {
  test("It should return data", async () => {
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status: 200,
        ok: true,
        async json() {
          return data;
        },
      };
    });
    const result = await updateRequest("/some-random-url/id", {
      data: "hello world",
    });
    expect(result).toBe(data);
  });
  test("It should fail", async () => {
    const status = 400;
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status,
        ok: false,
        async json() {
          return data;
        },
      };
    });

    expect.assertions(1);
    try {
      await updateRequest("/some-random-url/id", { data: "hello world" });
    } catch (error) {
      const errorString = `Server responded with ${status} code`;
      expect((error as Error).message).toBe(errorString);
    }
  });
});

describe("Tests for post requests", () => {
  test("It should return data", async () => {
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status: 200,
        ok: true,
        async json() {
          return data;
        },
      };
    });
    const result = await postRequest("/some-random-url", {
      data: "hello world",
    });
    expect(result).toBe(data);
  });
  test("It should fail", async () => {
    const status = 405;
    const data = "some random data";
    window.fetch = jest.fn(async () => {
      return {
        status,
        ok: false,
        async json() {
          return data;
        },
      };
    });

    expect.assertions(1);
    try {
      await postRequest("/some-random-url", { data: "hello world" });
    } catch (error) {
      const errorString = `Server responded with ${status} code`;
      expect((error as Error).message).toBe(errorString);
    }
  });
});

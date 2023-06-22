import { connectDB, disconnectDB } from "@/database/dbConnect";
import Comment from "@/database/models/Comment";
import getAndAlterComments from "@/pages/api/comments/[id]";
import { createMocks } from "node-mocks-http";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests for get requests  ", () => {
  test("It should retrieve a comment  ", async () => {
    const data = {
      author: "john",
      content: "this is a test comment",
    };
    const comment = new Comment(data);
    await comment.save();

    const { req, res } = createMocks({
      query: {
        id: comment._id.toString(),
      },
    });
    await getAndAlterComments(req as any, res as any);
    const { author, content } = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect({
      author,
      content,
    }).toEqual(data);
  });

  test("it should fail because the id does not exist", async () => {
    const { req, res } = createMocks({
      query: {
        id: "6463ec4a989a3468b5d8adc1",
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("it should fail because of a cast error", async () => {
    const { req, res } = createMocks({
      query: {
        id: "6463ec4a989a3468b5d",
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

describe("Tests for delete requests ", () => {
  const method = "DELETE";
  test("it should delete a high score", async () => {
    const comment = new Comment({
      author: "john",
      content: "this is a test comment",
    });
    await comment.save();

    const { req, res } = createMocks({
      method,
      query: {
        id: comment._id.toString(),
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
  });

  test("it should fail because the id does not exist", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b5d8adc1",
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("it should fail because of a cast error", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b5d",
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

describe("Tests for update requests ", () => {
  const method = "PUT";
  test("it should update a high score", async () => {
    const comment = new Comment({
      author: "john",
      content: "some silly content",
    });

    await comment.save();

    const { req, res } = createMocks({
      method,
      query: {
        id: comment._id.toString(),
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
  });

  test("it should fail because the id does not exist", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b5d8adc1",
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("it should fail because of a cast error", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b",
      },
    });
    await getAndAlterComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

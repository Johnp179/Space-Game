export default class NotFoundError extends Error {
  name = "NotFoundError";
  constructor(msg: string) {
    super(msg);
  }
}

import Nav from "@/components/Nav";
import { FormEvent } from "react";

export default function Comments() {
  function doStuff(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(e.currentTarget.username.value);
  }
  return (
    <>
      <Nav />
      <div className="flex min-h-screen w-full justify-center items-center">
        <form onSubmit={doStuff}>
          <button>Click me</button>
        </form>
      </div>
    </>
  );
}

import Nav from "@/components/Nav";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { IRegisterError } from "./api/user/register";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

const usernameErrorMsg = "Minimum of 5 characters";
const passwordErrorMsg = {
  length: "Minimum of 6 characters",
  letter: "Must include a lowercase letter",
  number: "Must include a number",
};
const confirmPasswordErrorMsg = "Passwords must match";

export default function Register() {
  const router = useRouter();
  const [usernameClientError, setUsernameClientError] =
    useState(usernameErrorMsg);
  const [emailClientError, setEmailClientError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([
    passwordErrorMsg.length,
    passwordErrorMsg.letter,
    passwordErrorMsg.number,
  ]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState<IRegisterError>({
    username: false,
    email: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const errorMsgStyle = `text-xs ${formSubmitted ? "text-red-500" : ""}
  `;

  function checkUsername() {
    const usernameSchema = z.string().min(5, usernameErrorMsg);
    try {
      usernameSchema.parse(usernameRef.current?.value);
      setUsernameClientError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameClientError(error.format()._errors[0]);
      }
    }
  }

  function checkEmail() {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(emailRef.current?.value);
      setEmailClientError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailClientError(error.format()._errors[0]);
      }
    }
  }

  function checkPassword() {
    const passwordSchema = z
      .string()
      .min(6, passwordErrorMsg.length)
      .regex(/[a-z]/, passwordErrorMsg.letter)
      .regex(/\d/, passwordErrorMsg.number);
    try {
      passwordSchema.parse(passwordRef.current?.value);
      setPasswordErrors([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordErrors(error.format()._errors);
      }
    }
  }
  function checkConfirmPassword() {
    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      return setConfirmPasswordError(confirmPasswordErrorMsg);
    }
    setConfirmPasswordError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormSubmitted(true);

    if (
      !usernameClientError &&
      !emailClientError &&
      !passwordErrors.length &&
      !confirmPasswordError
    ) {
      const newUser = {
        username: usernameRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      };

      const resp = await fetch(`/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!resp.ok) {
        const { error } = await resp.json();
        if (resp.status === 500) {
          return console.error(error);
        }
        return setServerError(error);
      }

      router.push("/profile");
    }
  }

  return (
    <>
      <Nav />
      <main className="h-screen flex justify-center items-center ">
        <form
          onSubmit={handleSubmit}
          className="p-7 bg-slate-700 space-y-5 rounded-md"
        >
          <label className="block">
            <span className="block">Username</span>
            <input
              ref={usernameRef}
              type="text"
              className="rounded-sm text-black"
              onChange={() => {
                setServerError({ ...serverError, username: false });
                checkUsername();
              }}
            />
            <ul className={`${errorMsgStyle} h-7`}>
              <li>{usernameClientError}</li>
              <li>{serverError.username && "That username already exists"}</li>
            </ul>
          </label>
          <label className="block">
            <span className="block">Email</span>
            <input
              ref={emailRef}
              type="text"
              className="rounded-sm text-black"
              onChange={() => {
                setServerError({ ...serverError, email: false });
                checkEmail();
              }}
            />
            <ul className={`${errorMsgStyle} h-7`}>
              <li>{emailClientError}</li>
              <li>{serverError.email && "That email already exists"}</li>
            </ul>
          </label>
          <label className="block">
            <span className="block">Password</span>
            <input
              ref={passwordRef}
              type="password"
              className="rounded-sm text-black"
              onChange={() => checkPassword()}
            />
            <ul className={`${errorMsgStyle} h-10`}>
              {passwordErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </label>
          <label className="block">
            <span className="block">Confirm Password</span>
            <input
              ref={confirmPasswordRef}
              type="password"
              className="rounded-sm text-black"
              onChange={() => checkConfirmPassword()}
            />
            <ul className={`${errorMsgStyle} h-7`}>
              <li>{confirmPasswordError}</li>
            </ul>
          </label>
          <button className="block mx-auto border py-1 px-2 rounded-sm uppercase hover:bg-neutral-200 hover:text-black">
            sign in
          </button>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(({ req, res }) => {
  const { user } = req.session;

  if (user) {
    res.setHeader("location", "/");
    res.statusCode = 307;
    res.end();
  }

  return {
    props: {},
  };
}, sessionOptions);

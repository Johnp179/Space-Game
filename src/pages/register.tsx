import AuthNav from "@/components/nav/AuthNav";
import WrapperForm from "@/components/WrapperForm";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { RegisterError } from "./api/user/register";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { postRequest } from "@/lib/apiRequests";
import { useErrorBoundary } from "react-error-boundary";
import DnaLoading from "@/components/DnaLoading";

const usernameErrorMsg = "Minimum of 5 characters";
const passwordErrorMsgs = [
  "Minimum of 6 characters",
  "Must include a lowercase letter",
  "Must include a number",
];
const confirmPasswordErrorMsg = "Passwords must match";

export default function Register() {
  const { showBoundary } = useErrorBoundary();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usernameClientError, setUsernameClientError] =
    useState(usernameErrorMsg);
  const [emailClientError, setEmailClientError] = useState("");
  const [passwordErrors, setPasswordErrors] =
    useState<string[]>(passwordErrorMsgs);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState<RegisterError>({
    username: false,
    email: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  function checkUsername() {
    const usernameSchema = z.string().min(5, usernameErrorMsg);
    try {
      usernameSchema.parse(usernameRef.current!.value);
      setUsernameClientError("");
    } catch (error) {
      setUsernameClientError((error as z.ZodError).format()._errors[0]);
    }
  }

  function checkEmail() {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(emailRef.current!.value);
      setEmailClientError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailClientError((error as z.ZodError).format()._errors[0]);
      }
    }
  }

  function checkPassword() {
    const passwordSchema = z
      .string()
      .min(6, passwordErrorMsgs[0])
      .regex(/[a-z]/, passwordErrorMsgs[1])
      .regex(/\d/, passwordErrorMsgs[2]);
    try {
      passwordSchema.parse(passwordRef.current!.value);
      setPasswordErrors([]);
    } catch (error) {
      setPasswordErrors((error as z.ZodError).format()._errors);
    }
  }

  function checkConfirmPassword() {
    if (passwordRef.current!.value !== confirmPasswordRef.current!.value) {
      return setConfirmPasswordError(confirmPasswordErrorMsg);
    }
    setConfirmPasswordError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    checkConfirmPassword();
    setFormSubmitted(true);

    if (
      !usernameClientError &&
      !emailClientError &&
      !passwordErrors.length &&
      !confirmPasswordError
    ) {
      setLoading(true);
      const newUser = {
        username: usernameRef.current!.value,
        email: emailRef.current!.value,
        password: passwordRef.current!.value,
      };

      try {
        const { error } = await postRequest("/api/user/register", newUser);
        setLoading(false);
        if (error) return setServerError(error as RegisterError);
        router.push("/profile");
      } catch (error) {
        showBoundary(error);
      }
    }
  }

  return (
    <>
      <AuthNav />
      <WrapperForm>
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
            <ul
              className={`text-fluid-s ${
                formSubmitted ? "text-red-500" : ""
              } h-7`}
            >
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
            <ul
              className={`text-fluid-s ${
                formSubmitted ? "text-red-500" : ""
              } h-7`}
            >
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
            <ul
              className={`text-fluid-s ${
                formSubmitted ? "text-red-500" : ""
              } h-16`}
            >
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
            <ul
              className={`text-fluid-s ${
                formSubmitted ? "text-red-500" : ""
              } h-7`}
            >
              <li>{confirmPasswordError}</li>
            </ul>
          </label>
          <div className="flex justify-center items-center">
            {loading ? (
              <DnaLoading />
            ) : (
              <button className="border py-1 px-2 rounded-sm uppercase hover:bg-neutral-200 hover:text-black">
                register
              </button>
            )}
          </div>
        </form>
      </WrapperForm>
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

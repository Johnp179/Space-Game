import { z } from "zod";
import AuthNav from "@/components/nav/AuthNav";
import WrapperForm from "@/components/WrapperForm";
import { FormEvent, useState, useRef } from "react";
import { LoginError } from "./api/user/login";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { postRequest } from "@/lib/apiRequests";
import { useErrorBoundary } from "react-error-boundary";
import DnaLoading from "@/components/DnaLoading";

const passwordClientErrorMsg = "Must not be empty";

export default function Login() {
  const { showBoundary } = useErrorBoundary();
  const router = useRouter();
  const [showClientErrors, setShowClientErrors] = useState({
    email: false,
    password: false,
  });
  const [emailClientError, setEmailClientError] = useState("Invalid email");
  const [passwordClientError, setPasswordClientError] = useState(
    passwordClientErrorMsg
  );
  const [serverError, setServerError] = useState<LoginError>({
    email: false,
    password: false,
    attempts: false,
    timeTillReset: 0,
  });
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  function checkEmail() {
    setShowClientErrors({ ...showClientErrors, email: true });
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(emailRef.current!.value);
      setEmailClientError("");
    } catch (error) {
      setEmailClientError((error as z.ZodError).format()._errors[0]);
    }
  }

  function checkPassword() {
    setShowClientErrors({ ...showClientErrors, password: true });
    const passwordSchema = z
      .string()
      .min(1, { message: passwordClientErrorMsg });
    try {
      passwordSchema.parse(passwordRef.current!.value);
      setPasswordClientError("");
    } catch (error) {
      setPasswordClientError((error as z.ZodError).format()._errors[0]);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowClientErrors({ email: true, password: true });
    setFormSubmitted(true);
    if (!emailClientError && !passwordClientError) {
      const user = {
        email: emailRef.current!.value,
        password: passwordRef.current!.value,
      };
      setLoading(true);

      try {
        const { error } = await postRequest("api/user/login", user);
        setLoading(false);
        if (error) return setServerError(error as LoginError);
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
            <span className="block">Email</span>
            <input
              type="email"
              ref={emailRef}
              className="rounded-sm text-black"
              onChange={() => {
                checkEmail();
                setServerError({ ...serverError, email: false });
              }}
            />
            <ul
              className={`h-7 text-fluid-s ${
                formSubmitted ? "text-red-500" : ""
              }`}
            >
              {showClientErrors.email && emailClientError}
              {serverError.email && <li>That email does not exist</li>}
            </ul>
          </label>
          <label className="block">
            <span className="block">Password</span>
            <input
              type="password"
              ref={passwordRef}
              className="rounded-sm text-black"
              onChange={() => {
                checkPassword();
                setServerError({
                  ...serverError,
                  password: false,
                  attempts: false,
                });
              }}
            />
            <ul
              className={`h-7 text-fluid-s ${
                formSubmitted ? "text-red-500" : ""
              }`}
            >
              <li>{showClientErrors.password && passwordClientError}</li>
              {serverError.password && <li>Incorrect password</li>}
              {serverError.attempts && <li>Too many attempts, please wait.</li>}
            </ul>
          </label>
          <div className="flex justify-center items-center">
            {loading ? (
              <DnaLoading />
            ) : (
              <button className="border py-1 px-2 rounded-sm uppercase hover:bg-neutral-200 hover:text-black">
                sign in
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

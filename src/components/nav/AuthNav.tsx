import Link from "next/link";
import NavLinks from "./NavLinks";
import WrapperNav from "./WrapperNav";
import { NextRouter, useRouter } from "next/router";
import { getRequest } from "@/lib/apiRequests";
import { useErrorBoundary } from "react-error-boundary";

export default function AuthNav() {
  const router = useRouter();

  return (
    <WrapperNav>
      <NavLinks />
      <div className="flex mr-2">
        {router.pathname === "/login" ? (
          <Register />
        ) : router.pathname === "/register" ? (
          <Login />
        ) : (
          <Logout router={router} />
        )}
      </div>
    </WrapperNav>
  );
}

function Login() {
  return (
    <Link href="/login" className="relative nav-auth p-2">
      Login
    </Link>
  );
}

function Register() {
  return (
    <Link href="/register" className="relative nav-auth p-2">
      Register
    </Link>
  );
}

function Logout({ router }: { router: NextRouter }) {
  const { showBoundary } = useErrorBoundary();

  async function logout() {
    try {
      await getRequest("api/user/logout");
      router.push("/");
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <button className="relative uppercase p-2 nav-auth" onClick={logout}>
      logout
    </button>
  );
}

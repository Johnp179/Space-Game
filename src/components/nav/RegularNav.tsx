import Link from "next/link";
import NavLinks from "./NavLinks";
import WrapperNav from "./WrapperNav";
import { IUser } from "@/lib/session";
import { getRequest } from "@/lib/apiRequests";
import { useErrorBoundary } from "react-error-boundary";

export default function RegularNav({
  user,
  setUser,
}: {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}) {
  return (
    <WrapperNav>
      <NavLinks />
      <div className="flex gap-3">
        {user ? (
          <AuthenticatedMenu setUser={setUser} />
        ) : (
          <UnauthenticatedMenu />
        )}
      </div>
    </WrapperNav>
  );
}

function UnauthenticatedMenu() {
  return (
    <div className="flex gap-3">
      <Link href="/login" className="relative nav-auth p-2">
        Login
      </Link>
      <Link href="/register" className="relative nav-auth p-2">
        Register
      </Link>
    </div>
  );
}

function AuthenticatedMenu({
  setUser,
}: {
  setUser: (user: IUser | null) => void;
}) {
  const { showBoundary } = useErrorBoundary();

  async function logout() {
    try {
      await getRequest("api/user/logout");
      setUser(null);
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <>
      <Link href="/profile" className="relative nav-auth p-2">
        Profile
      </Link>
      <button className="relative uppercase p-2 nav-auth" onClick={logout}>
        logout
      </button>
    </>
  );
}

import Link from "next/link";
import { IUser } from "@/lib/session";
import { useRouter } from "next/router";

export default function Nav({
  user,
  setUser,
}: {
  user?: IUser | null;
  setUser?: (user: IUser | null) => void;
}) {
  return (
    <nav className="fixed w-full uppercase flex justify-between text-2xl ">
      <div className="flex gap-1 ml-2">
        <Link href="/" className="relative nav-link p-2">
          Game
        </Link>
        <Link href="/high-scores" className="relative nav-link p-2">
          High-Scores
        </Link>
        <Link href="/comments" className="relative nav-link p-2">
          Comments
        </Link>
      </div>
      <div className="flex gap-1 mr-2">
        {user ? (
          <AuthenticatedMenu setUser={setUser} />
        ) : (
          <UnauthenticatedMenu />
        )}
      </div>
    </nav>
  );
}

function UnauthenticatedMenu() {
  const router = useRouter();
  const LoginLink = () => (
    <Link href="/login" className="relative nav-auth p-2">
      Login
    </Link>
  );
  const RegisterLink = () => (
    <Link href="/register" className="relative nav-auth p-2">
      Register
    </Link>
  );
  return (
    <>
      {router.pathname === "/login" ? (
        <RegisterLink />
      ) : router.pathname === "/register" ? (
        <LoginLink />
      ) : (
        <>
          <RegisterLink />
          <LoginLink />
        </>
      )}
    </>
  );
}

function AuthenticatedMenu({
  setUser,
}: {
  setUser?: (user: IUser | null) => void;
}) {
  const router = useRouter();
  const onProfilePage = router.pathname === "/profile";
  async function logout() {
    await fetch("/api/user/logout");
    if (setUser) setUser(null);
    if (onProfilePage) {
      router.push("/");
    }
  }

  const ProfileLink = () => (
    <Link href="/profile" className="relative nav-auth p-2">
      Profile
    </Link>
  );

  return (
    <>
      {!onProfilePage && <ProfileLink />}
      <button className="relative uppercase p-2 nav-auth" onClick={logout}>
        logout
      </button>
    </>
  );
}

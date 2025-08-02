import Link from "next/link";
import NavLinks from "./NavLinks";
import WrapperNav from "./WrapperNav";
import { useRouter } from "next/router";
import { getRequest } from "@/lib/apiRequests";
import { useErrorBoundary } from "react-error-boundary";

export default function AuthNav() {
  return (
    <WrapperNav>
      <NavLinks />
      <div className="flex mr-2">
        <Logout />
      </div>
    </WrapperNav>
  );
}

function Logout() {
  const router = useRouter();
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

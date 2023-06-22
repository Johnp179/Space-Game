import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import Nav from "@/components/Nav";
import { InferGetServerSidePropsType } from "next";

export default function Profile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Nav user={user} />
      <main className="h-screen flex justify-center items-center ">
        <form className="p-7 bg-slate-700 space-y-5 rounded-md">
          <label className="block">
            <span className="block">Username</span>
            <input
              type="text"
              className="rounded-sm text-black"
              value={user?.username}
              readOnly
            />
          </label>
          <label className="block">
            <span className="block">Email</span>
            <input
              type="email"
              className="rounded-sm text-black"
              value={user?.email}
              readOnly
            />
          </label>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(({ req, res }) => {
  const { user } = req.session;

  if (!user) {
    res.setHeader("location", "/login");
    res.statusCode = 307;
    res.end();
  }

  return {
    props: { user: user ?? null },
  };
}, sessionOptions);

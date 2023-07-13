import { ReactNode } from "react";

export default function WrapperNav({ children }: { children: ReactNode }) {
  return (
    <nav className="fixed w-full pt-2 px-2 uppercase flex justify-between text-fluid-l bg-inherit">
      {children}
    </nav>
  );
}

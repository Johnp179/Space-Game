import { ReactNode } from "react";

export default function WrapperForm({ children }: { children: ReactNode }) {
  return (
    <main className="h-screen flex justify-center items-center text-fluid-m">
      {children}
    </main>
  );
}

import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <main className="@container/main flex items-center justify-center flex-col min-h-screen">
      <h1 className="text-3xl font-bold">Welcome Home</h1>
      <Link href={"/dashboard"} className="text-xl font-bold">
        Dashboard
      </Link>
    </main>
  );
};

export default Home;

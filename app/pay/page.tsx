"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Pay() {
  const [state, setState] = useState("");
  const params = useSearchParams();

  useEffect(() => {
    console.log("Pay page loaded");
  }, []);

  return (
    <main>
      <h1>Página de pago</h1>
    </main>
  );
}

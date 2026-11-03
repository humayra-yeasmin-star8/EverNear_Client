"use client";
import { useEffect, useState } from "react";
import { updateEventAction, deleteEventAction } from "@/lib/actions";

export default function TestActionPage() {
  const [result, setResult] = useState<string>("running...");
  useEffect(() => {
    (async () => {
      const id = "6aea1036b716066bbca98d4b";
      const r1 = await updateEventAction(id, {
        title: "Updated by action",
        description: "desc",
        category: "Food Distribution",
        image: "https://example.com/img.jpg",
        location: "Dhaka",
        date: "DEC 01",
        time: "10:00",
      });
      setResult("update: " + JSON.stringify(r1));
      const r2 = await deleteEventAction(id);
      setResult((prev) => prev + " | delete: " + JSON.stringify(r2));
    })();
  }, []);
  return <div style={{padding:40,color:"white",background:"black"}}>{result}</div>;
}
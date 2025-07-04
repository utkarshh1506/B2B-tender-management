"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../tenders/page.css";

type Tender = {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
};

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check login token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch tenders
    fetch("http://localhost:3001/api/tender/all")
      .then((res) => res.json())
      .then((data) => {
        setTenders(data.tenders || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load tenders");
        setLoading(false);
      });
  }, []);

  const handleTenderClick = (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      router.push(`/tenders/${id}`);
    }
  };

  if (loading) return <p className="tenders-loading">Loading tenders...</p>;
  if (error) return <p className="tenders-error">{error}</p>;

  return (
    <div className="tenders-page">
      <div className="tenders-header">
        <h1>Tenders</h1>
        <nav className="tenders-nav">
          <Link href="/">Home</Link>
          {!isLoggedIn && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Register</Link>
            </>
          )}
        </nav>
      </div>

      <div className="tender-grid">
        {tenders.map((tender) => (
          <div key={tender.id} className="tender-card">
            <h2>{tender.title}</h2>
            <p>
              <strong>Description:</strong> {tender.description}
            </p>
            <p>
              <strong>Budget:</strong> ₹{tender.budget.toLocaleString()}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(tender.deadline).toLocaleDateString()}
            </p>
            <button
              className="bid-button"
              onClick={() => handleTenderClick(tender.id)}
            >
              Bid Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

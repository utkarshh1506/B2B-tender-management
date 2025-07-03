// ✅ File: src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./page.css";
type Application = {
  id: number;
  tender_id: number;
  company_id: number;
  proposed_budget: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
type Tender = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: number;
  created_at: string;
};
type Company = {
  id: number;
  name: string;
  industry: string;
  logo_url: string;
  user_id: number;
  created_at: string;
};

const Dashboard = () => {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [companyRes, appsRes, tendersRes] = await Promise.all([
          fetch("http://localhost:3001/api/companies/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/applications/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/tender/all"),
        ]);
        if (!companyRes.ok)
          console.error("❌ /companies/me failed", companyRes.status);
        if (!appsRes.ok)
          console.error("❌ /applications/me failed", appsRes.status);
        if (!tendersRes.ok)
          console.error("❌ /tender/all failed", tendersRes.status);

        if (!companyRes.ok || !appsRes.ok || !tendersRes.ok)
          throw new Error("Failed fetch");

        const companyData = await companyRes.json();
        const appsData = await appsRes.json();
        const tendersData = await tendersRes.json();

        setCompany(companyData.company);
        setApplications(appsData);
        setTenders(tendersData.tenders);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchData();
  }, [router, token]);

  const now = new Date();
  const sevenDaysLater = new Date(now);
  sevenDaysLater.setDate(now.getDate() + 7);

  const pending = applications.filter((app) => app.status === "pending").length;
  const approved = applications.filter(
    (app) => app.status === "approved"
  ).length;
  const openTenders = tenders.filter(
    (tender) => new Date(tender.deadline) > now
  ).length;
  const upcoming = tenders.filter((tender) => {
    const deadline = new Date(tender.deadline);
    return deadline > now && deadline <= sevenDaysLater;
  }).length;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        {company?.logo_url && (
          <Image
            src={company.logo_url}
            alt="Company Logo"
            width={80}
            height={80}
            className="company-logo"
          />
        )}
        <h2>{company?.name}</h2>
        <button onClick={() => router.push("/company/edit")}>
          Edit Profile
        </button>
        <button onClick={() => router.push("/dashboard/applications")}>
          My Applications
        </button>
        <button onClick={() => router.push("/tenders")}>Browse Tenders</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <h1>Welcome, {company?.name}</h1>

        <div className="cards-container">
          <div className="card">
            📄 Total Applications: {applications.length}
          </div>
          <div className="card">📝 Pending: {pending}</div>
          <div className="card">✅ Approved: {approved}</div>
          <div className="card">📂 Open Tenders: {openTenders}</div>
          <div className="card">📅 Closing Soon: {upcoming}</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

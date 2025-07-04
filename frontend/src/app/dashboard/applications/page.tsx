"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./page.css";

type Application = {
  id: number;
  proposal: string;
  proposed_budget: number;
  status: string;
  submitted_at: string;
  tender_id: number;
};

type Company = {
  id: number;
  name: string;
  logo_url: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [companyRes, appsRes] = await Promise.all([
          fetch("http://localhost:3001/api/companies/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/applications/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!companyRes.ok || !appsRes.ok) {
          console.error("Failed to load data");
          return;
        }

        const companyData = await companyRes.json();
        const appsData = await appsRes.json();

        setCompany(companyData.company);
        setApplications(appsData);
      } catch (err) {
        console.error("❌ Error fetching applications:", err);
      }
    };

    fetchData();
  }, []);

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
        <ul>
          <li onClick={() => router.push("/")}>Home</li>
          <li onClick={() => router.push("/dashboard")}>Dashboard</li>
          <li onClick={() => router.push("/dashboard/edit-profile")}>
            Edit Profile
          </li>
          <li onClick={() => router.push("/dashboard/applications")}>
            My Applications
          </li>
          <li onClick={() => router.push("/tenders")}>Browse Tenders</li>
          <li
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <h1>My Applications</h1>
        {applications.length === 0 ? (
          <p>No applications submitted yet.</p>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Proposal</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.proposal}</td>
                  <td>{app.proposed_budget}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

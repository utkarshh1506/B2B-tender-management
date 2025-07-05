"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./page.css";

type Company = {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  user_id: number;
  created_at: string;
};

export default function EditProfile() {
  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    password: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://b2b-tender-management.onrender.com/api/companies/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCompany(data.company);
        setFormData((prev) => ({
          ...prev,
          name: data.company.name,
          description: data.company.description,
        }));
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const uploadLogo = async () => {
      if (!logoFile) return;
      const form = new FormData();
      form.append("logo", logoFile);
      const res = await fetch(
        "https://b2b-tender-management.onrender.com/api/companies/upload-logo",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );
      const data = await res.json();
      return data.logo_url;
    };

    const logo_url = await uploadLogo();

    await fetch(`https://b2b-tender-management.onrender.com/api/companies/${company?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        logo_url,
        industry: "B2B",
      }),
    });

    router.push("/dashboard");
  };

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

      {/* Main Area */}
      <main className="main-content">
        <h1 className="heading">Edit Company Profile</h1>

        {company && (
          <form className="edit-form" onSubmit={handleSubmit}>
            {company.logo_url && (
              <Image
                src={company.logo_url}
                alt="Company Logo"
                width={150}
                height={150}
                className="logo"
              />
            )}

            <label>
              Logo:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </label>

            <label>
              Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </label>

            <label>
              Description:
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </label>

            <button type="submit" className="btn">
              Save Changes
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

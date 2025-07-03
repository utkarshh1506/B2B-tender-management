'use client'

import '../app/page.css'
import Link from 'next/link'


export default function Home() {
  return (
    <main>
      <header>
      <h1>Tender Services</h1>
      <div className='header'>
        <a href="/login">
          Login
        </a>
        <a href="/signup">
          Register
        </a>

      </div>
      </header>
      <section className='hero'>
        <h1 ><span>B2B Tender Management</span> Platform</h1>
        <p>A platform to manage and apply for business tenders.</p>
        <div className="hero-buttons">
          <Link href='/signup'><button>Register Your Company</button></Link>
          <Link href='/login'><button>Browse Tenders</button></Link>
          
        </div>
      </section>
      <section className="info">
        <h1>What is B2B Tender Management Platform?</h1>
        <p>
          The B2B Tender Management Platform is a streamlined solution designed for businesses to seamlessly manage the entire tendering lifecycle. Companies can register, set up detailed profiles, upload their logos, and publish tenders for products or services they need. Other companies can explore available tenders, submit proposals, and collaborate through a secure, role-based system. With features like company search, tender application tracking, and Supabase-powered image storage, this platform bridges businesses for faster and smarter procurement.
        </p>
      </section>
      <footer>
        <p>Made by Utkarsh Singh</p>
      </footer>
    </main>
    
  )
}

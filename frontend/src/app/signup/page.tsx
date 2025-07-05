'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../signup/page.css' // Create this CSS file

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    industry: '',
    description: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://b2b-tender-management.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed')
      } else {
        router.push('/login') // Redirect to login after signup
      }
    } catch(err){
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
        <div className='signup-card'>
            <h2>Register Your Company</h2>
      
            <form onSubmit={handleSubmit} className="signup-form">
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                <input type="text" name="name" placeholder="Company Name" required onChange={handleChange} />
                <input type="text" name="industry" placeholder="Industry" required onChange={handleChange} />
                <textarea name="description" placeholder="Company Description" rows={3} onChange={handleChange} />
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Sign Up'}
                </button>
            </form>
            <a href="/login">Already have an account?</a>
        </div>    
    </div>
  )
}



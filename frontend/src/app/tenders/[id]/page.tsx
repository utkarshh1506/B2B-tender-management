'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import './page.css'

type Tender = {
  id: number
  title: string
  description: string
  budget: number
  deadline: string
}

export default function TenderDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [tender, setTender] = useState<Tender | null>(null)
  const [proposal, setProposal] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/login')

    fetch(`http://localhost:3001/api/tender/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTender(data.tender)
      })
      .catch(() => setError('Failed to load tender'))
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    const budget = parseInt(price)
    if (!proposal || isNaN(budget) || budget <= 0) {
      return setError('Please enter a valid proposal and budget amount.')
    }

    // Debug log
    console.log({
      tender_id: parseInt(id as string),
      proposal,
      proposed_budget: budget
    })

    try {
      const res = await fetch('http://localhost:3001/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tender_id: parseInt(id as string),
          proposal,
          proposed_budget: budget,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        return setError(data.error || 'Submission failed')
      }

      setSuccess('Proposal submitted successfully!')
      setProposal('')
      setPrice('')
    } catch (err) {
      console.error('Submission error:', err)
      setError('Server error')
    }
  }

  if (!tender) return <p className="tender-loading">Loading...</p>

  return (
    <div className="tender-detail-page">
      <h1>{tender.title}</h1>
      <p><strong>Description:</strong> {tender.description}</p>
      <p><strong>Budget:</strong> ₹{tender.budget}</p>
      <p><strong>Deadline:</strong> {new Date(tender.deadline).toLocaleDateString()}</p>

      <form onSubmit={handleSubmit} className="bid-form">
        <h2>Submit Your Proposal</h2>
        <textarea
          required
          placeholder="Describe your proposal..."
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
        />
        <input
          type="number"
          min="1"
          placeholder="Proposed price"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">Submit Proposal</button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  )
}


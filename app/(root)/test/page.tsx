'use client'

import React, { useState, useEffect } from 'react'

const page = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const FetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('https://jsonplaceholder.typicode.com/users')

        if (!response) {
          throw new Error()
        }
        const data = await response.json()
        setUsers(data)
      } catch (error: any) {
        return console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
    FetchData()
  }, [])

  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>{user.name}</p>
            <p>{user.username}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default page

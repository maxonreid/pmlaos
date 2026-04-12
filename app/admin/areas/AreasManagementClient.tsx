'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../admin.module.css'

interface Area {
  id: string
  nameEn: string
  nameLo: string
  nameZh: string
  slug: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function AreasManagementClient() {
  const router = useRouter()
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    nameEn: '',
    nameLo: '',
    nameZh: '',
    active: true,
    order: 0,
  })

  useEffect(() => {
    fetchAreas()
  }, [])

  async function fetchAreas() {
    try {
      const res = await fetch('/api/areas')
      if (res.ok) {
        const data = await res.json()
        setAreas(data)
      }
    } catch (error) {
      console.error('Failed to fetch areas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!formData.nameEn || !formData.nameLo || !formData.nameZh) {
      alert('Please fill in all name fields')
      return
    }

    try {
      const res = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({ nameEn: '', nameLo: '', nameZh: '', active: true, order: 0 })
        setShowAddForm(false)
        fetchAreas()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create area')
      }
    } catch (error) {
      console.error('Failed to create area:', error)
      alert('Failed to create area')
    }
  }

  async function handleUpdate(area: Area) {
    try {
      const res = await fetch(`/api/areas/${area.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn: area.nameEn,
          nameLo: area.nameLo,
          nameZh: area.nameZh,
          active: area.active,
          order: area.order,
        }),
      })

      if (res.ok) {
        setEditingId(null)
        fetchAreas()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update area')
      }
    } catch (error) {
      console.error('Failed to update area:', error)
      alert('Failed to update area')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this area?')) return

    try {
      const res = await fetch(`/api/areas/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchAreas()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to delete area')
      }
    } catch (error) {
      console.error('Failed to delete area:', error)
      alert('Failed to delete area')
    }
  }

  function handleEdit(area: Area) {
    setEditingId(area.id)
  }

  function handleCancelEdit() {
    setEditingId(null)
    fetchAreas()
  }

  function updateArea(id: string, field: string, value: any) {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    )
  }

  if (loading) {
    return <div className={styles.stack}>Loading areas...</div>
  }

  return (
    <div className={styles.stack}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Area Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={styles.btn}
        >
          {showAddForm ? 'Cancel' : '+ Add Area'}
        </button>
      </div>

      {showAddForm && (
        <section className={styles.recordCard} style={{ marginBottom: '1.5rem' }}>
          <h3>Create New Area</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                English Name
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="e.g., Sikhottabong"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Lao Name
              </label>
              <input
                type="text"
                value={formData.nameLo}
                onChange={(e) => setFormData({ ...formData, nameLo: e.target.value })}
                placeholder="e.g., ສີໂຄດຕະບອງ"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Chinese Name
              </label>
              <input
                type="text"
                value={formData.nameZh}
                onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                placeholder="e.g., 西科塔蓬"
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                Active
              </label>
            </div>
            <button onClick={handleCreate} className={styles.btn}>
              Create Area
            </button>
          </div>
        </section>
      )}

      <section className={styles.recordList}>
        {areas.length === 0 ? (
          <p>No areas found.</p>
        ) : (
          areas.map((area) => {
            const isEditing = editingId === area.id

            return (
              <article key={area.id} className={styles.recordCard}>
                {isEditing ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        English Name
                      </label>
                      <input
                        type="text"
                        value={area.nameEn}
                        onChange={(e) => updateArea(area.id, 'nameEn', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Lao Name
                      </label>
                      <input
                        type="text"
                        value={area.nameLo}
                        onChange={(e) => updateArea(area.id, 'nameLo', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Chinese Name
                      </label>
                      <input
                        type="text"
                        value={area.nameZh}
                        onChange={(e) => updateArea(area.id, 'nameZh', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Order
                      </label>
                      <input
                        type="number"
                        value={area.order}
                        onChange={(e) => updateArea(area.id, 'order', parseInt(e.target.value) || 0)}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={area.active}
                          onChange={(e) => updateArea(area.id, 'active', e.target.checked)}
                        />
                        Active
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleUpdate(area)} className={styles.btn}>
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className={styles.btn}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.recordTop}>
                      <div>
                        <h2 className={styles.recordTitle}>{area.nameEn}</h2>
                        <p className={styles.recordSubtle}>
                          {area.nameLo} · {area.nameZh}
                        </p>
                        <p className={styles.recordMeta}>Slug: {area.slug} · Order: {area.order}</p>
                      </div>
                      <span className={`${styles.pill} ${area.active ? styles.active : ''}`}>
                        {area.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button onClick={() => handleEdit(area)} className={styles.btn}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
                        className={styles.btn}
                        style={{ background: '#dc2626' }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })
        )}
      </section>
    </div>
  )
}

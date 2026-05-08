import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Shared/Navbar'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'
// import { toast } from 'react-toastify'

const ProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get('/projects')
      setProjects(data)
    } catch (error) {
    //   toast.error("Error fetching projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/projects', { name, description })
    //   toast.success("Project created successfully!")
      setName('')
      setDescription('')
      setShowForm(false)
      fetchProjects()
    } catch (error) {
    //   toast.error("Failed to create project. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axiosInstance.delete(`/projects/${id}`)
        // toast.success("Project deleted")
        fetchProjects()
      } catch (error) {
        // toast.error("Failed to delete project")
      }
    }
  }

  // Filter logic for the search bar
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page-root">
      <Navbar />
      <div className="page-content">
        {/* Header Section */}
        <div className="navbar-inner" style={{ padding: 0, marginBottom: '24px', height: 'auto' }}>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? 'Cancel' : '+ New Project'}
            </button>
          )}
        </div>

        {/* Create Project Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="card" style={{ marginBottom: '24px' }}>
            <h3 className="font-bold mb-4">Create New Project</h3>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Project Name" 
              className="w-full border p-3 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-blue-400" 
              required 
            />
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Description" 
              className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400" 
              rows="3"
            />
            <button type="submit" className="btn btn-primary">Create Project</button>
          </form>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input 
            type="text"
            placeholder="Search projects by name..."
            className="w-full border p-3 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Projects Grid */}
        <div className="project-grid">
          {loading ? (
            // Simple Loading Skeleton
            [1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse h-48 bg-gray-200"></div>
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div key={project._id} className="card">
                <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
                <p className="text-gray-500 mt-2 text-sm line-clamp-2">{project.description}</p>
                <div className="mt-4 pt-4 border-t flex flex-col gap-1">
                   <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">
                     Owner: {project.owner?.name || 'Unknown'}
                   </p>
                </div>
                
                <div className="flex gap-3 mt-5">
                  <button 
                    onClick={() => navigate(`/projects/${project._id}`)} 
                    className="btn btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    View Tasks
                  </button>
                  {user?.role === 'admin' && (
                    <button 
                      onClick={() => handleDelete(project._id)} 
                      className="btn btn-danger" 
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400">No projects found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
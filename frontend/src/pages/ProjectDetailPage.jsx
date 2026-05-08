

// import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import Navbar from '../components/Shared/Navbar'
// import axiosInstance from '../api/axiosInstance'
// import { useAuth } from '../context/AuthContext'

// const STATUS = ['todo', 'in-progress', 'done']

// const ProjectDetailPage = () => {
//   const { id } = useParams()
//   const { user } = useAuth()
//   const [tasks, setTasks] = useState([])
//   const [users, setUsers] = useState([])
//   const [project, setProject] = useState(null)
//   const [showForm, setShowForm] = useState(false)
//   const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })
//   const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' })

//   const fetchData = async () => {
//     try {
//       const [taskRes, userRes, projectRes] = await Promise.all([
//         axiosInstance.get(`/projects/${id}/tasks`),
//         axiosInstance.get('/users'),
//         axiosInstance.get(`/projects/${id}`)
//       ])
//       setTasks(taskRes.data)
//       setUsers(userRes.data)
//       setProject(projectRes.data)
//     } catch (err) {
//       setStatusMsg({ type: 'error', text: 'Failed to sync with server' })
//     }
//   }

//   useEffect(() => { 
//     fetchData() 
//   }, [id])

// // 1. First, check your state name at the top of the component:
// // If it looks like this: const [form, setForm] = useState({ ... })

// const handleCreateTask = async (e) => {
//   e.preventDefault();
//   try {
//     // 1. Corrected 'form' to 'formData' to match your state on line 18
//     await axiosInstance.post(`/projects/${id}/tasks`, formData); 
    
//     // 2. Corrected 'setForm' to 'setFormData' to reset the fields
//     setFormData({ title: '', description: '', priority: 'medium', assignedTo: '' });
    
//     // 3. Close the form panel
//     setShowForm(false);
    
//     // 4. Refresh the data so the new task appears on the board
//     fetchData(); 
    
//     // 5. Optional: Show a success message
//     setStatusMsg({ type: 'success', text: 'Task created successfully!' });
//   } catch (err) {
//     console.error("Task creation failed", err);
//     setStatusMsg({ type: 'error', text: 'Failed to create task' });
//   }
// };

//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus })
//       fetchData()
//     } catch (err) {
//       setStatusMsg({ type: 'error', text: 'Update failed' })
//     }
//   }

//   const getPriorityClass = (p) => {
//     if (p === 'high') return 'bg-red-100 text-red-700'
//     if (p === 'medium') return 'bg-yellow-100 text-yellow-700'
//     return 'bg-green-100 text-green-700'
//   }

//   const isAdminOrOwner = user?.role === 'admin' || project?.owner === user?._id;

//   return (
//     <div className="page-root">
//       <Navbar />
//       <div className="page-content">
//         <div className="header-row">
//           <h1 className="text-3xl font-bold">Project Tasks</h1>
//           {isAdminOrOwner && (
//             <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">+ Add Task</button>
//           )}
//         </div>

//         {statusMsg.text && (
//           <div className={`p-3 my-4 rounded text-sm font-medium ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
//             {statusMsg.text}
//           </div>
//         )}

//         {showForm && (
//           <form onSubmit={handleCreateTask} className="form-card">
//             <input placeholder="Task Title" className="field-input" required 
//               value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            
//             <textarea placeholder="Description" className="field-input min-h-[80px] p-2"
//               value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

//             <div className="grid grid-cols-2 gap-2">
//               <select className="field-input" value={formData.priority}
//                 onChange={e => setFormData({...formData, priority: e.target.value})}>
//                 <option value="low">Low Priority</option>
//                 <option value="medium">Medium Priority</option>
//                 <option value="high">High Priority</option>
//               </select>

//               <select className="field-input" value={formData.assignedTo} 
//                 onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
//                 <option value="">Assign Member</option>
//                 {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
//               </select>
//             </div>

//             <div className="flex gap-2 mt-2">
//               <button type="submit" className="btn btn-primary flex-1">Create Task</button>
//               <button type="button" onClick={() => setShowForm(false)} className="btn bg-gray-200 flex-1">Cancel</button>
//             </div>
//           </form>
//         )}

//         <div className="kanban-grid mt-8">
//           {STATUS.map(status => (
//             <div key={status} className="card bg-gray-100 shadow-none border-dashed border-2 p-4">
//               <h2 className="text-lg font-bold capitalize mb-4 text-gray-600">{status}</h2>
//               {tasks.filter(t => t.status === status).map(task => {
//                 const canUpdateStatus = isAdminOrOwner || task.assignedTo?._id === user?._id;

//                 return (
//                   <div key={task._id} className="card bg-white mb-4 shadow-sm border-none p-4">
//                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mb-2 inline-block ${getPriorityClass(task.priority)}`}>
//                       {task.priority}
//                     </span>
//                     <p className="font-bold text-gray-800">{task.title}</p>
//                     <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    
//                     <div className="flex items-center justify-between mt-4">
//                       {canUpdateStatus ? (
//                         <select 
//                           value={task.status} 
//                           onChange={e => handleStatusChange(task._id, e.target.value)}
//                           className="text-[10px] border rounded bg-white p-1"
//                         >
//                           {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
//                         </select>
//                       ) : (
//                         <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase font-bold">
//                           {task.status}
//                         </span>
//                       )}
//                       <p className="text-[10px] text-blue-600 font-bold">@{task.assignedTo?.name || 'Unassigned'}</p>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProjectDetailPage







import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Shared/Navbar'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext'

const STATUS = ['todo', 'in-progress', 'done']

const ProjectDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [project, setProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    assignedTo: '', 
    dueDate: '' 
  })

  const fetchData = async () => {
    try {
      const [taskRes, userRes, projectRes] = await Promise.all([
        axiosInstance.get(`/projects/${id}/tasks`),
        axiosInstance.get('/users'),
        axiosInstance.get(`/projects/${id}`)
      ])
      setTasks(taskRes.data)
      setUsers(userRes.data)
      setProject(projectRes.data)
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to sync with server' })
    }
  }

  useEffect(() => { 
    fetchData() 
  }, [id])

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/projects/${id}/tasks`, formData); 
      setFormData({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' });
      setShowForm(false);
      fetchData(); 
      setStatusMsg({ type: 'success', text: 'Task created successfully!' });
    } catch (err) {
      console.error("Task creation failed", err);
      setStatusMsg({ type: 'error', text: 'Failed to create task' });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus })
      fetchData()
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Update failed' })
    }
  }

  const getPriorityClass = (p) => {
    if (p === 'high') return 'bg-red-100 text-red-700'
    if (p === 'medium') return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const isAdminOrOwner = user?.role === 'admin' || project?.owner === user?._id;

  return (
    <div className="page-root">
      <Navbar />
      <div className="page-content">
        <div className="header-row">
          <h1 className="text-3xl font-bold">Project Tasks</h1>
          {isAdminOrOwner && (
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">+ Add Task</button>
          )}
        </div>

        {statusMsg.text && (
          <div className={`p-3 my-4 rounded text-sm font-medium ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {statusMsg.text}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreateTask} className="form-card">
            <input placeholder="Task Title" className="field-input" required 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            
            <textarea placeholder="Description" className="field-input min-h-[80px] p-2"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

            <div className="grid grid-cols-3 gap-2">
              <select className="field-input" value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select className="field-input" value={formData.assignedTo} 
                onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                <option value="">Assign Member</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>

              <input 
                type="date" 
                className="field-input" 
                required 
                value={formData.dueDate} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary flex-1">Create Task</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn bg-gray-200 flex-1">Cancel</button>
            </div>
          </form>
        )}

        <div className="kanban-grid mt-8">
          {STATUS.map(status => (
            <div key={status} className="card bg-gray-100 shadow-none border-dashed border-2 p-4">
              <h2 className="text-lg font-bold capitalize mb-4 text-gray-600">{status}</h2>
              {tasks.filter(t => t.status === status).map(task => {
                const canUpdateStatus = isAdminOrOwner || task.assignedTo?._id === user?._id;
                const isOverdue = task.status !== 'done' && task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0);

                return (
                  <div key={task._id} className={`card mb-4 shadow-sm border-none p-4 ${isOverdue ? 'bg-red-50 ring-1 ring-red-200' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] text-red-600 font-black uppercase">⚠️ Overdue</span>
                      )}
                    </div>
                    
                    <p className="font-bold text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    
                    {task.dueDate && (
                      <p className={`text-[10px] mt-2 font-medium ${isOverdue ? 'text-red-600' : 'text-gray-400'}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {canUpdateStatus ? (
                        <select 
                          value={task.status} 
                          onChange={e => handleStatusChange(task._id, e.target.value)}
                          className="text-[10px] border rounded bg-white p-1"
                        >
                          {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase font-bold">
                          {task.status}
                        </span>
                      )}
                      <p className="text-[10px] text-blue-600 font-bold">@{task.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
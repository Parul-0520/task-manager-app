import { useEffect, useState } from 'react'
import Navbar from '../components/Shared/Navbar'
import axiosInstance from '../api/axiosInstance'

// ... keep imports ...
const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, done: 0, overdue: 0, projects: 0 })
  const [overdueTasks, setOverdueTasks] = useState([])

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data: projectData } = await axiosInstance.get('/projects')
      const taskPromises = projectData.map(p => axiosInstance.get(`/projects/${p._id}/tasks`))
      const taskResults = await Promise.all(taskPromises)
      const allTasks = taskResults.flatMap(r => r.data)

      // ... inside fetchDashboard ...
const today = new Date();
today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day-to-day comparison

const overdue = allTasks.filter(t => {
  if (!t.dueDate) return false;
  
  const taskDate = new Date(t.dueDate);
  // Optional: Reset task time too if your DB saves specific times
  taskDate.setHours(0, 0, 0, 0); 
  
  return taskDate < today && t.status !== 'done';
});

      setStats({
        projects: projectData.length,
        total: allTasks.length,
        done: allTasks.filter(t => t.status === 'done').length,
        overdue: overdue.length
      })
      setOverdueTasks(overdue)
    }
    fetchDashboard()
  }, [])

  return (
    <div className="page-root">
      <Navbar />
      <main className="page-content">
        <h1 className="text-3xl font-black mb-8 text-emerald-900">Workspace Overview</h1>
        
        <div className="stat-grid mb-8">
          {[
            { label: 'Active Projects', val: stats.projects, color: 'text-blue-600' },
            { label: 'Total Tasks', val: stats.total, color: 'text-emerald-600' },
            { label: 'Completed', val: stats.done, color: 'text-indigo-600' },
            { label: 'Overdue', val: stats.overdue, color: 'text-red-500' }
          ].map(s => (
            <div key={s.label} className="card text-center border-none shadow-sm">
              <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card shadow-sm border-none">
          <h2 className="text-xl font-bold mb-4">Critical Overdue Tasks</h2>
          {overdueTasks.length === 0 ? (
            <div className="py-8 text-center text-gray-400 italic">No tasks are currently overdue. Keep it up!</div>
          ) : (
            overdueTasks.map(task => (
              <div key={task._id} className="flex justify-between items-center py-4 border-b last:border-0">
                <div>
                   <p className="font-bold text-gray-800">{task.title}</p>
                   <p className="text-xs text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <span className="bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold">EXPIRED</span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage;
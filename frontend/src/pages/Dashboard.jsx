import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask, updateTask, getStats } from "../services/taskService";
import { getUser, logout } from "../services/authService";

function Dashboard(){

const navigate = useNavigate();
const user = getUser();
const [tasks,setTasks]=useState([]);
const [filter,setFilter]=useState("All");
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);
const [search,setSearch]=useState("");
const [darkMode,setDarkMode]=useState(false);
const [currentPage,setCurrentPage]=useState(1);
const itemsPerPage = 5;
const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
const [totalPages, setTotalPages] = useState(1);
const [sortBy, setSortBy] = useState("created_at");
const [order, setOrder] = useState("desc");

const loadTasks=async()=>{
 try{
  setLoading(true);
  setError(null);
  const res=await getTasks({
    search,
    status: filter,
    page: currentPage,
    limit: itemsPerPage,
    sort: sortBy,
    order: order
  });
  setTasks(res.data.tasks);
  setTotalPages(res.data.pagination.totalPages);
  
  const statsRes = await getStats();
  setStats(statsRes.data);
 }catch(err){
  setError("Failed to load tasks");
  console.error(err);
 }finally{
  setLoading(false);
 }
};

useEffect(()=>{
 loadTasks();
},[currentPage, search, filter, sortBy, order]);

const completeTask=async(id)=>{
 try{
  await updateTask(id,{status:"Completed"});
  loadTasks();
 }catch(err){
  alert("Failed to complete task");
  console.error(err);
 }
};

const removeTask=async(id)=>{
 try{
  await deleteTask(id);
  loadTasks();
 }catch(err){
  alert("Failed to delete task");
  console.error(err);
 }
};

const handleLogout = () => {
 logout();
 navigate("/login");
};



return(

<div className={darkMode ? "bg-dark text-white min-vh-100" : ""} style={{minHeight: "100vh"}}>

<div className="container py-4">

<div className="d-flex justify-content-between align-items-center mb-4">
<h2>📊 Dashboard</h2>
<div className="d-flex gap-2 align-items-center">
{user && <span className="badge bg-info">👤 {user.name}</span>}
<button 
className="btn btn-outline-secondary"
onClick={() => setDarkMode(!darkMode)}
title="Toggle Dark Mode"
>
{darkMode ? "☀️ Light" : "🌙 Dark"}
</button>
<button 
className="btn btn-danger btn-sm"
onClick={handleLogout}
>
🚪 Logout
</button>
</div>
</div>

{/* Statistics Cards */}
<div className="row mb-4">
<div className="col-md-3 mb-2">
<div className={`card ${darkMode ? "bg-secondary text-white" : ""}`}>
<div className="card-body text-center">
<h5 className="card-title">Total Tasks</h5>
<h2 className="text-primary">{stats.total}</h2>
</div>
</div>
</div>
<div className="col-md-3 mb-2">
<div className={`card ${darkMode ? "bg-secondary text-white" : ""}`}>
<div className="card-body text-center">
<h5 className="card-title">Pending</h5>
<h2 className="text-warning">{stats.pending}</h2>
</div>
</div>
</div>
<div className="col-md-3 mb-2">
<div className={`card ${darkMode ? "bg-secondary text-white" : ""}`}>
<div className="card-body text-center">
<h5 className="card-title">In Progress</h5>
<h2 className="text-info">{stats.inProgress}</h2>
</div>
</div>
</div>
<div className="col-md-3 mb-2">
<div className={`card ${darkMode ? "bg-secondary text-white" : ""}`}>
<div className="card-body text-center">
<h5 className="card-title">Completed</h5>
<h2 className="text-success">{stats.completed}</h2>
</div>
</div>
</div>
</div>

<div className="d-flex gap-2 mb-3">
<button 
className="btn btn-primary text-nowrap"
onClick={()=>navigate("/add")}
>
+ Add Task
</button>
<input 
type="text"
className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
placeholder="🔍 Search tasks..."
value={search}
onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
/>
<select
className={`form-select text-nowrap ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
style={{ width: "200px" }}
value={`${sortBy}:${order}`}
onChange={(e) => {
  const [sortField, sortOrder] = e.target.value.split(":");
  setSortBy(sortField);
  setOrder(sortOrder);
  setCurrentPage(1);
}}
>
  <option value="created_at:desc">Newest First</option>
  <option value="created_at:asc">Oldest First</option>
  <option value="title:asc">Title (A-Z)</option>
  <option value="title:desc">Title (Z-A)</option>
</select>
</div>

{error && <div className="alert alert-danger">{error}</div>}

{loading && <div className="text-center mt-4"><p>Loading tasks...</p></div>}

{!loading && (
<>
<select 
className={`form-control mb-3 ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
onChange={(e)=>{
  setFilter(e.target.value);
  setCurrentPage(1);
}}
>

<option>All</option>
<option>Pending</option>
<option>In Progress</option>
<option>Completed</option>

</select>


{
tasks.length===0?

<div className="alert alert-info">
<h5>📭 No Tasks Available</h5>
<p>
  {search ? "No matching tasks found. Try a different search." : "Click '+ Add Task' to get started!"}
</p>
</div>


:

tasks.map(task=>(

<div className={`card mt-3 p-3 ${darkMode ? "bg-secondary text-white border-secondary" : ""}`} key={task._id}>

<div className="row">
<div className="col-md-9">
<h3>{task.title}</h3>
<p className="text-muted">{task.description}</p>
<p>
<span className={`badge ${
  task.status === "Completed" ? "bg-success" :
  task.status === "In Progress" ? "bg-info" :
  "bg-warning"
}`}>
{task.status}
</span>
</p>
</div>
<div className="col-md-3 d-flex gap-2">
<button
className="btn btn-success me-2"
onClick={()=>completeTask(task._id)}
disabled={task.status === "Completed"}
>
✓ Complete
</button>

<button
className="btn btn-danger"
onClick={()=>removeTask(task._id)}
>
🗑️ Delete
</button>
</div>
</div>

</div>

))

}

{/* Pagination */}
{totalPages > 1 && (
<nav aria-label="Page navigation" className="mt-4">
<ul className="pagination justify-content-center">
<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
<button 
className="page-link" 
onClick={() => setCurrentPage(currentPage - 1)}
disabled={currentPage === 1}
>
← Previous
</button>
</li>

{Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
<li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
<button 
className="page-link"
onClick={() => setCurrentPage(page)}
>
{page}
</button>
</li>
))}

<li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
<button 
className="page-link"
onClick={() => setCurrentPage(currentPage + 1)}
disabled={currentPage === totalPages}
>
Next →
</button>
</li>
</ul>
</nav>
)}

</>
)}

</div>

</div>

)

}


export default Dashboard;
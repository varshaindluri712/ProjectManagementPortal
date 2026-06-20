import { useState } from "react";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";


function AddTask(){

const navigate = useNavigate();

const [task,setTask] = useState({
  title:"",
  description:"",
  status:"Pending"
});

const [loading,setLoading] = useState(false);
const [error,setError] = useState(null);


const submitTask = async(e)=>{

 e.preventDefault();
 setError(null);

 if(task.title===""){
   setError("Title required");
   return;
 }

 if(task.description.length < 20){
   setError("Description minimum 20 characters");
   return;
 }

 try{
  setLoading(true);
  await createTask(task);
  alert("Task Created Successfully!");
  navigate("/");
 }catch(err){
  setError("Failed to create task. Please try again.");
  console.error(err);
 }finally{
  setLoading(false);
 }

};


return(

<div className="container">

<h2>Add Task</h2>

<button 
className="btn btn-secondary mb-3"
onClick={()=>navigate("/")}
>
← Back to Dashboard
</button>

{error && <div className="alert alert-danger">{error}</div>}

<form onSubmit={submitTask}>


<input
className="form-control mt-3"
placeholder="Task Title"
value={task.title}
onChange={(e)=>
setTask({...task,title:e.target.value})
}
/>


<textarea
className="form-control mt-3"
placeholder="Description"
value={task.description}
onChange={(e)=>
setTask({...task,description:e.target.value})
}
/>


<select
className="form-control mt-3"
value={task.status}
onChange={(e)=>
setTask({...task,status:e.target.value})
}

>

<option>Pending</option>
<option>In Progress</option>

</select>


<button 
className="btn btn-primary mt-3"
disabled={loading}
>

{loading ? "Creating..." : "Add Task"}

</button>


</form>

</div>

)

}


export default AddTask;
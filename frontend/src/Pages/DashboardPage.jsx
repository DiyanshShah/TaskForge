import {useState, useEffect, useContext} from 'react'
import AuthContext   from '../context/AuthContext'
import apiClient from '../api'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EditTaskForm from '../Components/EditTaskForm';
import ModalWrapper from '../Components/ModalWrapper';



    const DashboardPage = () => {

    const {user, logout} = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentlyEditingTask, setCurrentlyEditingTask] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [orderingFilter, setOrderingFilter] = useState('');


    const fetchTasks = async() => {
        try{
            const params = new URLSearchParams();
            if(statusFilter){
                params.append('status', statusFilter);
            }
            if(orderingFilter){
                params.append('ordering', orderingFilter);
            }
            const response = await apiClient.get('/api/tasks/', {params});
            setTasks(response.data);
        }catch(error){
            console.error("Failed to fetch tasks: ", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [statusFilter, orderingFilter]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if(!newTaskTitle.trim()) return;
        
        try {


            const taskData = {
                title: newTaskTitle,
                description: newTaskDescription,
                status: 'PL',
            }

            if(newTaskDueDate){
                taskData.due_date = newTaskDueDate.toISOString(); 
            }
            const response = await apiClient.post('/api/tasks/',taskData);
            fetchTasks();

            // setTasks([...tasks, response.data]);
            setNewTaskDescription('');
            setNewTaskTitle('');
            setNewTaskDueDate('');
        } catch (error) {
            console.error("Failed to create task: ", error);
        }
    }


    const handleUpdateStatus = async (taskId, newStatus) => {

        console.log(`Attempting to update task ID: ${taskId} to status: ${newStatus}`);
        try{
            const response = await apiClient.patch(`api/tasks/${taskId}/`, {
                status: newStatus,
            })
            fetchTasks();

            setTasks(
                tasks.map((task) => (
                    task.id === taskId?{...task, status: response.data.status}:task
                
                ))
            )
        }catch(error){
            console.error("Failed to Update Tasks: ", error);
        }
    }

    const handleDeleteTask = async (taskId) => {
        if(window.confirm("Are you sure you want to delete this taks?")){
            try{
                await apiClient.delete(`api/tasks/${taskId}/`);
                setTasks(tasks.filter((task) => {task.id !== taskId}))
                fetchTasks();
            }catch(error){
                console.error("Failed to delete task: ", error);
            }
        }
    };

    const handleSaveTask = async (updatedTask) =>{
        try{
            const response = await apiClient.patch(`api/tasks/${updatedTask.id}/`, updatedTask);
            setTasks(tasks.map((task) => task.id === updatedTask.id? response.data : task))
            fetchTasks();
            closeEditModal();
        }catch(error){
            console.error("Failed to save task: ", error)
        }
    }

    const openEditModal = (task) => {
        setCurrentlyEditingTask(task);
        setIsModalOpen(true);
    }

    const closeEditModal = () => {
        setCurrentlyEditingTask(null);
        setIsModalOpen(false);
    }


    const formatDate = (dateString) => {
        if(!dateString) return "No Due Date";

        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', month: 'short',  day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };
  return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Welcome, {user?.username || 'User'}!
                </h1>
                <button
                    onClick={logout}
                    className="py-2 px-4 bg-red-600 rounded-md hover:bg-red-700 font-semibold"
                >
                    Logout
                </button>
            </header>

            <main>
                <form onSubmit={handleAddTask} className="mb-12 p-6 bg-slate-800 rounded-lg space-y-4">
                     <h2 className="text-2xl font-semibold text-white">Add a New Task</h2>
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task Title"
                        required
                        className="w-full px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder="Description (optional)..."
                        rows="3"
                        className="w-full px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    <DatePicker
                        selected={newTaskDueDate}
                        onChange={(date) => setNewTaskDueDate(date)}
                        showTimeSelect
                        dateFormat={'MMMM d, yyyy h:mm aa'}
                        placeholderText='Select Due Date and time'
                        className='w-full px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 rounded-md hover:bg-blue-700 font-semibold"
                    >
                        Add Task
                    </button>
                </form>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Your Tasks</h2>

                    <div className="mt-4 p-4 bg-slate-800 rounded-lg flex flex-col sm:flex-row gap-4">
                    {/* Status Filter */}
                    <div className="flex-1">
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-300">Filter by Status</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md"
                        >
                            <option value="">All</option>
                            <option value="PL">Planned</option>
                            <option value="DG">Doing</option>
                            <option value="CP">Completed</option>
                        </select>
                    </div>
                    {/* Ordering/Sort Filter */}
                    <div className="flex-1">
                        <label htmlFor="ordering-filter" className="block text-sm font-medium text-gray-300">Sort by</label>
                        <select
                            id="ordering-filter"
                            value={orderingFilter}
                            onChange={(e) => setOrderingFilter(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md"
                        >
                            <option value="">Default</option>
                            <option value="due_date">Due Date (Ascending)</option>
                            <option value="-due_date">Due Date (Descending)</option>
                            <option value="created_at">Creation Date (Oldest First)</option>
                            <option value="-created_at">Creation Date (Newest First)</option>
                        </select>
                    </div>
                </div>

                    {tasks.map((task) => (
                        <div key={task.id} className="p-4 bg-slate-800 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{task.title}</h3>
                                    {task.description && (
                                        <p className="text-slate-400 mt-1">{task.description}</p>
                                    )}
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    task.status === 'CP' ? 'bg-green-500 text-green-900' :
                                    task.status === 'DG' ? 'bg-yellow-500 text-yellow-900' :
                                    'bg-gray-500 text-gray-900'
                                }`}>
                                    {task.status === 'PL' ? 'Planned' : task.status === 'DG' ? 'Doing' : 'Completed'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">{formatDate(task.due_date)}</p>
                            
                            
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => handleUpdateStatus(task.id, 'PL')} className="text-xs py-1 px-3 bg-gray-600 hover:bg-gray-700 rounded-md">Planned</button>
                                <button onClick={() => handleUpdateStatus(task.id, 'DG')} className="text-xs py-1 px-3 bg-yellow-600 hover:bg-yellow-700 rounded-md">Doing</button>
                                <button onClick={() => handleUpdateStatus(task.id, 'CP')} className="text-xs py-1 px-3 bg-green-600 hover:bg-green-700 rounded-md">Completed</button>
                            </div>

                             <button 
                             onClick={() => openEditModal(task)} 
                             className="text-xs py-1 px-3 bg-gray-600 hover:bg-gray-700 rounded-md"
                             >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className='text-xs py-1 px-3 bg-red-800 hover:bg-red-700 rounded-md ml-auto'
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </main>


            {isModalOpen && (
                <ModalWrapper title = "Edit Task" onClose={closeEditModal}>
                    <EditTaskForm
                        task={currentlyEditingTask}
                        onSave={handleSaveTask}
                        onCancel={closeEditModal}
                    />
                </ModalWrapper>
            )}
        </div>
    );
}
export default DashboardPage;

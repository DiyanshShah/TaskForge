import {useState, useEffect, useContext} from 'react'
import AuthContext   from '../context/AuthContext'
import apiClient from '../api'

const DashboardPage = () => {

    const {user, logout} = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    const fetchTasks = async() => {
        try{
            const response = await apiClient.get('/api/tasks/');
            setTasks(response.data);
        }catch(error){
            console.error("Failed to fetch tasks: ", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if(!newTaskTitle.trim()) return;
        
        try {
            const response = await apiClient.post('/api/tasks/',{
                title: newTaskTitle,
                description: newTaskDescription,
                status: 'PL', 
            });

            setTasks([...tasks, response.data]);
            setNewTaskDescription('');
            setNewTaskTitle('');
        } catch (error) {
            console.error("Failed to create task: ", error);
        }
    }
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
                <form onSubmit={handleAddTask} className="mb-8 p-6 bg-slate-800 rounded-lg space-y-4">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task Title"
                        required
                        className="w-full px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* 2. ADD TEXTAREA FOR THE DESCRIPTION */}
                    <textarea
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder="Add a description (optional)..."
                        rows="3"
                        className="w-full px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 rounded-md hover:bg-blue-700 font-semibold"
                    >
                        Add Task
                    </button>
                </form>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Your Tasks</h2>
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div key={task.id} className="p-4 bg-slate-800 rounded-lg shadow-md">
                                <h3 className="font-bold text-lg">{task.title}</h3>
                                {/* The description will now show up here */}
                                {task.description && (
                                    <p className="text-slate-400 mt-1">{task.description}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400">You have no tasks yet. Add one above!</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default DashboardPage

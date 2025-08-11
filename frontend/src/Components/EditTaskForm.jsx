import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'

const EditTaskForm = ({task, onSave, onCancel}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);

    useEffect(() => {
        if(task){
            setTitle(task.title);
            setDescription(task.description||"");
            setDueDate(task.due_date? new Date(task.due_date) : null);
        }
    }, [task])

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...task,
            title,
            description,
            due_date: dueDate? dueDate.toISOString(): null,
        })
    }

    return (
    <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full mt-1 px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md"
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Due Date</label>
                <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full mt-1 px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md"
                />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="py-2 px-4 bg-gray-600 rounded-md hover:bg-gray-700 font-semibold">
                    Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-blue-600 rounded-md hover:bg-blue-700 font-semibold">
                    Save Changes
                </button>
            </div>
        </form>
  )
}

export default EditTaskForm

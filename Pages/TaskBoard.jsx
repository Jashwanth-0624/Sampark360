import React, { useState, useEffect } from 'react';
import { Trello, User, Tag, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card.jsx";
import { Task } from '@/Entities/Task';
import { Skeleton } from '@/Components/ui/skeleton.jsx';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Badge } from '@/Components/ui/badge.jsx';
import { format } from 'date-fns';

const columns = {
  "To Do": { name: "To Do", color: "bg-gray-500" },
  "In Progress": { name: "In Progress", color: "bg-blue-500" },
  "Review": { name: "Review", color: "bg-purple-500" },
  "Completed": { name: "Completed", color: "bg-green-500" },
};

const TaskCard = ({ task, index }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const priorityColors = {
    'High': 'text-red-500',
    'Urgent': 'text-red-700 font-bold',
    'Medium': 'text-yellow-600',
    'Low': 'text-gray-500'
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-xl shadow-md border mb-4"
        >
          <p className="font-semibold text-gray-800 mb-2">{task.title}</p>
          <p className="text-xs text-gray-500 mb-2">{task.project_title}</p>
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <Badge variant="secondary" className={priorityColors[task.priority]}>{task.priority}</Badge>
            {isOverdue && <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1"/>Overdue</Badge>}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(task.due_date), 'dd MMM')}</div>
            <div className="flex items-center gap-1"><User className="w-3 h-3" />{task.assigned_to_name}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Task.list();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const taskId = result.draggableId;
    
    if (source.droppableId !== destination.droppableId) {
      setTasks(prevTasks => {
        return prevTasks.map(task => 
          task.id === taskId ? { ...task, status: destination.droppableId } : task
        );
      });
      // In a real app, you would call Task.update here
      // Task.update(taskId, { status: destination.droppableId });
    }
  };

  if (loading) return <Skeleton className="h-screen w-full" />;

  return (
    <div className="p-4 md:p-8 space-y-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <Trello className="w-8 h-8 text-orange-500" />
        Work Allocation Board
      </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {Object.entries(columns).map(([id, column]) => (
            <Droppable droppableId={id} key={id}>
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className="bg-gray-100/80 rounded-2xl p-4 h-full flex flex-col"
                >
                  <h3 className={`font-semibold mb-4 flex items-center gap-2 ${column.color.replace('bg','text')}`}>
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    {column.name}
                  </h3>
                  <div className="overflow-y-auto flex-grow">
                    {tasks.filter(t => t.status === id).map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

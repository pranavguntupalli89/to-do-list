document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filter-button');

    let tasks = [];

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);
    filterButtons.forEach(button => {
        button.addEventListener('click', filterTasks);
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        renderTasks();
    }

    function handleTaskActions(event) {
        const { target } = event;
        const action = target.getAttribute('data-action');
        const taskId = parseInt(target.closest('li').getAttribute('data-id'), 10);

        if (action === 'delete') {
            tasks = tasks.filter(task => task.id !== taskId);
        } else if (action === 'edit') {
            const newTaskText = prompt('Edit task:', tasks.find(task => task.id === taskId).text);
            if (newTaskText !== null) {
                tasks = tasks.map(task =>
                    task.id === taskId ? { ...task, text: newTaskText } : task
                );
            }
        } else if (action === 'complete') {
            tasks = tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );
        }

        renderTasks();
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.setAttribute('data-id', task.id);
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div class="task-actions">
                    <button data-action="edit" class="edit">Edit</button>
                    <button data-action="delete" class="delete">Delete</button>
                    <button data-action="complete" class="complete">${task.completed ? 'Undo' : 'Complete'}</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    function filterTasks(event) {
        const filter = event.target.getAttribute('data-filter');

        filterButtons.forEach(button => button.classList.remove('active'));
        event.target.classList.add('active');

        renderTasks(filter);
    }
});

window.addEventListener('load', () => {
    const form = document.querySelector('#new-task-form');
    const input = document.querySelector('#new-task-input');
    const list_el = document.querySelector('#tasks');
    const filter_el = document.querySelector('#filter');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];

    // Function to load tasks based on filter selection
    function loadTasks(filter) {
        list_el.innerHTML = '';

        if (filter === 'deleted') {
            deletedTasks.forEach(task => addTaskToList(task.text, true, true));
        } else {
            tasks.forEach(task => {
                const isDeleted = deletedTasks.some(dTask => dTask.text === task.text);
                if (filter === 'all' || (filter === 'current' && !task.completed && !isDeleted) || (filter === 'completed' && task.completed)) {
                    addTaskToList(task.text, task.completed, isDeleted);
                }
            });
        }
    }

    // Initial load of tasks with 'Current Tasks' filter
    loadTasks('current');
    filter_el.value = 'current'; // Set initial filter value

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = input.value.trim();

        if (!taskText) {
            alert("Please write your task");
            return;
        }

        addTaskToList(taskText);
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));

        input.value = '';
    });

    function addTaskToList(taskText, completed = false, isDeleted = false) {
        const task_el = document.createElement("div");
        task_el.classList.add('task');
        if (completed) {
            task_el.classList.add('completed');
        }
        if (isDeleted) {
            task_el.classList.add('deleted');
        }

        const task_content_el = document.createElement('div');
        task_content_el.classList.add("content");

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = taskText;
        task_input_el.setAttribute("readonly", "readonly");

        if (!completed) {
            task_content_el.appendChild(task_input_el);
        } else {
            const task_text_el = document.createElement("span");
            task_text_el.classList.add("text");
            task_text_el.textContent = taskText;
            task_content_el.appendChild(task_text_el);

            const task_completed_tag = document.createElement("span");
            task_completed_tag.classList.add("completed-tag");
            task_completed_tag.textContent = "COMPLETED";
            task_content_el.appendChild(task_completed_tag);
        }

        const task_action_el = document.createElement("div");
        task_action_el.classList.add("actions");

        if (!completed && !isDeleted) {
            const task_complete_el = document.createElement('button');
            task_complete_el.classList.add('complete');
            task_complete_el.innerHTML = "Complete";

            task_action_el.appendChild(task_complete_el);

            task_complete_el.addEventListener('click', () => {
                task_el.classList.toggle('completed');
                const taskIndex = tasks.findIndex(t => t.text === taskText);
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks(filter_el.value);

                // Celebration example: Alert when task is completed
                alert(`Congratulations!!! You've Done it..!!`);
            });
        }

        if (!isDeleted) {
            if (!completed) {
                const task_edit_el = document.createElement('button');
                task_edit_el.classList.add('edit');
                task_edit_el.innerHTML = "Edit";

                task_action_el.appendChild(task_edit_el);

                task_edit_el.addEventListener('click', () => {
                    if (task_edit_el.innerHTML.toLowerCase() === "edit") {
                        task_input_el.removeAttribute("readonly");
                        task_input_el.focus();
                        task_edit_el.innerText = "Save";
                    } else {
                        task_input_el.setAttribute("readonly", "readonly");
                        const taskIndex = tasks.findIndex(t => t.text === taskText);
                        tasks[taskIndex].text = task_input_el.value;
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        task_edit_el.innerHTML = "Edit";
                    }
                });
            }

            const task_delete_el = document.createElement("button");
            task_delete_el.classList.add("delete");
            task_delete_el.innerHTML = "Delete";

            task_action_el.appendChild(task_delete_el);

            task_delete_el.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete this Task?`)) {
                    list_el.removeChild(task_el);
                    const taskIndex = tasks.findIndex(t => t.text === taskText);
                    deletedTasks.push({ text: taskText });
                    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
                    tasks.splice(taskIndex, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    loadTasks(filter_el.value);
                }
            });
        } else {
            const task_permanent_delete_el = document.createElement('button');
            task_permanent_delete_el.classList.add('permanent-delete');
            task_permanent_delete_el.innerHTML = "Delete Permanently";

            task_action_el.appendChild(task_permanent_delete_el);

            task_permanent_delete_el.addEventListener('click', () => {
                if (confirm(`Are you sure you want to permanently delete this Task ?`)) {
                    list_el.removeChild(task_el);
                    const taskIndex = deletedTasks.findIndex(t => t.text === taskText);
                    deletedTasks.splice(taskIndex, 1);
                    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
                    loadTasks(filter_el.value);
                }
            });
        }

        task_el.appendChild(task_action_el);

        list_el.appendChild(task_el);
    }

    // Filter tasks handler
    filter_el.addEventListener('change', () => {
        loadTasks(filter_el.value);
    });
});

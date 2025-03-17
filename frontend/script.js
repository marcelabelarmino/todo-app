const apiUrl = 'http://localhost:3000/api/todos';

document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', fetchTasks);

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  // Cria uma nova tarefa via API
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: taskText })
  })
  .then(response => response.json())
  .then(data => {
    taskInput.value = '';
    renderTask(data);
  })
  .catch(err => console.error(err));
}

function fetchTasks() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(renderTask);
    })
    .catch(err => console.error(err));
}

function renderTask(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task._id);
  li.innerHTML = `
    <span>${task.title}</span>
    <button class="delete-btn" onclick="deleteTask('${task._id}')">Deletar</button>
  `;
  document.getElementById('taskList').appendChild(li);
}

function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    document.querySelector(`li[data-id='${id}']`).remove();
  })
  .catch(err => console.error(err));
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then((reg) => console.log("Service Worker registrado!", reg))
    .catch((err) => console.log("Erro ao registrar Service Worker", err));
}
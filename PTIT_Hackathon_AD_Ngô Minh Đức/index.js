"use strict";
class TodoList {
    constructor() {
        const storedData = localStorage.getItem('todoList');
        this.todoList = storedData ? JSON.parse(storedData) : [];
    }
    renderJob() {
        let taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        this.todoList.forEach((job) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
          <input type="checkbox" ${job.completed ? 'checked' : ''}>
          <span class="${job.completed ? 'completed' : ''}">${job.name}</span>
          <button class="btn btn-danger btn-sm float-end deleteBtn">Xóa</button>
        `;
            taskList.appendChild(listItem);
        });
        this.updateCompletedCount();
    }
    createJob() {
        const taskInput = document.getElementById('taskInput');
        const taskName = taskInput.value.trim();
        if (taskName === '') {
            alert('Tên công việc không được để trống');
            return;
        }
        const existingJob = this.todoList.find((job) => job.name === taskName);
        if (existingJob) {
            alert('Tên công việc đã tồn tại');
            return;
        }
        const newJob = {
            id: Date.now(),
            name: taskName,
            completed: false,
        };
        this.todoList.push(newJob);
        this.saveToLocalStorage();
        this.renderJob();
        taskInput.value = '';
    }
    updateJob(jobId, completed) {
        const jobIndex = this.todoList.findIndex((job) => job.id === jobId);
        if (jobIndex !== -1) {
            this.todoList[jobIndex].completed = completed;
            this.saveToLocalStorage();
            this.renderJob();
        }
    }
    deleteJob(jobId) {
        const confirmDelete = confirm('Bạn có xác nhận xóa công việc này không?');
        if (confirmDelete) {
            this.todoList = this.todoList.filter((job) => job.id !== jobId);
            this.saveToLocalStorage();
            this.renderJob();
        }
    }
    updateCompletedCount() {
        const totalCount = document.getElementById('totalCount');
        const completedCount = document.getElementById('completedCount');
        const totalJobs = this.todoList.length;
        const completedJobs = this.todoList.filter((job) => job.completed).length;
        totalCount.textContent = totalJobs.toString();
        completedCount.textContent = completedJobs.toString();
        if (completedJobs === totalJobs) {
            alert('Hoàn thành công việc');
        }
    }
    saveToLocalStorage() {
        localStorage.setItem('todoList', JSON.stringify(this.todoList));
    }
}
const todoList = new TodoList();
const addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', () => {
    todoList.createJob();
});
const taskList = document.getElementById('taskList');
taskList.addEventListener('click', (event) => {
    const deleteBtn = event.target;
    if (deleteBtn.classList.contains('deleteBtn')) {
        const listItem = deleteBtn.closest('li');
        const jobId = parseInt(listItem.dataset.id);
        todoList.deleteJob(jobId);
    }
});
taskList.addEventListener('change', (event) => {
    const checkbox = event.target;
    const listItem = checkbox.closest('li');
    const jobId = parseInt(listItem.dataset.id);
    const completed = checkbox.checked;
    todoList.updateJob(jobId, completed);
});

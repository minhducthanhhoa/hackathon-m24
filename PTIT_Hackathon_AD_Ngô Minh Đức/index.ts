interface ITodoList {
    id: number;
    name: string;
    completed: boolean;
  }
  
  class TodoList implements ITodoList {
    private todoList: ITodoList[];
  
    constructor() {
      const storedData = localStorage.getItem('todoList');
      this.todoList = storedData ? JSON.parse(storedData) : [];
    }
  
    renderJob(): void {
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
  
    createJob(): void {
      const taskInput = document.getElementById('taskInput') as HTMLInputElement;
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
  
      const newJob: ITodoList = {
        id: Date.now(),
        name: taskName,
        completed: false,
      };
  
      this.todoList.push(newJob);
      this.saveToLocalStorage();
      this.renderJob();
  
      taskInput.value = '';
    }
  
    updateJob(jobId: number, completed: boolean): void {
      const jobIndex = this.todoList.findIndex((job) => job.id === jobId);
      if (jobIndex !== -1) {
        this.todoList[jobIndex].completed = completed;
        this.saveToLocalStorage();
        this.renderJob();
      }
    }
  
    deleteJob(jobId: number): void {
      const confirmDelete = confirm('Bạn có xác nhận xóa công việc này không?');
      if (confirmDelete) {
        this.todoList = this.todoList.filter((job) => job.id !== jobId);
        this.saveToLocalStorage();
        this.renderJob();
      }
    }
  
    private updateCompletedCount(): void {
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
  
    private saveToLocalStorage(): void {
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
    const deleteBtn = event.target as HTMLElement;
    if (deleteBtn.classList.contains('deleteBtn')) {
      const listItem = deleteBtn.closest('li');
      const jobId = parseInt(listItem.dataset.id);
      todoList.deleteJob(jobId);
    }
  });
  
 
  taskList.addEventListener('change', (event) => {
    const checkbox = event.target as HTMLInputElement;
    const listItem = checkbox.closest('li');
    const jobId = parseInt(listItem.dataset.id);
    const completed = checkbox.checked;
    todoList.updateJob(jobId, completed);
  });
// ==== STATE & DATA MANAGEMENT ==== //
const state = {
    tasks: {},
    currentList: 'default',
    currentTab: 'active',
    editingTaskId: null,
};

const categories = {
    meeting: { name: 'Meeting', color: '--color-meeting' },
    work: { name: 'Work', color: '--color-work' },
    report: { name: 'Report', color: '--color-report' },
    shopping: { name: 'Shopping', color: '--color-shopping' },
    personal: { name: 'Personal', color: '--color-personal' },
}

// ELEMEN DOM
const taskModal = document.getElementById('taskModal');
const listModal = document.getElementById('listModal');
const taskForm = document.getElementById('taskForm');
const listForm = document.getElementById('listForm');
const taskGrid = document.getElementById('taskGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const navItems = document.querySelectorAll('.nav-item');
const navToggles = document.querySelectorAll('.nav-toggle');
const navSubmenus = document.querySelectorAll('.nav-submenu');
const navSubitems = document.querySelectorAll('.nav-subitem');
const searchInput = document.getElementById('searchInput');
const addListBtn = document.getElementById('addListBtn');

// INISIALISASI VARIABEL
function init() {
    loadState();
    setupEventListeners();
    setCurrentDate();
    renderTasks();
}

// MENYIMPAN DATA DARI LOCAL STORAGE
function loadState() {
    const saved = localStorage.getItem('todoAppState');
    if (saved) {
        const data = JSON.parse(saved);
        state.tasks = data.tasks || state.tasks;
    } else {
        // umumnya, buat data contoh
        state.tasks = {
            default: [
                {
                    id: 1,
                    title: 'Team Meeting',
                    description: 'Lorem ipsum dolor sit amet, consectetur elit iddv niorem oldffl.',
                    category: 'meeting',
                    startTime: '10:30',
                    endTime: '12:00',
                    completed: false,
                },
                {
                    id: 2,
                    title: 'Work on Branding',
                    description: 'Lorem ipsum dolor sit amet, consectetur elit iddv niorem oldffl.',
                    category: 'work',
                    startTime: '10:30',
                    endTime: '12:00',
                    completed: false,
                },
                {
                    id: 3,
                    title: 'Make a Report for client',
                    description: 'Lorem ipsum dolor sit amet, consectetur elit iddv niorem oldffl.',
                    category: 'report',
                    startTime: '10:30',
                    endTime: '12:00',
                    completed: false,
                },
                {
                    id: 4,
                    title: 'Create a planer',
                    description: 'Lorem ipsum dolor sit amet, consectetur elit iddv niorem oldffl.',
                    category: 'planning',
                    startTime: '10:30',
                    endTime: '12:00',
                    completed: false,
                },
            ],
            list2: [],
            list3: [],
            list4: [],
        };
        saveData();
    }
}

// MENYIMPAN DATA KE PENYIMPANAN LOKAL
function saveData() {
    localStorage.setItem('todoAppData', JSON.stringify(state));
}

// ATUR WAKTU TERBARU
function currentDate() {
    const tooday  = new Date();
    const option =  {day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocalDateString('en-GB', option);
    const ordinal = getOrdinal(today.getDate());
    document.getElementById('currentDate').textContent = `${ordinal} ${today.toLocalDateString('en-GB', {month: 'long', year: 'numeric'})}`;
}

function getOrdinal(num) {
    const j = num % 10,
        k = num % 100;
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
}

// EVENT LISTENER
function setupEventListeners() {
    // ganti tab
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentTab = btn.dataset.tab;
            renderTasks();
        });
    });

    // ganti list
    navSubitems.forEach(item => {
        item.addEventListener('click', () => {
            navSubitems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            state.currentList = item.dataset.listId;
            renderTasks();
        });
    });

    // sidebar toggle
    navToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', () => {
            const submenu = navSubmenus[index];
            if (!submenu) return;

            submenu.classList.toggle('open');
            toggle.classList.toggle('open');
        });
    });

    // menambahkan tombol task
    document.addEventListener('click', (e) => {
        if (e.target.closest('#addListBtn')) {
            openListModal();
        }
        if (e.target.closest('.task-menu')) {
            const card = e.target.closest('.task-card');
            showTaskMenu();
        };
    });

    // pencarian
    searchInput.addEventListener('input', (e) => {
        renderTasks(e.target.value);
    });

    // Modal Event
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('open');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    });

    // Task Form
    taskForm.addEventListener('submit', handleTaskSubmit);

    // List Form
    listForm.addEventListener('submit', handleListSubmit);

    // Tombol Cancel
    document.querySelectorAll('#cancelBtn', '[type="button"]').forEach(btn => {
        if (btn.textContent === 'Cancel') {
            btn.addEventListener('click', () => {
                taskModal.classList.remove('open');
            });
        }
    });
}

// ==== RENDER TASK ====
function renderTasks(searchQuery = '') {
    const tasks = state.tasks[state.currentList] || [];
    const filtered = tasks.filter(task => {
        const matchesTab = state.currentTab === 'active' ? !task.completed : task.completed;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    taskGrid.innerHTML = '';
    if (filtered.length === 0) {
        taskGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No tasks found</p>';
        return;
    }

    filtered.forEach(task => {
        const card = createTaskCard(task);
        taskGrid.appendChild(card);
    });
}

// ==== MEMBUAT KARTU TUGAS ====
function createTaskCard(task) {
    const div = document.createElement('div');
    div.className = `task-card ${task.category} ${task.completed ? 'completed' : ''}`;
    div.dataset.taskId = task.id;

    div.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <button class="task-menu">⋯</button>
        </div>
        <p class="task-description">${task.description}</p>
        <p class="task-time">⏱ ${task.startTime} - ${task.endTime}</p>
        <div class="task-actions">
            <button class="task-btn check-btn">✓ Check</button>
            <button class="task-btn edit-btn">✏ Edit</button>
            <button class="task-btn delete-btn">🗑 Delete</button>
        </div>
    `;

    // Task actions
    div.querySelector('.check-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskComplete(task.id);
    });

    div.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openTaskModal(task.id);
    });

    div.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    return div;
}

// ==== TASK ACTIONS ====
function toggleTaskComplete(taskId) {
    const task = state.tasks[state.currentList].find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks();
    }
}

function deleteTask (taskId) {
    state.tasks[state.currentList] = state.tasks[state.currentList].filter(t => t.id !== taskId);
    saveData();
    renderTasks();
}

function openTaskModal(taskId = null) {
    state.editingTaskId = taskId;

    if (taskId) {
        const task = state.tasks[state.currentList].find(t => t.id === taskId);
        if (taskId) {
            document.getElementById('modalTitle').textContent = 'Edit Task';
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskTime').value = task.startTime;
            document.getElementById('taskEndTime').value = task.endTime;
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Task';
        taskForm.reset();
    }
    taskModal.classList.add('open');
}

function handleTaskSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const category = document.getElementById('taskCategory').value;
    const startTime = document.getElementById('taskTime').value;
    const endTime = document.getElementById('taskEndTime').value;

    if (state.editingTaskId) {
        const task = state.tasks[state.currentList].find(t => t.id === state.editingTaskId);
        if (task) {
            task.title = title;
            task.description = description;
            task.category = category;
            task.startTime= startTime;
            task.endTime= endTime;
        }
    } else {
        const newTask = {
            id: Date.now(),
            title,
            description,
            category,
            startTime,
            endTime,
            completed: false,
        };
        if (!state.tasks[state.currentList]) {
            state.tasks[state.currentList] = [];
        }
        state.tasks[state.currentList].push(newTask);
    }

    saveData();
    renderTasks();
    taskModal.classList.remove('open');
    state.editingTaskId = null;
}

function openListModal() {
    listForm.reset();
    listModal.classList.add('open');
}

function handleListSubmit(e) {
    e.preventDefault();

    const listName = document.getElementById('listName').value;
    const listId = 'list_' + Date.now();

    state.tasks[listId] = [];
    saveData();

    // menambahkan ke sidebar
    const listMenu = document.getElementById('todoListMenu');
    const newItem = document.getElementById('button');
    newItem.className = 'nav-subItem';
    newItem.dataset.listId = listId;
    newItem.textContent = listName;

    newItem.addEventListener('click', () => {
        navSubitems.forEach(i => i.classList.remove('remove'));
        newItem.classList.add('active');
        state.currentList = listId;
        renderTasks();
    });

    listMenu.appendChild(newItem);
    listModal.classList.remove('open');
}

function showTaskMenu(card) {
    // isi menu sederhana - bisa dikembangkan dengan dropdown menu
    const taskId = parseInt(card.dataset.taskId);
    const task = state.tasks[state.currentList].find(t => t.id === taskId);

    if (task) {
        console.log('Task Menu for:', task.title);
    }
}

// ==== INISIALISASI APLIKASI ====
init();
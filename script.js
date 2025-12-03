// Ambil id dari elemen input, tombol, dan daftar dari HTML
const taskInput = document.getElementById('taskInput');   // input teks untuk menulis tugas
const addTaskButton = document.getElementById('addTaskButton'); // tombol "Add Task"
const taskList = document.getElementById('taskList');     // <ul> tempat daftar tugas ditampilkan

// Tambahkan eventlistener ke tombol "Add Task"
addTaskButton.addEventListener('click', addTask);

// Tambahkan eventlistener ke input agar bisa tekan Enter untuk menambah tugas
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask(); // jika tombol Enter ditekan, jalankan fungsi addTask()
});

// Fungsi utama untuk menambahkan tugas
function addTask() {
    const taskText = taskInput.value.trim(); // ambil teks dari input, hapus spasi depan/belakang
    
    // Jika input kosong, akan ada alert dan menghentikan fungsi
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // membuat elemen <li> baru untuk di tampilkan ke daftar tugas
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${taskText}</span>   <!-- teks tugas -->
        <button class="checkBtn">✓ Check</button>    <!-- tombol untuk menandai selesai -->
        <button class="deleteBtn">🗑 Delete</button> <!-- tombol untuk menghapus tugas -->
    `;
    
    // Tambahkan eventlistener ke tombol Check untuk menandai tugas sudah selesai
    li.querySelector('.checkBtn').addEventListener('click', () => {
        li.classList.toggle('completed'); // akan menambahkan/menandai tugas sebagai selesai seperti dicoret (style CSS)
    });
    
    // Tambahkan eventlistener ke tombol Delete untuk menghapus tugas
    li.querySelector('.deleteBtn').addEventListener('click', () => {
        li.remove(); // akan menghapus elemen <li> dari daftar
    });
    
    // Masukkan <li> ke dalam <ul> (taskList)
    taskList.appendChild(li);
    
    // Kosongkan input agar siap menerima input/tugas baru
    taskInput.value = '';
}
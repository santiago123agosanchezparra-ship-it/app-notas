// Array para almacenar las notas
let notes = [];

// Elementos del DOM
const noteForm = document.getElementById('noteForm');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');

// Cargar notas del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    renderNotes();
});

// Manejar el envío del formulario
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNote();
});

// Función para agregar una nota
function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title && content) {
        const note = {
            id: Date.now(),
            title: title,
            content: content,
            important: false
        };

        notes.push(note);
        saveNotes();
        renderNotes();

        // Limpiar el formulario
        noteTitle.value = '';
        noteContent.value = '';
        noteTitle.focus();
    }
}

// Función para marcar/desmarcar como importante
function toggleImportant(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.important = !note.important;
        saveNotes();
        renderNotes();
    }
}

// Función para eliminar una nota
function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
    renderNotes();
}

// Función para renderizar las notas
function renderNotes() {
    notesContainer.innerHTML = '';

    // Ordenar notas: importantes primero
    const sortedNotes = [...notes].sort((a, b) => {
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;
        return 0;
    });

    sortedNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = `note ${note.important ? 'important' : ''}`;
        
        noteElement.innerHTML = `
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-actions">
                <button class="star-btn ${note.important ? 'active' : ''}" onclick="toggleImportant(${note.id})">
                    ${note.important ? '★' : '☆'}
                </button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">
                    🗑️
                </button>
            </div>
        `;

        notesContainer.appendChild(noteElement);
    });
}

// Función para guardar notas en localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Función para cargar notas desde localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
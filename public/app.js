import {
  saveNote,
  getNotes,
  deleteNote,
  autoRefreshNotes,
} from './firebase-config.js';

// Cuando termino de cargar todo buscar el contender de notas y traerme las notas desde firebase

async function renderNotes(data) {
  const notesContainer = document.getElementById('notes-container');

  // const data = await getNotes();
  console.log('Datos obtenidos:', data);
  if (data) {
    notesContainer.innerHTML = ''; // Limpiar antes de renderizar
    console.log('Renderizando notas...');

    data.forEach((d) => {
      const noteEl = document.createElement('div');
      noteEl.className = 'note';
      noteEl.innerHTML = `
				<strong>${d.note.titulo}</strong>
				<p>${d.note.contenido}</p>
				<i class="fa fa-pencil edit" title="Editar" data-id="${d.id}"></i>
				<i class="fa fa-trash delete fa-danger" title="Eliminar" data-id="${d.id}"></i>
			`;

      // Eliminar nota
      noteEl.querySelector('.delete').addEventListener('click', async () => {
        try {
          await deleteNote(d.id);
          // renderNotes(); // Recargar después de eliminar
        } catch (error) {
          console.error('Error al eliminar nota:', error);
        }
      });

      // Editar nota
      noteEl.querySelector('.edit').addEventListener('click', () => {
        document.getElementById('title').value = d.note.titulo;
        document.getElementById('content').value = d.note.contenido;
        document.getElementById('note-form').setAttribute('data-id', d.id);
        console.log('Editando nota:', d.id);

        document.querySelector('button').innerHTML =
          '<i class="fa fa-save"></i> Actualizar Nota';
      });

      notesContainer.appendChild(noteEl);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('App loaded successfully!');

  // renderNotes(); // ⚡ Carga inicial

  const noteForm = document.getElementById('note-form');

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const noteId = noteForm.getAttribute('data-id');

    try {
      await saveNote(title, content, noteId);

      if (noteId) {
        noteForm.removeAttribute('data-id');
      }
      noteForm.reset();
      // renderNotes(); // Recargar después de guardar
    } catch (error) {
      console.error('Error al guardar nota:', error);
    }
  });

  autoRefreshNotes(renderNotes);
});

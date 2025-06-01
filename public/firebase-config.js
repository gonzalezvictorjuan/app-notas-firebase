// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBCd0tTl3DYlPGEscYA0wVXaLKEdxryvqY',
  authDomain: 'app-notas-50a2b.firebaseapp.com',
  projectId: 'app-notas-50a2b',
  storageBucket: 'app-notas-50a2b.firebasestorage.app',
  messagingSenderId: '306965895886',
  appId: '1:306965895886:web:183699bb6d8a600bebce9f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesRef = collection(db, 'notas');

export const saveNote = async (title, content, noteId = null) => {
  const note = {
    titulo: title,
    contenido: content,
    fecha: Timestamp.fromDate(new Date()),
  };
  if (noteId) {
    const noteDoc = doc(db, 'notas', noteId);
    await updateDoc(noteDoc, note);
  } else {
    await addDoc(notesRef, note);
  }
};
export const getNotes = async () => {
  const querySnapshot = await getDocs(notesRef);
  const result = [];
  querySnapshot.forEach((docSnap) => {
    const note = docSnap.data();
    const id = docSnap.id;

    result.push({
      id,
      note,
    });
  });

  return result;
};

export const deleteNote = async (noteId) => {
  const noteDoc = doc(db, 'notas', noteId);
  await deleteDoc(noteDoc);
};

export const autoRefreshNotes = (callback) => {
  const unsubscribe = onSnapshot(notesRef, (querySnapshot) => {
    const notes = [];
    querySnapshot.forEach((docSnap) => {
      const note = docSnap.data();
      const id = docSnap.id;

      notes.push({
        id,
        note,
      });
    });

    callback(notes);
  });

  return unsubscribe; // Para poder cancelar la suscripción si es necesario
};

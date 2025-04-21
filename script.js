// Récupère les données du localStorage ou initialise un tableau vide si aucune tâche n'existe
let todo = JSON.parse(localStorage.getItem("todo")) || [];

// Sélectionne le champ texte de saisie de tâche
const todoInput = document.getElementById("todoInput");

// Sélectionne l'élément qui contiendra la liste des tâches
const todoList = document.getElementById("todoList");

// Sélectionne l'élément qui affiche le nombre total de tâches
const todoCount = document.getElementById("todoCount");

// Sélectionne le bouton "Ajouter"
const addButton = document.querySelector(".btn");

// Sélectionne le bouton "Tout supprimer"
const deleteButton = document.getElementById("deleteButton");

// Au chargement du DOM (quand la page est prête)
document.addEventListener("DOMContentLoaded", function () {
  // Ajoute une tâche au clic sur le bouton
  addButton.addEventListener("click", addTask);

  // Ajoute une tâche si on appuie sur Entrée dans le champ texte
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Empêche l'action par défaut de la touche Entrée
      addTask(); // Appelle la fonction d'ajout
    }
  });

  // Supprime toutes les tâches au clic sur le bouton
  deleteButton.addEventListener("click", deleteAllTasks);

  // Affiche les tâches existantes
  displayTasks();
});

// Fonction pour ajouter une tâche
function addTask() {
  const newTask = todoInput.value.trim(); // Récupère et nettoie le texte
  if (newTask !== "") {
    // Si ce n'est pas vide
    todo.push({ text: newTask, disabled: false }); // Ajoute la tâche avec son état initial (non cochée)
    saveToLocalStorage(); // Sauvegarde la liste
    todoInput.value = ""; // Vide le champ texte
    displayTasks(); // Met à jour l'affichage
  }
}

// Fonction pour afficher toutes les tâches
function displayTasks() {
  todoList.innerHTML = ""; // Vide l'affichage actuel

  // Parcourt toutes les tâches
  todo.forEach((item, index) => {
    const p = document.createElement("p"); // Crée un élément paragraphe

    // Ajoute le HTML contenant la checkbox et le texte de la tâche
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
    `;

    // Ajoute un écouteur à la checkbox pour cocher/décocher
    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );

    // Ajoute l'élément à la liste affichée
    todoList.appendChild(p);
  });

  // Met à jour le compteur de tâches
  todoCount.textContent = todo.length;
}

// Fonction pour modifier une tâche (en cliquant dessus)
function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`); // Récupère l'élément texte
  const existingText = todo[index].text; // Texte actuel
  const inputElement = document.createElement("input"); // Crée un champ input
  inputElement.value = existingText; // Remplit avec le texte actuel
  todoItem.replaceWith(inputElement); // Remplace le texte par le champ input
  inputElement.focus(); // Donne le focus

  // Quand on sort du champ (blur), on sauvegarde
  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim(); // Récupère le nouveau texte
    if (updatedText) {
      todo[index].text = updatedText; // Met à jour la tâche
      saveToLocalStorage(); // Sauvegarde
    }
    displayTasks(); // Rafraîchit l'affichage
  });
}

// Fonction pour cocher/décocher une tâche
function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled; // Inverse l'état (fait / non fait)
  saveToLocalStorage(); // Sauvegarde
  displayTasks(); // Met à jour l'affichage
}

// Fonction pour supprimer toutes les tâches
function deleteAllTasks() {
  todo = []; // Vide le tableau
  saveToLocalStorage(); // Sauvegarde le vide
  displayTasks(); // Efface l'affichage
}

// Fonction pour sauvegarder les tâches dans le localStorage
function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo)); // Convertit en texte et enregistre
}

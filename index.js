"use strict";

localStorage.clear();

$("#add-todo").addEventListener("click", function () {
  if (isLimitReached()) {
    getActiveToast();
    closeToast();
    clearInput($("#input"));
  } else {
    createCard($("#input").value);
    setToDoInStorage($("#input").value);
    clearInput($("#input"));
    initCardListeners($("#todo-list"));
    showLocalStorageLength();
  }
});

function initCardListeners(list){
    let childNodes = list.childNodes;
    childNodes.forEach(function(element, i) {
        //clone element to remove all its listeners
        childNodes[i].replaceWith(element.cloneNode(true));
        childNodes[i].addEventListener('click', function(e) {
            if (e.target.className === 'btn-close'){
              this.remove();
              removeItemFromToDoStorage(i);
              //fix indexes of items in local storage
              initCardListeners(list);
              showLocalStorageLength();
            }
            if (e.target.className === 'form-check-input'){
              if (e.target.checked){
                this.querySelector(".card-body").classList.add('text-decoration-line-through');
              }
              else{
                this.querySelector(".card-body").classList.remove('text-decoration-line-through');
              }
            }
        })
    })
}

function removeItemFromToDoStorage(i){
  let data = getToDoInStorage();
  if (i > -1){
    data.splice(i, 1);
  }
  localStorage.setItem('todos', JSON.stringify(data));
}

function $(selector) {
  return document.querySelector(selector);
}

function createElement(tag, classNames, text = "", type = '') {
  let element = document.createElement(tag);
  element.className = classNames;
  element.innerText = text;
  element.type = type;
  return element;
}

function createCard(text) {
  let card = createElement("div", "card d-flex flex-row align-items-center px-3");
  let checkBox = createElement("input", "form-check-input", "", "checkbox")
  let cardText = createElement("div", "card-body d-flex justify-content-between", text);
  let btnClose = createElement("button", "btn-close");
  cardText.append(btnClose);
  card.append(checkBox);
  card.append(cardText);
  $("#todo-list").append(card);
}

function clearInput(input) {
  input.value = "";
}

function getToDoInStorage() {
  let data = JSON.parse(localStorage.getItem("todos")) || [];
  return data;
}

function setToDoInStorage(value) {
  let data = getToDoInStorage();
  data.push(value);
  localStorage.setItem("todos", JSON.stringify(data));
}

function showLocalStorageLength(){
  $('.badge').innerText = getToDoInStorage().length;
}

function isLimitReached(){
  return getToDoInStorage().length > 5; 
}

function getActiveToast() {
  $('.toast').classList.add('show');
  $('.badge').classList.remove('bg-secondary');
  $('.badge').classList.add('bg-danger');
}

function closeToast() {
  $(".close-toast").addEventListener("click", function () {
    $('.toast').classList.remove('show');
    $('.badge').classList.remove('bg-danger');
    $('.badge').classList.add('bg-secondary');
  })
}

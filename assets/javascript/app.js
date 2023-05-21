'use strict';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove, set } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js'

const firebaseConfig = {
  databaseURL: 'https://we-are-the-champions-db-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endorsementsInDB = [
  ref(database, 'endorsementsRequired'),
  ref(database, 'endorsementsStretch')
];

const inputTextfieldEl = document.querySelectorAll('.input-textfield-el');
const publishBtnEl = document.querySelectorAll('.btn-el');
const inputFromEl = document.querySelector('.input-from');
const inputToEl = document.querySelector('.input-to');
const endorsementContainersEl = document.querySelectorAll('.endorsement-container');

const clearInputFieldsEl = function (iteration) {
  inputTextfieldEl[iteration].value = ''
  inputFromEl.value = ''
  inputToEl.value = ''
}

const clearEndorsementContainersEl = function (iteration) {
  endorsementContainersEl[iteration].innerHTML = ''
}

const createRequiredEndorsement = function (iteration, textfieldValue) {
  const endorsementTextBox = document.createElement('div');
  const endorsementTextEl = document.createElement('p');

  endorsementTextBox.classList.add('endorsement-text-box');
  endorsementTextEl.classList.add('endorsement-text');

  endorsementTextEl.textContent = textfieldValue;
  endorsementTextBox.append(endorsementTextEl);

  endorsementContainersEl[iteration].prepend(endorsementTextBox);
}

const createStretchEndorsement = function (iteration, textfieldValue, id) {
  let itemID = id;

  const endorsementTextBox = document.createElement('div');
  const endorsementHeaderEl = document.createElement('div');
  const receiverEl = document.createElement('span');
  const endorsementTextEl = document.createElement('p');
  const endorsementFooterEl = document.createElement('div');
  const senderEl = document.createElement('span');
  const endorsementLikesBtn = document.createElement('button');
  const likesIcon = document.createElement('ion-icon');
  const likesNumber = document.createElement('span');

  endorsementTextBox.classList.add('endorsement-text-box');
  endorsementHeaderEl.classList.add('endorsement-header');
  receiverEl.classList.add('endorsement-names', 'receiver');
  endorsementTextEl.classList.add('endorsement-text');
  endorsementFooterEl.classList.add('endorsement-footer');
  senderEl.classList.add('endorsement-names', 'sender');
  endorsementLikesBtn.classList.add('endorsement-likes--btn');
  likesIcon.setAttribute('name', 'heart-empty');
  likesIcon.classList.add('likes-icon');
  likesNumber.classList.add('likes-number');

  receiverEl.textContent = `To ${textfieldValue.to}`;
  endorsementHeaderEl.append(receiverEl);
  endorsementTextEl.textContent = textfieldValue.message;
  senderEl.textContent = `From ${textfieldValue.from}`;
  likesNumber.textContent = textfieldValue.likes;
  endorsementLikesBtn.append(likesIcon, likesNumber);
  endorsementFooterEl.append(senderEl, endorsementLikesBtn);
  endorsementTextBox.append(endorsementHeaderEl, endorsementTextEl, endorsementFooterEl);

  endorsementContainersEl[iteration].prepend(endorsementTextBox);
}

const render = function (iteration, textfieldValue, id) {
  if (!iteration) {
    createRequiredEndorsement(iteration, textfieldValue)
  } else {
    createStretchEndorsement(iteration, textfieldValue, id)
  }
}

for (let i = 0; i < endorsementsInDB.length; i++) {
  onValue(endorsementsInDB[i], function (snapshot) {
    clearEndorsementContainersEl(i)

    if (snapshot.exists()) {
      let itemsInDB = Object.entries(snapshot.val())
      for (let j = 0; j < itemsInDB.length; j++) {
        render(i, itemsInDB[j][1], itemsInDB[j][0])
      }
    } else {
      endorsementContainersEl[i].textContent = 'Oops, no endorsements... yet'
    }
  })
}

for (let i = 0; i < publishBtnEl.length; i++) {
  publishBtnEl[i].addEventListener('click', function () {
    clearEndorsementContainersEl(i)

    if (!i) {
      push(endorsementsInDB[i], inputTextfieldEl[i].value)
      clearInputFieldsEl(i)
    } else {
      let endorsementObj = {
        from: inputFromEl.value,
        message: inputTextfieldEl[i].value,
        to: inputToEl.value,
        likes: 0
      }
      push(endorsementsInDB[i], endorsementObj)
      clearInputFieldsEl(i)
    }
  })
}
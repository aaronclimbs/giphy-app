// define globals
const API_KEY = "29kNYcuu8j6tch4gMNKSN5VQQufCvlGp";
const topics = ["rock climbing", "baseball", "tennis", "basketball"];
let viewSaved = false;

// add document event listeners
document.addEventListener("DOMContentLoaded", renderBtns);
document.querySelector("#addSport").addEventListener("submit", function(e) {
  e.preventDefault();
  input = e.target.elements.input;
  // check for null and only spaces in input
  if (input.value === null || input.value.replace(/\s/g, "").length === 0) {
    alert("Please enter a search term.");
    // check for digits in input
  } else if (/\d/g.test(input.value)) {
    alert("Please enter a word.");
  } else {
    // check if word already exists + alert user
    if (topics.indexOf(input.value.toLowerCase()) !== -1) {
      alert("This button's already here.");
      // alert to user
    } else {
      // push to topics array
      topics.push(input.value.toLowerCase());
    }
  }
  // set input box to blank
  input.value = "";
  // invoke renderBtns
  renderBtns();
});

document.querySelector("#clearSaves").addEventListener("click", clearSaves);
document.querySelector("#viewSaves").addEventListener("click", viewSaves);

function renderBtns() {
  // empty buttons div
  clearOutByID("buttons");
  // iterate through topics array + create buttons and append event listeners
  topics.forEach(topic => {
    const el = document.createElement("button");
    el.appendChild(document.createTextNode(topic));
    el.classList = "search-button";
    el.setAttribute("data-name", topic);
    el.addEventListener("click", getGifs);
    document.querySelector("#buttons").append(el);
  });
}

function viewSaves() {
  // check if localStorage item exists and set to blank if does not exist
  !localStorage.getItem("favGifs") ? localStorage.setItem("favGifs", "") : "";
  // check if localstorage item contains items and alert user;
  if (localStorage.getItem("favGifs").length === 0) {
    alert("Save some items first!");
  } else {
    viewSaved = true;
    clearOutByID("targetDiv");
    // get local storage and parse to array
    const saved = JSON.parse(localStorage.getItem("favGifs"));
    // run query for each item in array
    saved.forEach(id => {
      const queryURLSaved = `https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}`;
      fetch(queryURLSaved, { mode: "cors" })
        .then(data => data.json())
        .then(data => {
          if (data.data !== undefined) {
            item = data.data;
            renderGifs(item);
            // if undefined response, throw error
          } else {
            throw new Error(
              "data returned as undefined, check what was entered"
            );
          }
        })
        //catch errors
        .catch(err => console.error(err));
    });
  }
}

function getGifs() {
  if (viewSaved) {
    clearOutByID("targetDiv");
    viewSaved = false;
  }
  const queryURLBtn = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${
    this.dataset.name
    // set offset to random number to allow for random gifs each fetch
  }&limit=10&offset=${Math.floor(Math.random() * 50)}&lang=en`;
  fetch(queryURLBtn, { mode: "cors" })
    .then(data => data.json())
    .then(data => {
      if (data.data !== undefined) {
        // console.log(data.data);
        results = data.data;
        results.forEach(item => renderGifs(item));
        // if undefined response, throw error
      } else {
        throw new Error("data returned as undefined, check what was entered");
      }
    })
    //catch errors
    .catch(err => console.error(err));
}
// utility function to replace spaces with underscores
function replaceSpaces(string) {
  return string.replace(/ GIF/, "").replace(/[\s]/g, "_");
}

// utility function to add item to local storage
function addToLocal(name, value) {
  let exists = localStorage.getItem(name);

  // ternary function to check if exists and set to empty array if not
  exists = exists ? JSON.parse(exists) : [];
  exists.push(value);

  localStorage.setItem(name, JSON.stringify(exists));
}

// utility function to remove from local storage
function removeFromLocal(name, value) {
  let exists = localStorage.getItem(name);

  exists = exists ? JSON.parse(exists) : [];
  exists = exists.filter(item => item !== value);

  localStorage.setItem(name, JSON.stringify(exists));
}

// utility function to clear target out of all children
function clearOutByID(target) {
  // set targetDiv to selector
  const targetDiv = document.querySelector(`#${target}`);
  // initiate loop to remove children nodes while children nodes exist
  while (targetDiv.firstChild) {
    targetDiv.removeChild(targetDiv.firstChild);
  }
}

function renderGifs(item) {
  // initiate elements to be created
  const elImg = document.createElement("img");
  const elTitle = document.createElement("p");
  const newDiv = document.createElement("div");
  const dLoad = document.createElement("span");
  const save = document.createElement("span");

  // grab data from response
  const id = item.id;
  const animated = item.images.fixed_width.url;
  const still = item.images.fixed_width_still.url;
  // remove text from title with regex
  const title = item.title.replace(/ GIF/, "");

  // append text and place in div
  dLoad.className = "iconDownload";
  dLoad.innerHTML = `<a href=${
    item.images.downsized_medium.url
  } download=${replaceSpaces(
    item.title
  )} target="_blank"><i class='fas fa-external-link-square-alt fa-lg'/></a>`;
  save.className = "iconSave";
  // check if item exists in localStorage
  if (localStorage.getItem("favGifs")) {
    // check if favGifs local string includes gif id
    if (localStorage.getItem("favGifs").includes(id)) {
      // if so, set save data attribute to saved and change icon
      save.innerHTML = `<i class="fas fa-heart fa-lg" data-save="saved"></i>`;
    } else {
      save.innerHTML = `<i class="far fa-heart fa-lg" data-save="unsaved"></i>`;
    }
  } else {
    localStorage.setItem("favGifs", "");
    save.innerHTML = `<i class="far fa-heart fa-lg" data-save="unsaved"></i>`;
  }
  save.addEventListener("click", e => {
    let btn = e.target;
    let gifID =
      btn.parentElement.parentElement.parentElement.firstChild.dataset.id;
    // check if attribute is saved or unsaved and add or remove from local storage
    if (btn.getAttribute("data-save") === "unsaved") {
      btn.classList.remove("far");
      btn.classList.add("fas");
      btn.setAttribute("data-save", "saved");
      addToLocal("favGifs", gifID);
    } else {
      btn.classList.remove("fas");
      btn.classList.add("far");
      btn.setAttribute("data-save", "unsaved");
      removeFromLocal("favGifs", gifID);
    }
  });
  elTitle.appendChild(document.createTextNode(title));
  elTitle.style.textAlign = "center";
  elTitle.className = "animated zoomInLeft";
  elImg.src = still;
  elImg.setAttribute("data-id", id);
  elImg.setAttribute("data-state", "still");
  elImg.className = "animated flipInY";
  // handle start and stop animations
  elImg.addEventListener("click", e => {
    let gif = e.target;
    if (gif.getAttribute("data-state") === "still") {
      gif.src = animated;
      gif.setAttribute("data-state", "animate");
    } else {
      gif.src = still;
      gif.setAttribute("data-state", "still");
    }
  });
  elTitle.append(dLoad);
  elTitle.append(save);
  newDiv.className = "imgContainer";
  newDiv.append(elImg);
  newDiv.append(elTitle);
  // append to document
  document.querySelector("#targetDiv").prepend(newDiv);
}

// utility function to clear saves from local storage and reload page
function clearSaves() {
  localStorage.clear();
  alert("Local storage cleared.");
  if (viewSaved) {
    document.location.reload();
  }
}

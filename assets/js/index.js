const API_KEY = "29kNYcuu8j6tch4gMNKSN5VQQufCvlGp";
const topics = ["rock climbing", "baseball", "tennis", "basketball"];
let viewSaved = false;

document.addEventListener("DOMContentLoaded", renderBtns);
document.querySelector("#addSport").addEventListener("submit", function(e) {
  e.preventDefault();
  // console.log(e);
  input = e.target.elements.input;
  if (input.value === null || input.value === "") {
    alert("Please enter a search term.");
  } else {
    if (input.value.replace(/\d/g, "").length === 0) {
      alert("Please enter a word.");
    } else if (topics.indexOf(input.value.toLowerCase()) === -1) {
      topics.push(input.value.toLowerCase());
    } else {
      alert("This button's already here.");
    }
  }
  input.value = "";
  renderBtns();
});

document.querySelector("#clearSaves").addEventListener("click", clearSaves);
document.querySelector("#viewSaves").addEventListener("click", viewSaves);

function renderBtns() {
  clearOutByID("buttons");
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
  if (localStorage.getItem("favGifs").length === 0) {
    alert("Save some items first!");
  } else {
    viewSaved = true;
    clearOutByID("targetDiv");
    const saved = localStorage.getItem("favGifs").split(",");
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

function replaceSpaces(string) {
  return string.replace(/ GIF/, "").replace(/[\s]/g, "_");
}

function addToLocal(name, value) {
  let exists = localStorage.getItem(name);

  exists = exists ? exists.split(",") : [];
  exists.push(value);

  localStorage.setItem(name, exists.toString());
}

function removeFromLocal(name, value) {
  let exists = localStorage.getItem(name);

  exists = exists ? exists.split(",") : [];
  exists = exists.filter(item => item !== value);

  localStorage.setItem(name, exists.toString());
}

function clearOutByID(target) {
  const targetDiv = document.querySelector(`#${target}`);
  while (targetDiv.firstChild) {
    targetDiv.removeChild(targetDiv.firstChild);
  }
}

function renderGifs(item) {
  const elImg = document.createElement("img");
  const elRating = document.createElement("p");
  const newDiv = document.createElement("div");
  const dLoad = document.createElement("span");
  const save = document.createElement("span");

  // grab data from response
  const id = item.id;
  const animated = item.images.fixed_width.url;
  const still = item.images.fixed_width_still.url;
  const rating = item.rating;

  // append text and place in div
  dLoad.className = "iconDownload";
  dLoad.innerHTML = `<a href=${
    item.images.downsized_medium.url
  } download=${replaceSpaces(
    item.title
  )} target="_blank"><i class='fas fa-external-link-square-alt'/></a>`;
  save.className = "iconSave";
  if (localStorage.getItem("favGifs").includes(id)) {
    save.innerHTML = `<i class="fas fa-heart" data-save="saved"></i>`;
  } else {
    save.innerHTML = `<i class="far fa-heart" data-save="unsaved"></i>`;
  }
  save.addEventListener("click", e => {
    let btn = e.target;
    let gifID = btn.parentElement.parentElement.firstChild.dataset.id;
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
  elRating.appendChild(document.createTextNode(`Rated: ${rating}`));
  elRating.style.textAlign = "center";
  elRating.className = "animated zoomInLeft";
  elImg.src = still;
  elImg.setAttribute("data-id", id);
  elImg.setAttribute("data-state", "still");
  elImg.className = "animated flipInY";
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
  newDiv.className = "imgContainer";
  newDiv.append(elImg);
  newDiv.append(elRating);
  newDiv.append(dLoad);
  newDiv.append(save);
  // append to document
  document.querySelector("#targetDiv").prepend(newDiv);
}

function clearSaves() {
  localStorage.setItem("favGifs", "");
  alert("Local storage cleared.");
  document.location.reload();
}

const API_KEY = "29kNYcuu8j6tch4gMNKSN5VQQufCvlGp";
const topics = [
  "basketball",
  "football",
  "tennis",
  "rock climbing",
  "baseball"
];

document.addEventListener("DOMContentLoaded", renderBtns);
document.querySelector("#addSport").addEventListener("submit", function(e) {
  e.preventDefault();
  console.log(e);
  input = e.target.elements.input.toLowerCase();
  if (topics.indexOf(input.value) === -1) {
    topics.push(input.value);
  } else {
    alert("This button's already here.");
  }
  input.value = "";
  renderBtns();
});

function renderBtns() {
  while (document.querySelector("#buttons").firstChild) {
    document
      .querySelector("#buttons")
      .removeChild(document.querySelector("#buttons").firstChild);
  }
  topics.forEach(topic => {
    const el = document.createElement("button");
    el.appendChild(document.createTextNode(topic));
    el.setAttribute("data-name", topic);
    el.addEventListener("click", getGifs);
    document.querySelector("#buttons").append(el);
  });
}

function getGifs() {
  const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${
    this.dataset.name
  }&limit=8&offset=${Math.floor(Math.random() * 50)}&lang=en`;
  fetch(queryURL, { mode: "cors" })
    .then(data => data.json())
    .then(data => {
      if (data.data !== undefined) {
        console.log(data);
        results = data.data;
        results.forEach(item => {
          // create elements
          const elImg = document.createElement("img");
          const elRating = document.createElement("p");
          const newDiv = document.createElement("div");
          const dLoad = document.createElement("span");

          // grab data from response
          const animated = item.images.fixed_width.url;
          const still = item.images.fixed_width_still.url;
          const rating = item.rating;

          // append text and place in div
          dLoad.className = "iconFA";
          dLoad.innerHTML = `<a href=${
            item.images.downsized_medium.url
          } download=${replaceSpaces(
            item.title
          )} target="_blank"><i class='fas fa-external-link-square-alt'/></a>`;
          elRating.appendChild(document.createTextNode(rating));
          elRating.style.textAlign = "center";
          elImg.src = still;
          elImg.setAttribute("data-state", "still");
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
          // append to document
          document.querySelector("#targetDiv").prepend(newDiv);
        });
        // if undefined response, throw error
      } else {
        throw new Error("data returned as undefined, check what was entered");
      }
    })
    //catch errors
    .catch(err => console.error(err));
}

function changeState() {
  if (this.hasAttribute("data-state", "still")) {
    this.url = animated;
  } else {
    this.url = still;
  }
}

function replaceSpaces(string) {
  return string.replace(/ GIF/, "").replace(/[\s]/g, "_");
}

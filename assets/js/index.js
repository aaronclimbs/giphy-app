const API_KEY = "29kNYcuu8j6tch4gMNKSN5VQQufCvlGp";
const topics = ["basketball", "soccer", "tennis", "climbing"];

document.addEventListener("DOMContentLoaded", renderBtns);
document.addEventListener("submit", function(e) {
  e.preventDefault();
  val = e.target.value;
  topics.push(val);
  renderBtns();
});

/*
 `q`
 `limit`
 `rating`
*/

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
  queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${
    this.dataset.name
  }&limit=5&offset=0&lang=en`;
  fetch(queryURL, { credentials: "include", mode: "cors" })
    .then(data => data.json())
    .then(data => {
      console.log(data);
      results = data.data;
      results.forEach(item => {
        // create elements
        const elTitle = document.createElement("h4");
        const elImg = document.createElement("img");
        const elRating = document.createElement("p");
        const newDiv = document.createElement("div");

        // grab data from response
        const title = item.title.replace(/ GIF.*/g, "");
        const imgSrc = item.url;
        const rating = item.rating;

        // append text and place in div
        elTitle.appendChild(document.createTextNode(title));
        elRating.appendChild(document.createTextNode(rating));
        elImg.src = imgSrc;
        newDiv.append(elImg);
        newDiv.append(elTitle);
        newDiv.append(elRating);

        // append to document
        document.querySelector("#targetDiv").append(newDiv);
      });
    });
}

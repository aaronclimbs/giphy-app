const API_KEY = "29kNYcuu8j6tch4gMNKSN5VQQufCvlGp";
const topics = ["basketball", "soccer", "tennis", "climbing"];

document.addEventListener("DOMContentLoaded", renderBtns);
document.addEventListener("submit", function(e) {
  e.preventDefault();
  val = e.target.value;
  topics.push(val);
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
// send the right headers
// correct content-type
// legal 'access-control-allow-origin' on the response

function getGifs() {
  const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${
    this.dataset.name
  }&limit=5&offset=0&lang=en`;
  fetch(queryURL, { mode: "cors" })
    .then(data => data.json())
    .then(data => {
      if (data.data !== undefined) {
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
          const imgSrc = item.embed_url;
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
        // if undefined response, throw error
      } else {
        throw new Error("data returned as undefined, check what was entered");
      }
    })
    //catch errors
    .catch(err => console.error(err));
}

function getGifsTenor() {
  $("button").on("click", function() {
    var queryURL =
      "https://api.tenor.com/v1/search?=" +
      this.dataset.name +
      "&key=LIVDSRZULELA&limit=10";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      let results = response.results;
      console.log(results);

      results.forEach(item => {
        // create elements
        const elTitle = document.createElement("h4");
        elTitle.appendChild(
          document.createTextNode(item.title.replace(/ GIF.*/g, ""))
        );
        const elImg = document.createElement("img");
        elImg.src = item.url;
        const elRating = document.createElement("p");
        elRating.appendChild(document.createTextNode(item.rating));
        const newDiv = document.createElement("div");

        // append text and place in div
        newDiv.append(elImg);
        newDiv.append(elTitle);
        newDiv.append(elRating);

        // append to document
        document.querySelector("#targetDiv").prepend(newDiv);
      });
    });
  });
}

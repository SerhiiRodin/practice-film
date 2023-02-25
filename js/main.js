const KEY = "345007f9ab440e5b86cef51be6397df1";

const box = document.querySelector(".box");
const trailerBox = document.querySelector(".trailer");
const guard = document.querySelector(".guard");

let options = {
  root: null,
  rootMargin: "100px",
  threshold: 1.0,
};

let page = 1;

let observer = new IntersectionObserver(callback, options);

function onFetchMovies(page = 1) {
  return fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}&page=${page}`
  ).then((res) => {
    if (!res.ok) {
      throw new Error("error");
    }
    return res.json();
  });
  // .then((data) => {
  //   console.log(data);
  //   createCard(data.results);
  // });
}

onFetchMovies().then((data) => {
  createCard(data.results);

  observer.observe(guard);
});
// fetch(`https://api.themoviedb.org/3/movie/id/videos?api_key=${KEY}`)
//   .then((res) => {
//     if (!res.ok) {
//       throw new Error("error");
//     }
//     return res.json();
//   })
//   .then((data) => {
//     console.log(data);
//     createCard(data.results);
//   });

box.addEventListener("click", onClick);

function createCard(arr) {
  const marcup = arr
    .map(({ id, title, poster_path }) => {
      return `<li class="item" data-id="${id}">
        <img class="test" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}">
        <p class="test">${title}</p>
    </li>`;
    })
    .join("");

  box.insertAdjacentHTML("beforeend", marcup);
}

function onClick(e) {
  if (e.target.classList.contains("test")) {
    const item = e.target.closest("li");
    const { id } = item.dataset;

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${KEY}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("error");
        }
        return res.json();
      })
      .then((data) => {
        onClickPlayer(data.results);
      });
  }
}

function onClickPlayer(arr) {
  const item = arr.find(
    ({ site, type }) => site === "YouTube" && type === "Trailer"
  );
  const instance = basicLightbox.create(
    `<div><iframe src="https://www.youtube.com/embed/${item.key}"</div>`
  );

  instance.show();
}

function callback(entries) {
  if (entries[0].isIntersecting) {
    page += 1;
    onFetchMovies(page).then((data) => {
      createCard(data.results);
      if (data.total_pages === page) {
        observer.unobserve(guard);
      }
    });
  }
}

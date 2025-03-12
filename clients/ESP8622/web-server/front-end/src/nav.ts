const navbar = document.querySelector("div.navbar");

if (!navbar) {
  throw new Error("No navbar element found!");
}

const pages = [
  {
    name: "Home",
    path: "index.html",
  },
  {
    name: "Config",
    path: "config.html",
  },
  {
    name: "Scheduler",
    path: "scheduler.html",
  },
];
const navItems = document.createElement("nav");
navItems.classList.add("nav-items");

pages
  .map((page) => {
    const a = document.createElement("a");
    a.href = page.path;
    a.innerHTML = page.name;

    return a;
  })
  .forEach((item) => {
    navItems.appendChild(item);
  });

navbar.appendChild(navItems);

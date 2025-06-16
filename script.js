const icon = document.getElementById("webCifar-icon");
const sidebox = document.getElementById("webCifar");
const close = document.querySelector(".close");

icon.addEventListener("click", () => {
  sidebox.classList.add("active");
});

close.addEventListener("click", () => {
  sidebox.classList.remove("active");
});

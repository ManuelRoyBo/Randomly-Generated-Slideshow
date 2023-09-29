const NB_OF_IMAGES = 68;
const SLIDE_CHANGE_COOLDOWN = 100; //in ms

const FONTS = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT"];

const FULLSCREEN_BUTTON = document.getElementById("fullscreen-button");
FULLSCREEN_BUTTON.addEventListener("click", toggleFullScreen);

const RESTART_BUTTON = document.getElementById("restart-button");

const INTRO_SLIDE_DIV = document.getElementById("intro-slide");
const OUTRO_SLIDE_DIV = document.getElementById("outro-slide");

const SELECT_LANGUAGE_SELECT = document.getElementById("select-language");
const DEFAULT_LANGUAGE = "EN";
const LANGUAGES = {
  EN: "English",
  FR: "Français",
};

const SLIDE_STRUCTURE = [
  "introText",
  "subject",
  "image",
  "image",
  "teaser",
  "image",
  "image",
  "quote",
  "image",
  "image",
  "outroText",
];

const NB_OF_IMAGES_IN_FILE_STRUCTURE = getNumberOfImagesInSlideStructure();
const IMAGES = getAllImages();

let TEXT;
let currentSlide = 0;
let selectedLanguage = DEFAULT_LANGUAGE;

function getAllImages() {
  let images = [];
  for (let i = 0; i < NB_OF_IMAGES; i++) {
    images.push(`img/${i}.jpg`);
  }
  return images;
}

function setLanguageFromLocalStorage() {
  if (Object.keys(LANGUAGES).includes(localStorage.getItem("language"))) {
    selectedLanguage = localStorage.getItem("language");
  } else {
    localStorage.setItem("language", DEFAULT_LANGUAGE);
    selectedLanguage = DEFAULT_LANGUAGE;
  }
  
  let selectedLanguageOption = SELECT_LANGUAGE_SELECT.querySelector(
    `option[value="${selectedLanguage}"]`
  );
  selectedLanguageOption.setAttribute("selected", "selected");
}

function setRandomFont() {
  let randomFont = FONTS[Math.floor(Math.random() * FONTS.length)];
  document.body.style.fontFamily = randomFont;
}

SELECT_LANGUAGE_SELECT.addEventListener("change", function () {
  const selectedLanguage = this.value;
  localStorage.setItem("language", selectedLanguage);
  location.reload();
});

function start() {
  setRandomFont();
  setLanguageFromLocalStorage();

  fetch(`text/${selectedLanguage}.json`)
  .then((response) => response.json())
  .then((text) => {
    TEXT = text;
    createSlideShow();
    showCurrentSlide();
  })
  .catch((error) => {
    console.error("Error loading JSON file:", error);
  });
}


RESTART_BUTTON.addEventListener("click", function () {
      location.reload();
  });

function hideHeader() {
  document.getElementsByTagName("header")[0].classList.add("hidden");
}

function showHeader() {
  document.getElementsByTagName("header")[0].classList.remove("hidden");
}

function showCurrentSlide() {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide) => {
    if (slide.getAttribute("data-slide-index") == currentSlide) {
      slide.classList.remove("hidden");
    } else {
      slide.classList.add("hidden");
    }
  });

  //header
  if(currentSlide === 0){
    showHeader();
  }
  else
  {
    hideHeader();
  }

}

let canChangeSlide = true;
function putSlideChangeOnCooldown() {
  canChangeSlide = false;
    setTimeout(function () {
      canChangeSlide = true;
    }, SLIDE_CHANGE_COOLDOWN);
}

document.addEventListener("click", function (event) {
  if (canChangeSlide) {
    if (event.target.closest(".slide")){
      currentSlide++;
      if (currentSlide >= SLIDE_STRUCTURE.length) {
        currentSlide = SLIDE_STRUCTURE.length - 1;
      }
      showCurrentSlide();
      putSlideChangeOnCooldown();
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (canChangeSlide) {
    if (event.key === "ArrowRight" || event.key === " ") {
      currentSlide++;
      if (currentSlide >= SLIDE_STRUCTURE.length) {
        currentSlide = SLIDE_STRUCTURE.length - 1;
      }
      showCurrentSlide();
    } else if (event.key === "ArrowLeft") {
      currentSlide--;
      if (currentSlide < 0) {
        currentSlide = 0;
      }
      showCurrentSlide();
    }
    putSlideChangeOnCooldown();
  }
});

function getNumberOfImagesInSlideStructure() {
  let nbOfImages = 0;
  for (let i = 0; i < SLIDE_STRUCTURE.length; i++) {
    if (SLIDE_STRUCTURE[i] === "image") {
      nbOfImages++;
    }
  }
  return nbOfImages;
}

function createSlideShow() {
  let images = generateRandomImages(NB_OF_IMAGES_IN_FILE_STRUCTURE);
  for (let i = 0; i < SLIDE_STRUCTURE.length; i++) {
    element = SLIDE_STRUCTURE[i];
    switch (element) {
      case "introText":
        modifyIntroText(TEXT["intro-text"]);
        break;
      case "subject":
        createTextSlide(generateRandomSubject(), i);
        break;
      case "image":
        createImageSlide(images.pop(), i);
        break;
      case "teaser":
        createTextSlide(generateRandomTeaser(), i);
        break;
      case "quote":
        createTextSlide(generateRandomQuote(), i);
        break;
      case "outroText":
        modifyOutroText(TEXT["outro-text"], i);
        break;
    }
  }
}

function createImageSlide(imagePath, slideIndex) {
  let imageSlide = document.createElement("div");
  imageSlide.className = "image-slide slide";
  imageSlide.setAttribute("data-slide-index", slideIndex);
  let image = document.createElement("img");
  image.src = imagePath;
  imageSlide.appendChild(image);
  document.body.appendChild(imageSlide);
}

function createTextSlide(text, slideIndex) {
  let textSlide = document.createElement("div");
  textSlide.className = "text-slide slide";
  textSlide.setAttribute("data-slide-index", slideIndex);
  let textParagraph = document.createElement("h1");
  textParagraph.innerHTML = text;
  textSlide.appendChild(textParagraph);
  document.body.appendChild(textSlide);
}

function modifyIntroText(introText) {
  let introTextH1 = INTRO_SLIDE_DIV.getElementsByTagName("h1")[0];
  introTextH1.innerHTML = introText;
}

function modifyOutroText(outroText, slideIndex) {
  OUTRO_SLIDE_DIV.setAttribute("data-slide-index", slideIndex);
  let outroTextH1 = OUTRO_SLIDE_DIV.getElementsByTagName("h1")[0];
  outroTextH1.innerHTML = outroText;
}

function generateRandomQuote() {
  let quotes = TEXT["quotes"];
  let autors = TEXT["quote-autors"];
  let randomQuoteIndex = Math.floor(Math.random() * quotes.length);
  let randomAutorIndex = Math.floor(Math.random() * autors.length);

  return (
    quotes[randomQuoteIndex] + " <h2><br><i>- " + autors[randomAutorIndex] + "</i></h2>"
  );
}

function generateRandomImages(amount) {
  let images = [];
  while (images.length < amount) {
    let randomImage = generateRandomImage();
    if (!images.includes(randomImage)) {
      images.push(randomImage);
    }
  }
  return images;
}

function generateRandomImage() {
  return IMAGES[Math.floor(Math.random() * NB_OF_IMAGES)];
}

function generateRandomSubject() {
  let subjects = TEXT.subjects;
  return subjects[Math.floor(Math.random() * subjects.length)];
}

function generateRandomTeaser() {
  let teasers = TEXT["teasers"];
  return teasers[Math.floor(Math.random() * teasers.length)];
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

start();
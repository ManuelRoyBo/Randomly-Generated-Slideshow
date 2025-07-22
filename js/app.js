const NB_OF_IMAGES = 81;
const SLIDE_CHANGE_COOLDOWN = 100; //in ms
const FACTS_SLIDE_LIST_TYPES_AND_STYLES = {
  "ul": ["disc", "circle", "square"],
  "ol": ["decimal", "lower-alpha", "lower-roman", "upper-alpha", "upper-roman"],
}
const FACT_AMOUNT_PER_FACTS_SLIDE = 5;

const FONTS = [
  'Copperplate Gothic',
  'Helvetica',
  'stencil',
  'Candara',
  'Impact',
  'Verdana',
  'Rockwell',
  'Courier New',
  'Brush Script MT',
  'papyrus',
  'Comic Sans MS, cursive',
  "Arial",
  "Tahoma",
  "Trebuchet MS",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT"
];

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
  /*"facts",*/
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
      goToNextSlide();
      putSlideChangeOnCooldown();
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (canChangeSlide) {
    if (event.key === "ArrowRight" || event.key === " ") {
      goToNextSlide();
    } else if (event.key === "ArrowLeft") {
      goToPreviousSlide();
    }
    putSlideChangeOnCooldown();
  }
});

function goToNextSlide() {
  currentSlide++;
  if (currentSlide >= SLIDE_STRUCTURE.length) {
    currentSlide = SLIDE_STRUCTURE.length - 1;
  }
  showCurrentSlide();
}

function goToPreviousSlide() {
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = 0;
  }
  showCurrentSlide();
}

function getNumberOfImagesInSlideStructure() {
  let nbOfImages = 0;
  for (let i = 0; i < SLIDE_STRUCTURE.length; i++) {
    if (SLIDE_STRUCTURE[i] === "image" || SLIDE_STRUCTURE[i] === "facts") {
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
      case "facts":
        createFactsSlide(generateRandomFactsTitle(), generateRandomFacts(),images.pop(), i);
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
  imageSlide.style.backgroundColor = getRandomColor();
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

  //Colours yay.
  textColor = getRandomColor();
  backgroundColor = getRandomColorWithContrast(textColor);

  textSlide.style.backgroundColor = backgroundColor;
  textSlide.style.color = textColor;
}

function createFactsSlide(factTitle, facts, imagePath, slideIndex) {
  let factsSlide = document.createElement("div");
  factsSlide.className = "facts-slide slide";
  factsSlide.setAttribute("data-slide-index", slideIndex);
  let randomListType = Object.keys(FACTS_SLIDE_LIST_TYPES_AND_STYLES)[Math.floor(Math.random() * Object.keys(FACTS_SLIDE_LIST_TYPES_AND_STYLES).length)];
  let factsListStyle = FACTS_SLIDE_LIST_TYPES_AND_STYLES[randomListType][Math.floor(Math.random() * FACTS_SLIDE_LIST_TYPES_AND_STYLES[randomListType].length)];
  let factsList = document.createElement(randomListType);
  factsList.style.listStyleType = factsListStyle;

  textColor = getRandomColor();
  backgroundColor = getRandomColorWithContrast(textColor);

  let factsTitle = document.createElement("h2");
  factsTitle.innerHTML = factTitle;
  factsList.appendChild(factsTitle);
  facts.forEach((fact) => {
    let factItem = document.createElement("li");
    factItem.innerHTML = fact;
    factsList.appendChild(factItem);
    factItem.style.color = textColor;
  });
  
  factsSlide.appendChild(factsList);
  factsSlide.style.backgroundColor = backgroundColor;
  factsSlide.style.color = textColor;
  document.body.appendChild(factsSlide);

  let image = document.createElement("img");
  image.src = imagePath;
  factsSlide.appendChild(image); 

  console.log(factsList);

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

function generateRandomFactsTitle() {
  let factsTitles = TEXT["facts-titles"];
  return factsTitles[Math.floor(Math.random() * factsTitles.length)];
}

function generateRandomFacts(factsAmount = FACT_AMOUNT_PER_FACTS_SLIDE) {
  let facts = TEXT["facts"];
  let randomFacts = [];
  while (randomFacts.length < factsAmount) {
    let randomFact = facts[Math.floor(Math.random() * facts.length)];
    if (!randomFacts.includes(randomFact)) {
      randomFacts.push(randomFact);
    }
  }
  return randomFacts;
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

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 1; i <= 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomColorWithContrast(otherColor) {
  const getBrightness = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const minContrast = 128;
  let newColor;
  do {
    newColor = getRandomColor();
  } while (Math.abs(getBrightness(newColor) - getBrightness(otherColor)) < minContrast);

  return newColor;
}

start();
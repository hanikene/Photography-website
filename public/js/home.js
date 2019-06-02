window.onload = changeContentColorInitiationReverse;
window.onresize = configPhotoSizing;
configButtons();

let refreshSpacingPhotosOnLoad = setInterval(function() {
  configPhotoSizing();
  window.addEventListener('load', () =>
    clearInterval(refreshSpacingPhotosOnLoad)
  );
}, 100);

function configPhotoSizing() {
  const mobileFormat = 14 / 9;
  if (
    window.innerWidth <= 440 ||
    window.innerHeight / window.innerWidth >= mobileFormat
  ) {
    configHorizontalSpacingPhoto(1, 100, 0, 0);
  } else if (window.innerWidth <= 750) {
    configHorizontalSpacingPhoto(2, 45, 2, 2);
  } else if (window.innerWidth <= 2000) {
    configHorizontalSpacingPhoto(3, 27, 2.5, 3.5);
  } else {
    configHorizontalSpacingPhoto(4, 22, 2, 1);
  }
}

function changeContentColorInitiationReverse(delayTime = 25) {
  let hexaNumbers = DoubleHexa();
  hexaNumbers = hexaNumbers.reverse();
  const h1 = document.querySelector('#mainContainer h1');
  const h2 = document.querySelector('#mainContainer h2');

  hexaNumbers.forEachWithDelay(function(number) {
    h1.style.color = `#${number}${number}${number}`;
    h2.style.color = `#${number}${number}${number}`;
    if (h1.style.color === 'rgb(0, 0, 0)') {
      changeContentColorInitiation(delayTime);
    }
  }, delayTime);
}

function changeContentColorInitiation(delayTime) {
  let hexaNumbers = DoubleHexa();
  const h1 = document.querySelector('#mainContainer h1');
  const h2 = document.querySelector('#mainContainer h2');

  hexaNumbers.forEachWithDelay(function(number) {
    h1.style.color = `#${number}${number}${number}`;
    h2.style.color = `#${number}${number}${number}`;
  }, delayTime);
}

Array.prototype.forEachWithDelay = function(callBack, delay) {
  function loopFunctionCallBack() {
    setTimeout(
      function() {
        callBack(this[i], i, this);
        i++;
        if (i < this.length) {
          loopFunctionCallBack.call(this);
        }
      }.bind(this),
      delay
    );
  }
  let i = 0;
  loopFunctionCallBack.call(this);
};

function DoubleHexa() {
  const hexa16bits = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f'
  ];
  const hexa256bits = [];
  hexa16bits.forEach(hexaSecondeNumber => {
    hexa16bits.forEach(hexaFirstNumber => {
      hexa256bits.push(hexaSecondeNumber + hexaFirstNumber);
    });
  });
  return hexa256bits;
}

function configButtons() {
  const photoButton = document.querySelector(
    '#mainContainer ul li:first-of-type'
  );
  const photoContainer = document.getElementById('photoContainer');
  const closeButtonPhoto = document.querySelector('#closeButton1 span');

  photoButton.addEventListener('click', () => {
    photoContainer.style.display = 'block';
    configPhotoSizing();
  });
  closeButtonPhoto.addEventListener(
    'click',
    () => (photoContainer.style.display = 'none')
  );

  /* const contactButton = document.querySelector('#mainContainer ul li:nth-of-type(3)');
  const contactContainer = document.getElementById('contactContainer');
  const closeButtonContact = document.querySelector('#closeButton2 span');

  contactButton.addEventListener("click", () => contactContainer.style.display = "block");
  closeButtonContact.addEventListener("click", () => contactContainer.style.display = "none"); */

  const photos = Array.from(document.querySelectorAll('#photoContainer img'));
  const photoPage = document.getElementById('photoPage');
  const photoPageDiv = document.querySelector('#photoPage div:last-child');
  const closeButtonPhotoPage = document.querySelector('#closeButton3 span');
  const previousButton = document.getElementById('previous');
  const nextButton = document.getElementById('next');
  const mobileFormat = 14 / 7;
  let scrollPixel = 0;
  let currentId;

  closeButtonPhotoPage.addEventListener('click', () => {
    closePhotoPage();
  });

  function closePhotoPage() {
    photoPage.style.display = 'none';
    photoContainer.style.display = 'block';
    configPhotoSizing();
    window.scrollBy(0, scrollPixel);
    photoPageDiv.removeChild(document.querySelector('#photoPage img'));
  }

  photos.forEach(photo => {
    let id = photo.getAttribute('id');
    photo.addEventListener('click', function() {
      if (
        !(
          window.innerWidth <= 440 ||
          window.innerHeight / window.innerWidth >= mobileFormat
        )
      ) {
        scrollPixel = window.scrollY;
        photoPage.style.display = 'block';
        photoContainer.style.display = 'none';
        currentId = id;
        createImageElement(currentId);
      }
    });
  });

  previousButton.addEventListener('click', () => {
    handlePrevious();
  });

  nextButton.addEventListener('click', () => {
    handleNext();
  });

  function handlePrevious() {
    if (currentId + 1 < photos.length) {
      currentId++;
      currentId = treeNumberMaker(currentId);
      photoPageDiv.removeChild(document.querySelector('#photoPage img'));
      createImageElement();
    }
  }

  function handleNext() {
    if (currentId - 1 >= 0) {
      currentId--;
      currentId = treeNumberMaker(currentId);
      photoPageDiv.removeChild(document.querySelector('#photoPage img'));
      createImageElement();
    }
  }

  function treeNumberMaker(id) {
    if (id < 10) {
      id = '00' + id;
    } else if (id < 100) {
      id = '0' + id;
    }
    return id;
  }

  function createImageElement() {
    const imageHTML = document.createElement('img');
    imageHTML.setAttribute('src', `photos/${currentId}.jpg`);
    imageHTML.setAttribute('class', `photoPage`);
    photoPageDiv.appendChild(imageHTML);
    currentId = Number(currentId);
    checkButtonsTransparency(currentId);
  }

  function checkButtonsTransparency(id) {
    previousButton.classList.add('previousActive');
    previousButton.style.opacity = '1';
    nextButton.classList.add('nextActive');
    nextButton.style.opacity = '1';
    if (id === photos.length - 1) {
      previousButton.classList.remove('previousActive');
      previousButton.style.opacity = '0.2';
    } else if (id === 0) {
      nextButton.classList.remove('nextActive');
      nextButton.style.opacity = '0.2';
    }
  }

  document.onkeydown = handleKeypress;

  function handleKeypress(event) {
    if (photoPage.style.display === 'block') {
      handleKeypressPhotoPage(event);
    } else if (photoContainer.style.display === 'block') {
      handleKeypressPhotoContainer(event);
    }
  }

  function handleKeypressPhotoPage(event) {
    switch (event.which) {
      case 39:
        handleNext();
        return null;
      case 37:
        handlePrevious();
        return null;
      case 27:
        closePhotoPage();
        return null;
    }
  }

  function handleKeypressPhotoContainer(event) {
    if (event.which === 27) {
      photoContainer.style.display = 'none';
    }
  }
}

function configHorizontalSpacingPhoto(
  PhotosPerRow,
  widthImage,
  spaceBetweenPhotos,
  spaceSide
) {
  const photos = Array.from(document.querySelectorAll('#photoContainer img'));
  let leftSpacePhotoInit = spaceSide + spaceBetweenPhotos;

  for (var i = 0; i < PhotosPerRow; i++) {
    let leftSpacePhoto =
      leftSpacePhotoInit + (widthImage + spaceBetweenPhotos) * i;
    photos
      .filter(photo => !((photos.indexOf(photo) - i) % PhotosPerRow))
      .forEach(photo => {
        photo.style.left = `${leftSpacePhoto}%`;
        photo.style.width = `${widthImage}%`;
      });
  }
  configVerticalSpacingPhoto(PhotosPerRow, spaceBetweenPhotos);
}

function configVerticalSpacingPhoto(PhotosPerRow, spaceBetweenPhotos) {
  if (spaceBetweenPhotos === 0) {
    spaceBetweenPhotos = 3;
  }

  const photos = Array.from(document.querySelectorAll('#photoContainer img'));
  let closeButtonHeight = 64; // px
  spaceBetweenPhotos *= window.innerHeight * 0.01 * 2;

  photos.forEach(photo => {
    let placePhoto = photos.indexOf(photo) + 1;
    let placePhotoInRow = placePhoto % PhotosPerRow;

    let spacingPhotoTop = photos
      .filter(photoFilter => {
        let placePhotoFilter = photos.indexOf(photoFilter) + 1;
        let placePhotoFilterInRow = placePhotoFilter % PhotosPerRow;
        return placePhotoFilterInRow === placePhotoInRow;
      })
      .reduce((totalHeight, nextPhoto) => {
        let placePhotoNext = photos.indexOf(nextPhoto) + 1;
        if (placePhotoNext < placePhoto) {
          return totalHeight + nextPhoto.height + spaceBetweenPhotos;
        }
        return totalHeight;
      }, closeButtonHeight);

    photo.style.top = `${spacingPhotoTop}px`;
  });
  renderPhotoContainerHeight(
    PhotosPerRow,
    spaceBetweenPhotos,
    closeButtonHeight
  );
}

function renderPhotoContainerHeight(
  PhotosPerRow,
  spaceBetweenPhotos,
  closeButtonHeight
) {
  const photos = Array.from(document.querySelectorAll('#photoContainer img'));
  const photoContainer = document.querySelector('#photoContainer');
  let maxHeightColumn = 0;

  for (let i = 0; i < PhotosPerRow; i++) {
    let heightColumn = photos
      .filter(photo => {
        let photoPlace = photos.indexOf(photo) + 1;
        let PhotoPlaceRow = photoPlace % PhotosPerRow;
        return PhotoPlaceRow === (i + 1) % PhotosPerRow;
      })
      .reduce((accumulator, nextPhoto) => {
        return accumulator + nextPhoto.height + spaceBetweenPhotos;
      }, closeButtonHeight);
    if (heightColumn > maxHeightColumn) {
      maxHeightColumn = heightColumn;
    }
  }
  photoContainer.style.height = `${maxHeightColumn}px`;
}

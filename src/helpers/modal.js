export function messageTemplate(message) {
  return `<div style='margin: 20px 0; font-size: 20px; color: #eaeaea;'>${message}</div>`;
}

function getModalWidth() {
  var clientWidth = document.body.clientWidth;
  if (clientWidth > 500) {
    return "500px";
  }
  return "80%";
}

export function initOverlay() {
  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.zIndex = "10000";
    overlay.style.display = "block";
    overlay.style.background = "rgba(0, 0, 0, .3)";
    overlay.style.left = "0";
    overlay.style.right = "0";
    overlay.style.top = "0";
    overlay.style.bottom = "0";
    document.body.append(overlay);
  }

  overlay.style.display = "block";
}

export function initModalWindow(
  html,
  backgroundColor = "#616467",
  closeIconColor
) {
  let modalWindow = document.getElementById("modalwindow");
  let modalContent = document.getElementById("modalContent");
  if (!modalWindow) {
    modalWindow = document.createElement("div");
    modalWindow.id = "modalwindow";
    modalWindow.style.position = "fixed";
    modalWindow.style.zIndex = "10001";
    modalWindow.style.top = "0";
    modalWindow.style.left = "0";
    modalWindow.style.width = "100%";
    modalWindow.style.height = "100%";
    modalWindow.style.display = "flex";
    modalWindow.style.justifyContent = "center";
    modalWindow.style.alignItems = "center";

    modalContent = document.createElement("div");
    modalWindow.id = "modalContent";
    modalContent.style.position = "relative";
    modalContent.style.padding = "20px";
    modalContent.style.border = "1px solid #31353A";
    modalContent.style.borderRadius = "4px";
    modalContent.style.boxShadow = "0 0 10px #444";
    modalContent.style.width = getModalWidth();

    modalWindow.append(modalContent);
    document.body.append(modalWindow);

    // handler to close the window when the background is clicked
    modalWindow.onclick = function (e) {
      if (this === e.target) {
        let overlay = document.getElementById("overlay");
        overlay.style.display = "none";
        this.style.display = "none";
      }
    };
  }

  modalContent.style.backgroundColor = backgroundColor;
  modalContent.innerHTML = html;

  // modal close element
  let closeIcon = document.createElement("div");
  closeIcon.classList = "modal-close-icon";
  closeIcon.style.color = closeIconColor;
  addStyleCloseIcon();

  closeIcon.onclick = function () {
    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    modalWindow.style.display = "none";
  };

  modalContent.append(closeIcon);
}

function addStyleCloseIcon() {
  var style = document.createElement("style");
  style.textContent = `
    .modal-close-icon {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 20px;
      height: 20px;
      opacity: 0.5;
      transition: opacity .1s ease-in-out;
    }
    .modal-close-icon:hover {
      opacity: 1;
    }
    .modal-close-icon:before, .modal-close-icon:after {
      content: ' ';
      position: absolute;
      left: 8px;
      height: 20px;
      width: 2px;
      background-color: currentColor;
    }
    .modal-close-icon:before {
      transform: rotate(45deg);
    }
    .modal-close-icon:after {
      transform: rotate(-45deg);
    }  
  `;

  document.head.appendChild(style);
}

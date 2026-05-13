'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });







// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // Custom Email Validation Message
    if (formInputs[i].type === "email") {
      if (formInputs[i].validity.patternMismatch) {
        formInputs[i].setCustomValidity("Please enter a valid email address (e.g., name@example.com)");
      } else {
        formInputs[i].setCustomValidity("");
      }
    }

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// Open Source Modal Logic (Tailwind version)
const osModalBtn = document.querySelector("#os-modal-btn");
const osModalWrapper = document.querySelector("#os-modal-wrapper");
const osModalBackdrop = document.querySelector("#os-modal-backdrop");
const osModalPanel = document.querySelector("#os-modal-panel");
const osModalCloseBtn = document.querySelector("#os-modal-close-btn");

if (osModalWrapper && osModalBtn) {
  let isOsModalOpen = false;

  const openOsModal = () => {
    isOsModalOpen = true;
    
    // Scroll Lock
    document.body.style.overflow = 'hidden';

    // Show wrapper
    osModalWrapper.classList.remove("pointer-events-none", "opacity-0");
    osModalWrapper.classList.add("opacity-100");

    // Fade in Backdrop
    osModalBackdrop.classList.remove("opacity-0", "pointer-events-none");
    osModalBackdrop.classList.add("opacity-100", "pointer-events-auto");

    // Animate Panel (fade in & scale up)
    osModalPanel.classList.remove("opacity-0", "scale-95");
    osModalPanel.classList.add("opacity-100", "scale-100", "pointer-events-auto");

    // Focus Management
    setTimeout(() => {
      osModalCloseBtn.focus();
    }, 50);
  };

  const closeOsModal = () => {
    isOsModalOpen = false;

    // Scroll Unlock
    document.body.style.overflow = '';

    // Hide wrapper
    osModalWrapper.classList.remove("opacity-100");
    osModalWrapper.classList.add("pointer-events-none", "opacity-0");

    // Fade out Backdrop
    osModalBackdrop.classList.remove("opacity-100", "pointer-events-auto");
    osModalBackdrop.classList.add("opacity-0", "pointer-events-none");

    // Animate Panel (fade out & scale down)
    osModalPanel.classList.remove("opacity-100", "scale-100", "pointer-events-auto");
    osModalPanel.classList.add("opacity-0", "scale-95");
  };

  // Event Listeners
  osModalBtn.addEventListener("click", openOsModal);
  if (osModalCloseBtn) osModalCloseBtn.addEventListener("click", closeOsModal);

  // Click Outside
  if (osModalBackdrop) {
    osModalBackdrop.addEventListener("click", closeOsModal);
  }

  // Escape Key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOsModalOpen) {
      closeOsModal();
    }
  });
}

// Handle Form Submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Populate to_name for EmailJS
  const fullnameInput = form.querySelector('[name="fullname"]');
  const toNameInput = document.getElementById("to_name_field");
  if (fullnameInput && toNameInput) {
    toNameInput.value = fullnameInput.value;
  }

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  formBtn.setAttribute("disabled", "");
  formBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';

  // 1. Send to Web3Forms (Admin)
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      if (response.status == 200) {
        
        // 2. Send Auto-reply via EmailJS (Visitor)
        // REPLACE SERVICE_ID and TEMPLATE_ID with your actual EmailJS IDs
        // Form fields (fullname, email, message) are automatically mapped if they match template params
        emailjs.sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, this)
            .then(function() {
                console.log('Auto-reply sent!');
            }, function(error) {
                console.log('Auto-reply failed...', error);
            });

        // UI Success
        form.reset();
        formBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon><span>Message Sent!</span>';
        
        setTimeout(() => {
             formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
             formBtn.setAttribute("disabled", "");
        }, 5000);

      } else {
        console.log(response);
        formBtn.innerHTML = '<ion-icon name="warning-outline"></ion-icon><span>Error! Retry.</span>';
         setTimeout(() => {
             formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
             formBtn.removeAttribute("disabled");
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
       formBtn.innerHTML = '<ion-icon name="warning-outline"></ion-icon><span>Error! Retry.</span>';
         setTimeout(() => {
             formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
             formBtn.removeAttribute("disabled");
        }, 3000);
    });
});



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }

  });
}
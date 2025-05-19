// /training-presentation/script.js

// --- STEP 2: DEFINE PRESENTATION STRUCTURE ---
// IMPORTANT: You MUST update this array to match your actual modules and number of slides.
// 'path': The folder name for the module inside your '/modules/' directory.
// 'slides': The total number of slideX.html files in that module (e.g., if you have slide1.html to slide13.html, 'slides' is 13).
// 'name': A friendly name for the module (optional, but good for display).

const presentationStructure = [
    { path: 'module1', slides: 13, name: 'Modulo 1: Introducción a LSS' },
    // Example for Module 2 - REPLACE WITH YOUR ACTUAL DATA
    { path: 'module2', slides: 8, name: 'Modulo 2: Fase de Definición' },
    // Example for Module 3 - REPLACE WITH YOUR ACTUAL DATA
    { path: 'module3', slides: 8,  name: 'Modulo 3: Fase de Medición' },

    // !!! ADD ALL YOUR MODULES HERE FOLLOWING THE SAME FORMAT !!!
    // For instance, if you have 10 modules:
    { path: 'module4', slides: 10, name: 'Modulo 4: Fase de Análisis' },
    { path: 'module5', slides: 8, name: 'Modulo 5: Fase de Mejora' },
    { path: 'module6', slides: 8,  name: 'Modulo 6: Fase de Control' },
    { path: 'module7', slides: 7,  name: 'Module 8: LSS Tools Part 1' },
    { path: 'module8', slides: 8, name: 'Module 8: LSS Tools Part 2' },
    { path: 'module9', slides: 8,  name: 'Module 9: Case Studies' },
    { path: 'module10', slides: 8, name: 'Modulo 10: Proyectos de Mejora' }
];

// --- END OF STEP 2 ---

// We will add more code below this line in the next steps.

// --- STEP 3: CORE NAVIGATION LOGIC ---

// Helper function to get current state (module and slide number) from browser's memory
function getCurrentState() {
    let currentModuleIndex = parseInt(localStorage.getItem('currentModuleIndex_LSS')); // Added _LSS to avoid conflicts
    let currentSlideNumber = parseInt(localStorage.getItem('currentSlideNumber_LSS'));

    // If no state is found (e.g., first time), default to the first slide of the first module
    if (isNaN(currentModuleIndex) || currentModuleIndex < 0 || currentModuleIndex >= presentationStructure.length) {
        currentModuleIndex = 0;
    }
    if (isNaN(currentSlideNumber) || currentSlideNumber < 1 || currentSlideNumber > presentationStructure[currentModuleIndex].slides) {
        currentSlideNumber = 1;
    }
    return { moduleIndex: currentModuleIndex, slideNumber: currentSlideNumber };
}

// Helper function to save current state to browser's memory
function saveCurrentState(moduleIndex, slideNumber) {
    localStorage.setItem('currentModuleIndex_LSS', moduleIndex);
    localStorage.setItem('currentSlideNumber_LSS', slideNumber);
}


// Function to build the URL for a specific slide (UPDATED FOR m#s#.html naming)
// Example: getSlideUrl(0, 1) for 'module1' might return "modules/module1/m1s1.html"
function getSlideUrl(moduleIndex, slideNumber) {
    if (moduleIndex < 0 || moduleIndex >= presentationStructure.length) {
        console.error("Invalid module index:", moduleIndex);
        return null;
    }
    const module = presentationStructure[moduleIndex]; // e.g., { path: 'module1', slides: 13, name: '...' }
    if (slideNumber < 1 || slideNumber > module.slides) {
        console.error("Invalid slide number:", slideNumber, "for module", module.path);
        return null;
    }

    // Construct the filename using the new convention m#s#.html
    // moduleIndex is 0-based, so module number for filename is moduleIndex + 1
    const filename = `m${moduleIndex + 1}s${slideNumber}.html`;

    // This path is relative from the root of your presentation folder
    return `modules/${module.path}/${filename}`;
}

// Function to navigate to a specific slide
function goToSlide(moduleIndex, slideNumber) {
    const targetUrl = getSlideUrl(moduleIndex, slideNumber);
    if (targetUrl) {
        saveCurrentState(moduleIndex, slideNumber);
        // We assume this function is called from a slide.html file
        // which is two levels deep (e.g., modules/module1/slide1.html)
        // So, to get to another slide at a similar level, we need to go up two levels to the root,
        // then down into the target module/slide.
        window.location.href = '../../' + targetUrl;
    } else {
        console.error("Failed to get URL for slide:", moduleIndex, slideNumber);
        // Fallback: go to the main index page if something goes wrong
        // window.location.href = '../../index.html';
    }
}

// Function to navigate to the NEXT slide
window.goToNextSlide = function() { // Exposing to global window for button clicks
    let { moduleIndex, slideNumber } = getCurrentState();
    const currentModule = presentationStructure[moduleIndex];

    if (slideNumber < currentModule.slides) {
        // Still slides left in the current module
        slideNumber++;
    } else {
        // End of current module, try to move to the next module
        if (moduleIndex < presentationStructure.length - 1) {
            moduleIndex++;
            slideNumber = 1; // Start at the first slide of the new module
        } else {
            // This is the last slide of the last module
            alert("Congratulations! You've reached the end of the presentation.");
            // Optional: Navigate back to the main index page
            window.location.href = '../../index.html';
            return; // Stop further execution
        }
    }
    goToSlide(moduleIndex, slideNumber);
}

// Function to navigate to the PREVIOUS slide
window.goToPrevSlide = function() { // Exposing to global window for button clicks
    let { moduleIndex, slideNumber } = getCurrentState();

    if (slideNumber > 1) {
        // Still previous slides in the current module
        slideNumber--;
    } else {
        // Beginning of current module, try to move to the previous module
        if (moduleIndex > 0) {
            moduleIndex--;
            // Go to the LAST slide of the previous module
            slideNumber = presentationStructure[moduleIndex].slides;
        } else {
            // This is the first slide of the first module
            alert("You are at the very first slide.");
            // Optional: Navigate back to the main index page or do nothing
            // window.location.href = '../../index.html';
            return; // Stop further execution
        }
    }
    goToSlide(moduleIndex, slideNumber);
}

// --- END OF STEP 3 ---

// We will add more code below this line later.

// --- STEP 4 (Part B): SLIDE INITIALIZATION LOGIC (in script.js) ---

// This function will be called when a slide page loads
function initializeCurrentSlide() {
    const { moduleIndex, slideNumber } = getCurrentState();
    const currentModule = presentationStructure[moduleIndex];

    const prevButton = document.getElementById('prevSlideButton');
    const nextButton = document.getElementById('nextSlideButton');
    const slideIndicator = document.getElementById('slideIndicator');

    // Update Slide Indicator
    if (slideIndicator) {
        let globalSlideNumber = 0;
        for (let i = 0; i < moduleIndex; i++) {
            globalSlideNumber += presentationStructure[i].slides;
        }
        globalSlideNumber += slideNumber;

        let totalSlidesInPresentation = 0;
        presentationStructure.forEach(mod => totalSlidesInPresentation += mod.slides);

        slideIndicator.textContent = `Slide ${globalSlideNumber} of ${totalSlidesInPresentation} (M${moduleIndex + 1} S${slideNumber})`;
    }

    // Disable/Enable Previous Button
    if (prevButton) {
        if (moduleIndex === 0 && slideNumber === 1) {
            prevButton.disabled = true;
            prevButton.style.opacity = "0.5"; // Visually indicate it's disabled
        } else {
            prevButton.disabled = false;
            prevButton.style.opacity = "1";
        }
    }

    // Disable/Enable Next Button
    if (nextButton) {
        const isLastModule = moduleIndex === presentationStructure.length - 1;
        const isLastSlideInModule = slideNumber === currentModule.slides;

        if (isLastModule && isLastSlideInModule) {
            nextButton.disabled = true;
            nextButton.style.opacity = "0.5";
            // Optional: Change text for the last button
            // nextButton.textContent = "Finish Presentation";
            // nextButton.onclick = () => { window.location.href = '../../index.html'; }; // Override default next
        } else {
            nextButton.disabled = false;
            nextButton.style.opacity = "1";
            // Ensure it calls goToNextSlide if it was previously "Finish"
            // if (nextButton.textContent === "Finish Presentation") {
            //     nextButton.textContent = "Next \u00BB";
            //     nextButton.onclick = goToNextSlide;
            // }
        }
    }

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight' && nextButton && !nextButton.disabled) {
            goToNextSlide();
        } else if (event.key === 'ArrowLeft' && prevButton && !prevButton.disabled) {
            goToPrevSlide();
        }
    });
}

// Automatically call initializeCurrentSlide when the script.js loads on a slide page
// We need to ensure this runs *after* the DOM (HTML buttons) is ready.
// A common way is to check if we are on a slide page.
// A simple check: if the URL contains "/modules/"
if (window.location.pathname.includes("/modules/")) {
    document.addEventListener('DOMContentLoaded', initializeCurrentSlide);
}

// --- END OF STEP 4 (Part B) ---

// --- STEP 5 (Part B): START PRESENTATION FROM INDEX.HTML (in script.js) ---

window.startPresentationFromIndex = function(moduleIdx, slideNum) {
    // Ensure moduleIdx and slideNum are valid, defaulting to the very first slide if not.
    if (moduleIdx < 0 || moduleIdx >= presentationStructure.length || 
        !presentationStructure[moduleIdx]) {
        moduleIdx = 0;
    }
    
    const mod = presentationStructure[moduleIdx];
    if (slideNum < 1 || slideNum > mod.slides) {
        slideNum = 1;
    }

    saveCurrentState(moduleIdx, slideNum); // Save the starting point
    
    const targetUrl = getSlideUrl(moduleIdx, slideNum);
    if (targetUrl) {
        // When navigating from index.html, the path to the first slide is direct
        window.location.href = targetUrl; 
    } else {
        console.error("Could not construct URL for the first slide from index.html.");
        alert("Error: Could not start the presentation. Please check the configuration.");
    }
};

// --- END OF STEP 5 (Part B) ---


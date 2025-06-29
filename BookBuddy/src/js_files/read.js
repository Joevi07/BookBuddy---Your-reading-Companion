pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


const fileInput = document.getElementById('pdf-upload');
const fileNameDisplay = document.getElementById('file-name');
const container = document.getElementById('pdf-container');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');

let pdf = null;
let currentPage = 1;
let totalPages = 0;
let rendering = false;

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  fileNameDisplay.textContent = file ? file.name : 'No file chosen';

  if (file && file.type === 'application/pdf') {
    const fileURL = URL.createObjectURL(file);
    container.innerHTML = '';
    pageInfo.textContent = 'Loading...';
    currentPage = 1;

    pdfjsLib.getDocument(fileURL).promise.then(function (pdfDoc) {
      pdf = pdfDoc;
      totalPages = pdf.numPages;
      renderVisiblePage(currentPage);
    }).catch(err => {
      console.error("PDF load error:", err.message);
    });
  }
});

function renderVisiblePage(pageNum) {
  if (rendering || pageNum < 1 || pageNum > totalPages) return;
  rendering = true;
  currentPage = pageNum;

  container.innerHTML = ''; // Clear previous page

  pdf.getPage(pageNum).then(function (page) {
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    container.appendChild(canvas);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    return page.render(renderContext).promise;
  }).then(() => {
    rendering = false;
    updatePageInfo();
  }).catch(err => {
    console.error("Render error:", err);
    rendering = false;
  });
}

function updatePageInfo() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Button handlers
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) renderVisiblePage(currentPage - 1);
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) renderVisiblePage(currentPage + 1);
});


//upload button

fileInput.addEventListener('change',function()
{
    const file = this.files[0];
    if(file){
        fileNameDisplay.textContent = file.name;
    }
    else{
        fileNameDisplay.textContent="No file chosen";
    }
});

//

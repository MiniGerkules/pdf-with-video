/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as pdfjsLib from "pdfjs-dist";
import * as pdfViewer from "pdfjs-dist/web/pdf_viewer";

// import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import pdfjsViewer from "pdfjs-dist/web/pdf_viewer";

import "./lecture-viewer.scss";

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
  alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
}

// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf-worker.js";

let container = document.getElementById("viewerContainer");
let eventBus = new pdfjsViewer.EventBus();

// (Optionally) enable hyperlinks within PDF files.
let pdfLinkService = new pdfjsViewer.PDFLinkService({
  eventBus: eventBus,
});

// (Optionally) enable find controller.
let pdfFindController = new pdfjsViewer.PDFFindController({
  eventBus: eventBus,
  linkService: pdfLinkService,
});

let pdfViewer = new pdfjsViewer.PDFViewer({
  container: container,
  eventBus: eventBus,
  linkService: pdfLinkService,
  findController: pdfFindController,
});
pdfLinkService.setViewer(pdfViewer);

/*eventBus.on("pagesinit", function () {
  // We can use pdfViewer now, e.g. let's change default scale.
  pdfViewer.currentScaleValue = "page-width";

  // We can try searching for things.
  if (SEARCH_FOR) {
    pdfFindController.executeCommand("find", { query: SEARCH_FOR });
  }
});*/

// Loading document.
let loadingTask = pdfjsLib.getDocument({
  url: "../lectures/lecture2.pdf",
  cMapUrl: "pdfsjs/cmaps",
  cMapPacked: true
});
loadingTask.promise.then(function (pdfDocument: PDFDocumentProxy) {
  // Document loaded, specifying document for the viewer and
  // the (optional) linkService.
  pdfViewer.setDocument(pdfDocument);

  pdfLinkService.setDocument(pdfDocument, null);
});

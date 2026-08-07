/**
 * Configure pdf.js to use the self-hosted worker under /pdfjs/.
 * Call once after dynamically importing pdfjs-dist.
 */
export const PDFJS_WORKER_SRC = '/pdfjs/pdf.worker.min.mjs'

export function configurePdfJsWorker(pdfjs) {
  if (!pdfjs?.GlobalWorkerOptions) return
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC
}

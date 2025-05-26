import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "document.pdf";
    link.target = "_blank";
    link.click();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(() => {}, {
      root: null,
      rootMargin: "0px",
      threshold: 0.6, // At least 60% visible to be considered "in view"
    });

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [numPages]);

  return (
    <div className="flex flex-col items-center justify-start h-full max-h-screen w-full overflow-y-auto py-4 relative">
      {/* Download Button */}
      <button
        onClick={downloadPdf}
        aria-label="Download PDF"
        className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-md shadow hover:bg-blue-700 transition flex items-center justify-center"
      >
        <FiDownload size={20} />
      </button>

      <div
        className="p-4 bg-black rounded-lg shadow-md flex flex-col items-center justify-center"
        style={{ filter: "invert(1) hue-rotate(180deg)" }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="p-8 my-8"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={index}
              ref={(el) => {
                pageRefs.current[index] = el;
              }}
              data-page={index + 1}
            >
              <Page pageNumber={index + 1} className="!shadow-none" />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;

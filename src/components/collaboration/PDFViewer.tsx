import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState } from "react";
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
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(() => {}, {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    });

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [numPages]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-full max-h-screen w-full overflow-y-auto py-4 relative">
      {/* Download Button */}

      <div
        className="p-4 rounded-lg shadow-md flex flex-col items-center justify-center w-full"
        style={{
          filter: "invert(1) hue-rotate(180deg)",
        }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="w-full flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={index}
              ref={(el) => {
                pageRefs.current[index] = el;
              }}
              data-page={index + 1}
              className="w-full flex justify-center my-4"
            >
              <Page
                pageNumber={index + 1}
                className="!shadow-none"
                width={Math.min(windowWidth - 32, 800)} // ensure padding and max width
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;

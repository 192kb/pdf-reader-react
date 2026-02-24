import React, { useState } from "react";
import ReactGA from "react-ga";
import { Document, Page, DocumentProps, PageProps } from "react-pdf";
import { useSwipeable } from "react-swipeable";

const App: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = React.useCallback(
    ({ numPages }: {numPages: number}) => setNumPages(numPages),
    []
  );

  const handlePrev = React.useCallback(() => {
    if (pageNumber - 1 >= 1) {
      setPageNumber(pageNumber - 1);
    }
  }, [pageNumber]);

  const handleNext = React.useCallback(() => {
    if (pageNumber + 1 <= numPages) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber, numPages]);

  const swipeHanlders = useSwipeable({
    onTap: () => handleNext,
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    onSwipedUp: handleNext,
    onSwipedDown: handlePrev,
  });

  const documentProps = React.useMemo<DocumentProps>(() => {
    return {
      file: "/report.pdf",
      loading: "Загружаем данные",
      error: " ",
      noData: "Данных нет",
      onLoadSuccess: onDocumentLoadSuccess,
    };
  }, [onDocumentLoadSuccess]);

  const pageProps = React.useMemo<PageProps>(() => {
    return {
      loading: "Загружаем страницу",
      error: " ",
      noData: "Страница не указана",
      renderMode: "canvas",
    };
  }, []);

  React.useEffect(() => {
    ReactGA.pageview("/");
  }, []);

  React.useEffect(() => {
    ReactGA.event({
      category: "Взаимодействие",
      action: "Перелистывание",
      value: pageNumber,
    });
  }, [pageNumber]);

  return (
    <div className="pdf-reader" {...swipeHanlders}>
      <div className="pagination">
        <button disabled={pageNumber <= 1} onClick={() => setPageNumber(1)}>
          Первая
        </button>
        <button disabled={pageNumber <= 1} onClick={handlePrev}>
          Предыдущая
        </button>
        <button disabled={pageNumber >= numPages} onClick={handleNext}>
          Следующая
        </button>
        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(numPages)}
        >
          Последняя
        </button>
      </div>
      <div className="page">
        <Document {...documentProps}>
          {pageNumber <= numPages && pageNumber >= 0 && (
            <Page pageNumber={pageNumber} {...pageProps} />
          )}
        </Document>
      </div>
    </div>
  );
};

export default App;

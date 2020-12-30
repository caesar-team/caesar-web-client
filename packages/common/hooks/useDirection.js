import { useState, useRef, useEffect } from 'react';

export const useDirection = ({
  tableScrollTop,
  tableHeight,
  optionLength = 1,
  modalHeight,
}) => {
  const cellRef = useRef(null);
  const [isUp, setUp] = useState(false);

  useEffect(() => {
    if (cellRef?.current) {
      const rowScrolledTopPosition = cellRef.current.closest('[role="row"]')
        ?.offsetTop;
      const rowTopPositionRelativeToTable =
        rowScrolledTopPosition - tableScrollTop;
      const modalBottomPosition = modalHeight
        ? rowTopPositionRelativeToTable + modalHeight
        : rowTopPositionRelativeToTable + (optionLength + 1) * 44 + 4;

      setUp(modalBottomPosition >= tableHeight);
    }
  }, [cellRef, tableScrollTop]);

  return { cellRef, isUp };
};

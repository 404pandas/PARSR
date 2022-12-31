import React from 'react';
import { Footer } from '@material-ui/core';
const Footer = () => {
  return (
    <TableFooter className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        <h4>
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          by Mary Elenius & Fur-iendly Felines
        </h4>
      </div>
    </TableFooter>
  );
};

export default TableFooter;

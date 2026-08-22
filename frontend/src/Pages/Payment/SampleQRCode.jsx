import React from "react";

const GRID_SIZE = 21;
const CELL = 8;
const FINDER_POSITIONS = [
  [0, 0],
  [GRID_SIZE - 7, 0],
  [0, GRID_SIZE - 7],
];

const isInsideFinder = (row, col) =>
  FINDER_POSITIONS.some(
    ([fr, fc]) => row >= fr && row < fr + 7 && col >= fc && col < fc + 7
  );

// Pattern gia lap kieu QR (khong ma hoa du lieu that) - deterministic theo
// vi tri o (khong random moi lan render) de trong on dinh nhu 1 anh QR mau.
const isDarkCell = (row, col) => {
  const hash = (row * 928371 + col * 137 + row * col * 7) % 5;
  return hash < 2;
};

const FinderPattern = ({ row, col }) => (
  <g transform={`translate(${col * CELL}, ${row * CELL})`}>
    <rect width={CELL * 7} height={CELL * 7} fill="#000" />
    <rect x={CELL} y={CELL} width={CELL * 5} height={CELL * 5} fill="#fff" />
    <rect x={CELL * 2} y={CELL * 2} width={CELL * 3} height={CELL * 3} fill="#000" />
  </g>
);

// QR mau tinh (khong quet duoc that) - dai dien cho ma QR thanh toan se co
// khi tich hop cong thanh toan that sau nay.
const SampleQRCode = ({ size = 176 }) => {
  const cells = [];

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (isInsideFinder(row, col)) continue;
      if (!isDarkCell(row, col)) continue;
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={col * CELL}
          y={row * CELL}
          width={CELL}
          height={CELL}
          fill="#000"
        />
      );
    }
  }

  const total = GRID_SIZE * CELL;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      width={size}
      height={size}
      className="shrink-0"
    >
      <rect width={total} height={total} fill="#fff" />
      {cells}
      {FINDER_POSITIONS.map(([row, col]) => (
        <FinderPattern key={`${row}-${col}`} row={row} col={col} />
      ))}
    </svg>
  );
};

export default SampleQRCode;

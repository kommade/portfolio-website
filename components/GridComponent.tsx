import React from 'react';

interface GridComponentProps {
    popup: string;
    title: string;
    year: string;
    img?: string;
    row?: number;
    col?: number;
}

const GridComponent: React.FC<GridComponentProps> = ({ popup, title, year, img = "https://via.placeholder.com/532x331", row = 1, col = 1 }) => {
    const span = {
        gridRow: row > 1 ? `span ${row}` : 'auto',
        gridColumn: col > 1 ? `span ${col}` : 'auto',
    };
    return (
        <div className=" bg-white relative overflow-hidden" style={span}>
          <div className="absolute inset-2 inset-y-0 bottom-[20%] top-2 border border-black">
            <img className="w-full h-full absolute hover:blur-sm transition-all" src={img} />
            <div className="popup w-full h-full absolute flex items-center justify-center text-center transition-all text-black text-sm font-normal font-['Epilogue'] leading-[0.85rem] opacity-0 hover:opacity-100">
              {popup}
            </div>
          </div>
          <div className="top-[80%] absolute left-2">
            <div className="grid-title">{title}</div>
            <div className="grid-year">{year}</div>
          </div>
        </div>
    );
}

export default GridComponent;
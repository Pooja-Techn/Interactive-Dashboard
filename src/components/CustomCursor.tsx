import React, { useEffect, useState, useRef } from "react";
import { BsHandIndex } from "react-icons/bs";

// Inside your component or as a separate component
// export const CustomCursorInside = ({ containerRef, toolTipRef }: { containerRef: React.RefObject<HTMLDivElement | null>, toolTipRef: React.RefObject<HTMLDivElement | null> }) => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       // Only update if mouse is inside container
//       if (
//         e.clientX >= rect.left &&
//         e.clientX <= rect.right &&
//         e.clientY >= rect.top &&
//         e.clientY <= rect.bottom
//       ) {
//         setPosition({ x: e.clientX, y: e.clientY });
//         setVisible(true);
//       } else {
//         setVisible(false);
//       }
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseout", () => setVisible(false));

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseout", () => setVisible(false));
//     };
//   }, [containerRef]);

//   if (!visible) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: position.y,
//         left: position.x,
     
//         transform: "translate(-50%, -50%)",
//         zIndex: 9999,
//         fontSize: 24,
//         color: "blue",
//         cursor: "none",
//       }}
//     >
//        {BsHandIndex({ size: 24, style: { marginLeft: '-5px', marginTop: '60px' } })
//        }       
//    <div ref={toolTipRef} />
//        {/* <div style={{ width: 100, height: 40, background: '#ccc', marginTop: 8 }} /> */}

//     </div>
//   );
// };
export const CustomCursorInside = ({
  containerRef,
  onMouseMove,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (x: number, y: number) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({x: 0, y: 0})
   
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom-40
      ) {
          setPosition({x: e.clientX, y: e.clientY})
        setVisible(true);
        onMouseMove(e.clientX, e.clientY); // Pass position to parent
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef, onMouseMove]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        pointerEvents: "none",
        fontSize: 24,
        color: "orange",
        transform: "translate(-50%, -50%)",
        top: position.y,
        left: position.x,
        
      }}
    >
      {BsHandIndex({ size: 34, style: { marginLeft: '0px', marginTop: '6px' } })
       }      </div>
  );
};

// CustomCursorInside.tsx
// import React from 'react';
// import { BsHandIndex } from 'react-icons/bs';

// export const CustomCursorInside: React.FC<{ x: number; y: number }> = ({ x, y }) => {
//   return (
//     <div
//       style={{
//         position: 'absolute',
//         left: x,
//         top: y,
//         transform: 'translate(-50%, -50%)',
//         pointerEvents: 'none',
//         zIndex: 9999,
//         fontSize: '18px',
//         color: '#333',
//       }}
//     >
//        {BsHandIndex({ size: 24, style: { marginLeft: '-5px', marginTop: '60px' } })}       
//       <div style={{ width: 100, height: 40, background: '#ccc', marginTop: 8 }} />
//     </div>
//   );
// };

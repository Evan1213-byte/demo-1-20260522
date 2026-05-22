"use client";

import { useState, useRef, MouseEvent } from "react";

interface Point {
  x: number;
  y: number;
}

export function SelectionTool({ children }: { children?: React.ReactNode }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState<Point | null>(null);
  const [currentPos, setCurrentPos] = useState<Point | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent) => {
    // 仅响应鼠标左键
    if (e.button !== 0) return;
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setStartPos({ x, y });
    setCurrentPos({ x, y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isSelecting || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // 限制在容器范围内
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    // 这里可以暴露事件，将选区坐标传给父组件进行相交检测等逻辑
    // if (startPos && currentPos) { ... }
  };

  // 计算圈选框的位置和大小
  const selectionBox = startPos && currentPos ? {
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y),
  } : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden select-none cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 放置被圈选的子元素 */}
      {children}

      {/* 渲染圈选框 */}
      {isSelecting && selectionBox && (
        <div
          className="absolute bg-blue-500/20 border border-blue-500 pointer-events-none"
          style={{
            left: selectionBox.left,
            top: selectionBox.top,
            width: selectionBox.width,
            height: selectionBox.height,
          }}
        />
      )}
    </div>
  );
}

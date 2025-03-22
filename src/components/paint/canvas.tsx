"use client";

import { useRef, useState, useEffect, RefObject } from "react";
import { toast } from "sonner";

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  width?: number;
  height?: number;
  color?: string;
  lineWidth?: number;
  drawMode?: "pen" | "rectangle" | "circle" | "line";
}

export default function Canvas({
  canvasRef,
  width = 800,
  height = 600,
  color = "#000000",
  lineWidth = 5,
  drawMode = "pen",
}: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [previewCtx, setPreviewCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);

  // Set up both canvases
  useEffect(() => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    
    if (!canvas || !previewCanvas) return;

    // Main canvas context
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      setCtx(context);
    }
    
    // Preview canvas context for shape drawing
    const pContext = previewCanvas.getContext("2d");
    if (pContext) {
      pContext.lineCap = "round";
      pContext.lineJoin = "round";
      pContext.strokeStyle = color;
      pContext.lineWidth = lineWidth;
      setPreviewCtx(pContext);
    }
    
    // Add paste event listener
    window.addEventListener('paste', handlePaste);
    
    // Hide tooltip after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    
    return () => {
      window.removeEventListener('paste', handlePaste);
      clearTimeout(tooltipTimer);
    };
  }, []);
  
  // Update contexts when color or line width changes
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    
    if (previewCtx) {
      previewCtx.strokeStyle = color;
      previewCtx.lineWidth = lineWidth;
    }
  }, [color, lineWidth, ctx, previewCtx]);

  const handlePaste = (e: ClipboardEvent) => {
    if (!ctx || !canvasRef.current) return;
    
    if (e.clipboardData && e.clipboardData.items) {
      // Check for image content
      const items = e.clipboardData.items;
      let hasImage = false;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          hasImage = true;
          const blob = items[i].getAsFile();
          if (!blob) continue;
          
          const reader = new FileReader();
          reader.onload = (event) => {
            if (!event.target?.result) return;
            
            const img = new Image();
            img.onload = () => {
              // Center the image or place it where cursor is
              const x = Math.max(0, (width - img.width) / 2);
              const y = Math.max(0, (height - img.height) / 2);
              
              // Scale down if image is too large
              let drawWidth = img.width;
              let drawHeight = img.height;
              
              if (drawWidth > width - 20) {
                const scale = (width - 20) / drawWidth;
                drawWidth *= scale;
                drawHeight *= scale;
              }
              
              if (drawHeight > height - 20) {
                const scale = (height - 20) / drawHeight;
                drawWidth *= scale;
                drawHeight *= scale;
              }
              
              ctx.drawImage(img, x, y, drawWidth, drawHeight);
              toast.success("Image pasted to canvas", {
                description: "The image has been added to your drawing",
                duration: 2000,
              });
            };
            img.src = event.target.result as string;
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
          break;
        }
      }
      
      // If no image was found in clipboard
      if (!hasImage) {
        toast.error("No image in clipboard", {
          description: "Copy an image and try again",
          duration: 2000,
        });
      }
    }
  };

  // Get the position relative to the canvas
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx || !previewCtx) return;
    
    // Prevent scrolling on touch devices
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    setStartPos({ x, y });
    
    if (drawMode === "pen") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      // For shapes, clear the preview canvas
      previewCtx.clearRect(0, 0, width, height);
    }
    
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx || !previewCtx || !startPos) return;
    
    // Prevent scrolling on touch devices
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const { x, y } = getCoordinates(e);
    
    if (drawMode === "pen") {
      // Freehand drawing directly on main canvas
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // For shapes, draw on the preview canvas
      previewCtx.clearRect(0, 0, width, height);
      previewCtx.beginPath();
      
      if (drawMode === "rectangle") {
        previewCtx.rect(
          startPos.x, 
          startPos.y, 
          x - startPos.x, 
          y - startPos.y
        );
      } else if (drawMode === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + 
          Math.pow(y - startPos.y, 2)
        );
        previewCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      } else if (drawMode === "line") {
        previewCtx.moveTo(startPos.x, startPos.y);
        previewCtx.lineTo(x, y);
      }
      
      previewCtx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing || !ctx || !previewCtx || !startPos) return;
    
    if (drawMode === "pen") {
      ctx.closePath();
    } else {
      // Transfer the shape from preview canvas to main canvas
      ctx.drawImage(previewCanvasRef.current!, 0, 0);
      // Clear the preview canvas
      previewCtx.clearRect(0, 0, width, height);
    }
    
    setIsDrawing(false);
    setStartPos(null);
  };

  // Enhanced cursor styles based on drawing mode
  const getCursorStyle = () => {
    const cursorSize = 24;
    const cursorOffset = Math.floor(cursorSize / 2);
    
    switch (drawMode) {
      case "pen": 
        return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 24 24" fill="none" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>') ${cursorOffset} ${cursorOffset}, auto`;
      case "rectangle": 
        return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 24 24" fill="none" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>') ${cursorOffset} ${cursorOffset}, crosshair`;
      case "circle": 
        return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 24 24" fill="none" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>') ${cursorOffset} ${cursorOffset}, crosshair`;
      case "line": 
        return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 24 24" fill="none" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>') ${cursorOffset} ${cursorOffset}, crosshair`;
      default: 
        return "default";
    }
  };

  return (
    <div className="canvas-container relative rounded-md overflow-hidden">
      {/* Base Canvas - Main drawing surface */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="shadow-sm transition-all duration-200"
        style={{ 
          backgroundColor: "#ffffff",
          touchAction: "none" // Prevent touch scrolling
        }}
      />
      
      {/* Preview Canvas - For shape drawing */}
      <canvas
        ref={previewCanvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="absolute top-0 left-0 z-10"
        style={{ 
          cursor: getCursorStyle(),
          touchAction: "none" // Prevent touch scrolling
        }}
      />
      
      {/* Excalidraw-like grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] grid" 
        style={{ 
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right, #aaa 1px, transparent 1px), linear-gradient(to bottom, #aaa 1px, transparent 1px)",
          backgroundPosition: "0 0, 0 0",
          backgroundAttachment: "local",
          zIndex: -1
        }}
      />
      
      {/* Fine grain grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] grid" 
        style={{ 
          backgroundSize: "8px 8px",
          backgroundImage: "linear-gradient(to right, #bbb 0.5px, transparent 1px), linear-gradient(to bottom, #bbb 0.5px, transparent 1px)",
          backgroundPosition: "0 0, 0 0",
          backgroundAttachment: "local",
          zIndex: -1
        }}
      />
      
      {/* Drawing Mode Tooltip - Excalidraw style */}
      {showTooltip && (
        <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-800 text-black dark:text-white px-3 py-2 rounded-md shadow-lg text-sm z-20 border border-zinc-200 dark:border-zinc-700">
          Tool: <span className="font-medium capitalize">{drawMode}</span>
        </div>
      )}
    </div>
  );
}

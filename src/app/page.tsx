"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Canvas from "@/components/paint/canvas";
import Toolbar from "@/components/paint/toolbar";
import { useTheme } from "next-themes";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  GithubIcon,
  MenuIcon,
  Share2Icon,
} from "lucide-react";

export default function Home() {
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [drawMode, setDrawMode] = useState<"pen" | "rectangle" | "circle" | "line" | "arrow" | "text" | "move">("pen");
  const [roughness, setRoughness] = useState(1);
  const [enableRough, setEnableRough] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check for mobile viewport
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't activate shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 'p':
          setDrawMode("pen");
          toast.success("Pen tool selected");
          break;
        case 'r':
          setDrawMode("rectangle");
          toast.success("Rectangle tool selected");
          break;
        case 'c':
          setDrawMode("circle");
          toast.success("Circle tool selected");
          break;
        case 'l':
          setDrawMode("line");
          toast.success("Line tool selected");
          break;
        case 'a':
          setDrawMode("arrow");
          toast.success("Arrow tool selected");
          break;
        case 't':
          setDrawMode("text");
          toast.success("Text tool selected");
          break;
        case 'm':
          setDrawMode("move");
          toast.success("Move tool selected");
          break;
        case 'q':
          setEnableRough(!enableRough);
          toast.success(enableRough ? "Smooth mode" : "Sketchy mode");
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSave();
          }
          break;
        case 'delete':
        case 'backspace':
          if (e.ctrlKey) {
            e.preventDefault();
            handleClear();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableRough]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ask for confirmation before clearing
    if (confirm("Are you sure you want to clear the canvas? This action cannot be undone.")) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        toast.success("Canvas cleared", {
          description: "Your drawing has been cleared",
          duration: 2000,
        });
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to data URL and create download link
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "drawpro-" + new Date().toISOString().split('T')[0] + ".png";
      link.href = dataURL;
      link.click();
      
      toast.success("Image saved", {
        description: "Your drawing has been downloaded as PNG",
        duration: 2000,
      });
    } catch (error) {
      toast.error("Failed to save image", {
        description: "There was an error saving your drawing",
      });
    }
  };
  
  const handleSaveAsJpeg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to JPEG data URL
      const dataURL = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.download = "drawpro-" + new Date().toISOString().split('T')[0] + ".jpg";
      link.href = dataURL;
      link.click();
      
      toast.success("Image saved as JPEG", {
        description: "Your drawing has been downloaded",
        duration: 2000,
      });
    } catch (error) {
      toast.error("Failed to save image", {
        description: "There was an error saving your drawing",
      });
    }
  };
  
  const handleCopyToClipboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Could not create image blob");
        }
        
        // Use the clipboard API to copy the image
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(() => {
          toast.success("Copied to clipboard", {
            description: "Your drawing has been copied to clipboard",
            duration: 2000,
          });
        });
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard", {
        description: "There was an error copying your drawing",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top app bar - Excalidraw style */}
      <header className="bg-background border-b h-12 flex items-center px-4 shadow-sm z-20">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
          </Button>
          <div className="font-medium text-lg">DrawPro</div>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
            <Share2Icon className="h-4 w-4" />
            <span>Share</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSave}
            className="hidden md:flex items-center gap-1"
          >
            <DownloadIcon className="h-4 w-4" />
            <span>Export</span>
          </Button>
          
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <GithubIcon className="h-4 w-4" />
            </Button>
          </a>
          
          <ModeToggle />
        </div>
      </header>

      {/* Toolbar now at the top */}
      <Toolbar
        onColorChange={setColor}
        onLineWidthChange={setLineWidth}
        onClear={handleClear}
        onSave={handleSave}
        onSaveAsJpeg={handleSaveAsJpeg}
        drawMode={drawMode}
        onDrawModeChange={setDrawMode}
        roughness={roughness}
        onRoughnessChange={setRoughness}
        enableRough={enableRough}
        onEnableRoughChange={setEnableRough}
      />
        
      {/* Main content area with canvas */}
      <main className="flex-1 overflow-hidden flex items-center justify-center bg-[#f5f5f5] dark:bg-[#121212] relative">
        <Canvas
          canvasRef={canvasRef}
          width={isMobileView ? window.innerWidth - 32 : Math.min(window.innerWidth - 320, 1600)}
          height={isMobileView ? 500 : Math.min(window.innerHeight - 148, 900)} // Adjusted for the top toolbar
          color={color}
          lineWidth={lineWidth}
          drawMode={drawMode}
          roughness={roughness}
          enableRough={enableRough}
        />
      </main>
      
      {/* Status bar at bottom */}
      <footer className="border-t py-1 px-4 text-xs text-muted-foreground h-6 flex items-center">
        <div className="flex-1">DrawPro Studio</div>
        <div>Use keyboard shortcuts: P, L, R, C, M, Q for tools and modes</div>
      </footer>
    </div>
  );
}

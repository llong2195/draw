"use client";

import {
  ArrowUpRight,
  Circle,
  Download,
  FileImage,
  Hand,
  HelpCircle,
  Image,
  Pencil,
  PencilLine,
  Save,
  Settings,
  Square,
  Text,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ToolbarProps {
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveAsJpeg?: () => void;
  drawMode?: "pen" | "rectangle" | "circle" | "line" | "arrow" | "text" | "move";
  onDrawModeChange?: (mode: "pen" | "rectangle" | "circle" | "line" | "arrow" | "text" | "move") => void;
  roughness?: number;
  onRoughnessChange?: (roughness: number) => void;
  enableRough?: boolean;
  onEnableRoughChange?: (enableRough: boolean) => void;
}

export default function Toolbar({
  onColorChange,
  onLineWidthChange,
  onClear,
  onSave,
  onSaveAsJpeg,
  drawMode = "pen",
  onDrawModeChange,
  roughness = 1,
  onRoughnessChange,
  enableRough = true,
  onEnableRoughChange,
}: ToolbarProps) {
  const [customColor, setCustomColor] = useState("#000000");
  const [showProperties, setShowProperties] = useState(true);
  const [currentWidth, setCurrentWidth] = useState(5);
  
  // Professional color palette - Excalidraw-like
  const colorPalettes = {
    basic: ["#000000", "#343a40", "#495057", "#868e96", "#adb5bd", "#ced4da", "#dee2e6", "#f8f9fa"],
    primary: ["#e03131", "#c2255c", "#9c36b5", "#6741d9", "#3b5bdb", "#1971c2", "#099268", "#2b8a3e"],
    secondary: ["#f08c00", "#e8590c", "#d9480f", "#5c940d", "#2b8a3e", "#2b8a3e", "#0b7285", "#1864ab"],
  };

  // Professional line widths
  const lineWidths = [1, 2, 3, 5, 8, 12, 16, 24];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case "p": 
          onDrawModeChange?.("pen"); 
          toast("Pen tool selected", { icon: "✏️" });
          break;
        case "l": 
          onDrawModeChange?.("line"); 
          toast("Line tool selected", { icon: "➖" });
          break;
        case "r": 
          onDrawModeChange?.("rectangle"); 
          toast("Rectangle tool selected", { icon: "⬜" });
          break;
        case "c": 
          onDrawModeChange?.("circle"); 
          toast("Circle tool selected", { icon: "⭕" });
          break;
        case "a": 
          onDrawModeChange?.("arrow"); 
          toast("Arrow tool selected", { icon: "➡️" });
          break;
        case "t": 
          onDrawModeChange?.("text"); 
          toast("Text tool selected", { icon: "🔤" });
          break;
        case "s": 
          if (e.ctrlKey) { 
            e.preventDefault(); 
            onSave(); 
          } 
          break;
        case "delete": onClear(); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDrawModeChange, onSave, onClear]);

  // Handle color input validation
  const validateAndSetColor = (inputValue: string) => {
    setCustomColor(inputValue);
    
    // Only apply valid hex colors
    if (/^#([0-9A-F]{3}){1,2}$/i.test(inputValue)) {
      onColorChange(inputValue);
    }
  };

  // Handle paste event
  const handlePaste = () => {
    toast.info("Paste from clipboard", {
      description: "Press Ctrl+V to paste an image",
    });
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col w-full">
        {/* Top Toolbar - Tools (now horizontal) */}
        <div className="bg-background border-b w-full flex items-center px-2 py-1 shadow-sm">
          {/* Drawing Tools Group */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "pen" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("pen")}
                  className="h-9 w-9 rounded-md"
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Pencil (P)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "line" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("line")}
                  className="h-9 w-9 rounded-md"
                >
                  <PencilLine className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Line (L)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "rectangle" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("rectangle")}
                  className="h-9 w-9 rounded-md"
                >
                  <Square className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Rectangle (R)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "circle" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("circle")}
                  className="h-9 w-9 rounded-md"
                >
                  <Circle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Circle (C)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "arrow" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("arrow")}
                  className="h-9 w-9 rounded-md"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Arrow (A)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "text" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("text")}
                  className="h-9 w-9 rounded-md"
                >
                  <Text className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Text (T)</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-2 h-8" />
          
            {/* Selection tool */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                >
                  <Hand className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Move (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex-1"></div>
          
          {/* Right-side actions */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="h-9 w-9 rounded-md text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Clear Canvas (Delete)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePaste}
                  className="h-9 w-9 rounded-md"
                >
                  <Image className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Paste Image (Ctrl+V)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                  onClick={() => setShowProperties(!showProperties)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle Properties Panel</p>
              </TooltipContent>
            </Tooltip>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                >
                  <Save className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onClick={onSave}>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Save as PNG</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSaveAsJpeg}>
                  <FileImage className="h-4 w-4 mr-2" />
                  <span>Save as JPEG</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Keyboard shortcuts:<br/>
                P: Pen, L: Line<br/>
                R: Rectangle, C: Circle<br/>
                A: Arrow, T: Text<br/>
                Ctrl+S: Save, Delete: Clear</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        {/* Left Sidebar - Properties (now absolute positioned) */}
        {showProperties && (
          <div className="bg-background border-r absolute left-0 top-[calc(3rem+var(--header-height,48px))] h-[calc(100vh-var(--header-height,48px)-3rem)] w-64 p-4 shadow-sm z-10">
            <h3 className="font-medium mb-4">Properties</h3>
            
            {/* Stroke color */}
            <div className="mb-6">
              <Label className="text-xs mb-2 block text-muted-foreground">Stroke</Label>
              <div className="grid grid-cols-8 gap-1 mb-2">
                {colorPalettes.basic.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className={cn("p-0 h-6 w-6 rounded-md", 
                      customColor === color && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onColorChange(color);
                      setCustomColor(color);
                    }}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-8 gap-1 mb-2">
                {colorPalettes.primary.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className={cn("p-0 h-6 w-6 rounded-md", 
                      customColor === color && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onColorChange(color);
                      setCustomColor(color);
                    }}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-8 gap-1 mb-2">
                {colorPalettes.secondary.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className={cn("p-0 h-6 w-6 rounded-md", 
                      customColor === color && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onColorChange(color);
                      setCustomColor(color);
                    }}
                  />
                ))}
              </div>
              
              <div className="flex items-center space-x-2 mt-3">
                <Input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    onColorChange(e.target.value);
                  }}
                  className="w-8 h-8 p-0 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => validateAndSetColor(e.target.value)}
                  className="flex-1 h-8"
                />
              </div>
            </div>
            
            {/* Stroke width */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs text-muted-foreground">Stroke Width</Label>
                <span className="text-xs font-medium">{currentWidth}px</span>
              </div>
              
              <Slider
                value={[currentWidth]}
                min={1}
                max={24}
                step={1}
                onValueChange={(value) => {
                  setCurrentWidth(value[0]);
                  onLineWidthChange(value[0]);
                }}
                className="mb-4"
              />
              
              <div className="grid grid-cols-8 gap-1">
                {lineWidths.map((width) => (
                  <Button
                    key={width}
                    variant={currentWidth === width ? "secondary" : "outline"}
                    className="p-1 h-8"
                    onClick={() => {
                      setCurrentWidth(width);
                      onLineWidthChange(width);
                    }}
                  >
                    <div 
                      className="bg-current rounded-full w-full"
                      style={{ height: `${Math.min(6, width)}px` }}
                    />
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Rough.js settings */}
            {drawMode !== "pen" && drawMode !== "text" && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-xs text-muted-foreground">Sketchy Style</Label>
                  <Switch 
                    checked={enableRough} 
                    onCheckedChange={(checked) => onEnableRoughChange?.(checked)}
                  />
                </div>
                
                {enableRough && (
                  <>
                    <div className="flex justify-between items-center mb-2 mt-4">
                      <Label className="text-xs text-muted-foreground">Roughness</Label>
                      <span className="text-xs font-medium">{roughness.toFixed(1)}</span>
                    </div>
                    
                    <Slider
                      value={[roughness]}
                      min={0}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => {
                        onRoughnessChange?.(value[0]);
                      }}
                      className="mb-2"
                    />
                    
                    <div className="grid grid-cols-5 gap-1">
                      {[0, 0.5, 1, 2, 3].map((r) => (
                        <Button
                          key={r}
                          variant={Math.abs(roughness - r) < 0.1 ? "secondary" : "outline"}
                          className="p-1 h-8 text-xs"
                          onClick={() => onRoughnessChange?.(r)}
                        >
                          {r === 0 ? "Smooth" : r === 3 ? "Very Rough" : r}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Pro tip: Press Q to toggle sketchy style on/off
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Tool specific properties */}
            <div className="mb-6">
              <Label className="text-xs mb-2 block text-muted-foreground">Tool: {drawMode}</Label>
              <div className="border rounded-md p-3 text-sm text-muted-foreground">
                {drawMode === "pen" && "Freehand drawing tool. Click and drag to draw."}
                {drawMode === "line" && "Line tool. Click and drag to create a straight line."}
                {drawMode === "rectangle" && "Rectangle tool. Click and drag to create a rectangle."}
                {drawMode === "circle" && "Circle tool. Click and drag to create a circle."}
                {drawMode === "arrow" && "Arrow tool. Click and drag to create an arrow."}
                {drawMode === "text" && "Text tool. Click to add text."}
                {drawMode === "move" && "Move tool. Click and drag to move objects."}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

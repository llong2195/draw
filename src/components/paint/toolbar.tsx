"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  Circle,
  Download,
  FileImage,
  Image,
  Pencil,
  PencilLine,
  Save,
  Square,
  Trash2,
  X,
  Hand,
  ArrowUpRight,
  Text,
  Settings,
  HelpCircle,
} from "lucide-react";

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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ToolbarProps {
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onClear: () => void;
  onSave: () => void;
  onSaveAsJpeg?: () => void;
  drawMode?: "pen" | "rectangle" | "circle" | "line";
  onDrawModeChange?: (mode: "pen" | "rectangle" | "circle" | "line") => void;
}

export default function Toolbar({
  onColorChange,
  onLineWidthChange,
  onClear,
  onSave,
  onSaveAsJpeg,
  drawMode = "pen",
  onDrawModeChange,
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
      <div className="flex h-full">
        {/* Left Sidebar - Tools (Excalidraw style) */}
        <div className="bg-background border-r w-16 flex flex-col items-center py-2 shadow-sm">
          {/* Drawing Tools Group */}
          <div className="space-y-1 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "pen" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("pen")}
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Pencil (P)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "line" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("line")}
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <PencilLine className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Line (L)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "rectangle" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("rectangle")}
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <Square className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Rectangle (R)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "circle" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => onDrawModeChange?.("circle")}
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <Circle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Circle (C)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Arrow (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <Text className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Text (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator className="my-2 w-10" />
          
          {/* Selection tool */}
          <div className="space-y-1 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <Hand className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Move (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex-1"></div>
          
          {/* Bottom actions */}
          <div className="space-y-1 w-full mt-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="h-10 w-10 mx-auto rounded-md text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Clear Canvas (Delete)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePaste}
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <Image className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Paste Image (Ctrl+V)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 mx-auto rounded-md"
                  onClick={() => setShowProperties(!showProperties)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Toggle Properties Panel</p>
              </TooltipContent>
            </Tooltip>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <Save className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
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
                  className="h-10 w-10 mx-auto rounded-md"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Keyboard shortcuts:<br/>
                P: Pen, L: Line<br/>
                R: Rectangle, C: Circle<br/>
                Ctrl+S: Save, Delete: Clear</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        {/* Right Sidebar - Properties (Excalidraw style) */}
        {showProperties && (
          <div className="bg-background border-l w-64 p-4 shadow-sm">
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
            
            {/* Tool specific properties */}
            <div className="mb-6">
              <Label className="text-xs mb-2 block text-muted-foreground">Tool: {drawMode}</Label>
              <div className="border rounded-md p-3 text-sm text-muted-foreground">
                {drawMode === "pen" && "Freehand drawing tool. Click and drag to draw."}
                {drawMode === "line" && "Line tool. Click and drag to create a straight line."}
                {drawMode === "rectangle" && "Rectangle tool. Click and drag to create a rectangle."}
                {drawMode === "circle" && "Circle tool. Click and drag to create a circle."}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

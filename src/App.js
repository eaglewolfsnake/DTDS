import React, { useState } from 'react';

const AdvancedGroutingApp = () => {
  // Constants
  const VOID_PERCENTAGE = 35;
  
  // Installation status categories
  const INSTALLATION_CATEGORIES = [
    "Installed to Dense Soil Layer",
    "Installed to Top of Footing",
    "Obstruction Below New Mat",
    "Obstruction Above New Mat (No Grout)",
    "No Point (Access Issues)",
    "Planned (Not Yet Installed)"
  ];
  
  // Hole types
  const HOLE_TYPES = [
    "Primary",
    "Secondary",
    "Primary Shoring",
    "Secondary Shoring",
    "Supplementary"
  ];
  
  // Sample data
  const samplePoints = [
    {
      id: "P001",
      x: 120,
      y: 150,
      totalDepth: 25,
      totalGrout: 180,
      elevationAtBottom: -25,
      date: '2025-03-05',
      category: "Installed to Dense Soil Layer",
      stages: [
        { depth: 5, groutAmount: 30 },
        { depth: 10, groutAmount: 45 },
        { depth: 15, groutAmount: 60 },
        { depth: 20, groutAmount: 45 }
      ]
    },
    {
      id: "S002",
      x: 200,
      y: 100,
      totalDepth: 20,
      totalGrout: 130,
      elevationAtBottom: -20,
      date: '2025-03-07',
      category: "Installed to Top of Footing",
      stages: [
        { depth: 5, groutAmount: 20 },
        { depth: 10, groutAmount: 50 },
        { depth: 15, groutAmount: 60 }
      ]
    },
    {
      id: "PX003",
      x: 280,
      y: 200,
      totalDepth: 30,
      totalGrout: 220,
      elevationAtBottom: -30,
      date: '2025-03-10',
      category: "Obstruction Below New Mat",
      stages: [
        { depth: 5, groutAmount: 25 },
        { depth: 10, groutAmount: 35 },
        { depth: 15, groutAmount: 70 },
        { depth: 20, groutAmount: 55 },
        { depth: 25, groutAmount: 35 }
      ]
    },
    {
      id: "SX004",
      x: 350,
      y: 150,
      totalDepth: 22,
      totalGrout: 160,
      elevationAtBottom: -22,
      date: '2025-03-12',
      category: "Obstruction Above New Mat (No Grout)",
      stages: [
        { depth: 6, groutAmount: 40 },
        { depth: 12, groutAmount: 60 },
        { depth: 18, groutAmount: 60 }
      ]
    },
    {
      id: "U001",
      x: 180,
      y: 220,
      totalDepth: 18,
      totalGrout: 120,
      elevationAtBottom: -18,
      date: '2025-03-08',
      category: "Installed to Dense Soil Layer",
      stages: [
        { depth: 6, groutAmount: 40 },
        { depth: 12, groutAmount: 40 },
        { depth: 18, groutAmount: 40 }
      ]
    },
    {
      id: "P005",
      x: 150,
      y: 280,
      totalDepth: 0,
      totalGrout: 0,
      elevationAtBottom: 0,
      date: '',
      category: "Planned (Not Yet Installed)",
      stages: []
    },
    {
      id: "P006",
      x: 300,
      y: 300,
      totalDepth: 0,
      totalGrout: 0,
      elevationAtBottom: 0,
      date: '',
      category: "No Point (Access Issues)",
      stages: []
    }
  ];

  // State
  const [points] = useState(samplePoints);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Dimensions
  const pointSize = 15;
  const planWidth = 600;
  const planHeight = 400;
  const profileWidth = 400;
  const profileHeight = 500;
  
  // Helper functions
  const getHoleType = (id) => {
    if (id.startsWith("P") && !id.startsWith("PX")) return "Primary";
    if (id.startsWith("S") && !id.startsWith("SX")) return "Secondary";
    if (id.startsWith("PX")) return "Primary Shoring";
    if (id.startsWith("SX")) return "Secondary Shoring";
    if (id.startsWith("U")) return "Supplementary";
    return "Unknown";
  };
  
  const getCategoryColor = (category) => {
    switch(category) {
      case "Installed to Dense Soil Layer": return "#4CAF50";
      case "Installed to Top of Footing": return "#2196F3";
      case "Obstruction Below New Mat": return "#FFC107";
      case "Obstruction Above New Mat (No Grout)": return "#FF5722";
      case "No Point (Access Issues)": return "#9C27B0";
      case "Planned (Not Yet Installed)": return "#9E9E9E";
      default: return "#757575";
    }
  };
  
  const getTypeColor = (type) => {
    switch(type) {
      case "Primary": return "#4287f5";
      case "Secondary": return "#42f5a7";
      case "Primary Shoring": return "#f5a742";
      case "Secondary Shoring": return "#f542a7";
      case "Supplementary": return "#42d7f5";
      default: return "#888888";
    }
  };
  
  // Filter points based on selections
  const isPointVisible = (point) => {
    const type = getHoleType(point.id);
    
    // If no filters are selected, show all
    if (selectedTypes.length === 0 && selectedCategories.length === 0) {
      return true;
    }
    
    // If only types are selected
    if (selectedTypes.length > 0 && selectedCategories.length === 0) {
      return selectedTypes.includes(type);
    }
    
    // If only categories are selected
    if (selectedCategories.length === 0 && selectedCategories.length > 0) {
      return selectedCategories.includes(point.category);
    }
    
    // If both are selected
    return selectedTypes.includes(type) && selectedCategories.includes(point.category);
  };
  
  const filteredPoints = points.filter(isPointVisible);
  
  // Calculate statistics
  const statsTotal = filteredPoints.length;
  const statsGrout = filteredPoints.reduce((sum, p) => sum + (p.totalGrout || 0), 0);
  const statsAvgDepth = statsTotal > 0 
    ? filteredPoints.reduce((sum, p) => sum + (p.totalDepth || 0), 0) / statsTotal
    : 0;
  const statsAvgGrout = statsTotal > 0 
    ? statsGrout / statsTotal
    : 0;
  
  // Toggle selection functions
  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Pan and zoom handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    });
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(Math.max(0.5, Math.min(3, zoom + delta)));
  };
  
  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };
  
  return (
    <div className="flex flex-col p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Grouting Visualization Tool</h1>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-gray-100 p-3 rounded-lg mb-4">
            <h2 className="font-bold mb-2">Filter Options</h2>
            
            {/* Hole Type Selection Table */}
            <div className="mb-3">
              <h3 className="font-medium text-sm mb-1">Hole Types:</h3>
              <div className="bg-white p-2 rounded border max-h-40 overflow-y-auto">
                {HOLE_TYPES.map(type => (
                  <div 
                    key={type}
                    className={`flex items-center p-1 rounded cursor-pointer ${
                      selectedTypes.includes(type) ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => toggleType(type)}
                  >
                    <div 
                      className="w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: getTypeColor(type) }}
                    ></div>
                    <span className="text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Installation Status Selection Table */}
            <div className="mb-3">
              <h3 className="font-medium text-sm mb-1">Installation Status:</h3>
              <div className="bg-white p-2 rounded border max-h-40 overflow-y-auto">
                {INSTALLATION_CATEGORIES.map(category => (
                  <div 
                    key={category}
                    className={`flex items-center p-1 rounded cursor-pointer ${
                      selectedCategories.includes(category) ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    ></div>
                    <span className="text-sm">{category}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Click to select multiple items</p>
            </div>
            
            {/* Map Controls */}
            <div>
              <h3 className="font-medium text-sm mb-1">Map Controls:</h3>
              <div className="flex gap-2">
                <button 
                  className="bg-white px-2 py-1 rounded border text-sm"
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                >
                  Zoom In
                </button>
                <button 
                  className="bg-white px-2 py-1 rounded border text-sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                >
                  Zoom Out
                </button>
                <button 
                  className="bg-white px-2 py-1 rounded border text-sm"
                  onClick={resetView}
                >
                  Reset
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Drag to pan, use buttons to zoom</p>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <h2 className="font-bold mb-2">Project Statistics</h2>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">Total Points:</div>
                <div className="text-lg">{statsTotal}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Total Grout:</div>
                <div className="text-lg">{statsGrout.toFixed(1)} gal</div>
              </div>
              <div>
                <div className="text-sm font-medium">Avg. Depth:</div>
                <div className="text-lg">{statsAvgDepth.toFixed(1)} ft</div>
              </div>
              <div>
                <div className="text-sm font-medium">Avg. Grout/Hole:</div>
                <div className="text-lg">{statsAvgGrout.toFixed(1)} gal</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Plan View */}
            <div className="w-full lg:w-3/5">
              <div className="border border-gray-300 rounded">
                <div className="bg-gray-100 p-2 font-bold border-b border-gray-300 flex justify-between">
                  <span>Plan View</span>
                  <span className="text-sm font-normal">Zoom: {zoom.toFixed(1)}x</span>
                </div>
                
                <div 
                  className="relative bg-gray-50 overflow-hidden"
                  style={{width: planWidth, height: planHeight}}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                >
                  {/* Zoomable/pannable content */}
                  <div 
                    className="absolute"
                    style={{
                      transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                      transformOrigin: '0 0',
                      width: planWidth,
                      height: planHeight
                    }}
                  >
                    {/* Grid lines */}
                    {[...Array(10)].map((_, i) => (
                      <React.Fragment key={`grid-${i}`}>
                        <div 
                          className="absolute border-t border-gray-200" 
                          style={{
                            top: i * planHeight / 9,
                            width: planWidth,
                          }}
                        />
                        <div 
                          className="absolute border-l border-gray-200" 
                          style={{
                            left: i * planWidth / 9,
                            height: planHeight,
                          }}
                        />
                      </React.Fragment>
                    ))}
                    
                    {/* Points */}
                    {points.map(point => {
                      const highlighted = isPointVisible(point);
                      const isPlanned = point.category === "Planned (Not Yet Installed)";
                      
                      return (
                        <div 
                          key={point.id}
                          className={`absolute rounded-full cursor-pointer ${
                            selectedPoint?.id === point.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{
                            left: point.x - pointSize/2,
                            top: point.y - pointSize/2,
                            width: pointSize,
                            height: pointSize,
                            backgroundColor: highlighted 
                              ? (isPlanned ? "#9E9E9E" : getCategoryColor(point.category))
                              : "#cccccc",
                            opacity: highlighted ? 1 : 0.5,
                            border: isPlanned ? "2px dashed #333" : "none"
                          }}
                          onClick={() => setSelectedPoint(point)}
                        >
                          <div className="absolute -top-5 left-0 right-0 text-center">
                            <span className="text-xs bg-white px-1 rounded border border-gray-300">
                              {point.id}
                            </span>
                          </div>
                          {point.elevationAtBottom !== 0 && (
                            <div className="absolute -bottom-5 left-0 right-0 text-center">
                              <span className="text-xs bg-white px-1 rounded border border-gray-300">
                                {point.elevationAtBottom}ft
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile View */}
            <div className="w-full lg:w-2/5">
              <div className="border border-gray-300 rounded">
                <div className="bg-gray-100 p-2 font-bold border-b border-gray-300">
                  {selectedPoint 
                    ? `Profile: ${selectedPoint.id} (${getHoleType(selectedPoint.id)})` 
                    : "Profile View"}
                </div>
                
                <div 
                  className="relative bg-gray-50" 
                  style={{height: profileHeight}}
                >
                  {selectedPoint ? (
                    <>
                      {/* Depth scale */}
                      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-100">
                        {[...Array(11)].map((_, i) => (
                          <div 
                            key={`scale-${i}`} 
                            className="absolute left-0 right-0 flex items-center justify-end pr-1 border-t border-gray-300"
                            style={{ top: (i * profileHeight / 10) }}
                          >
                            <span className="text-xs">{(i * 30 / 10).toFixed(0)}ft</span>
                          </div>
                        ))}
                      </div>
                      
                      {selectedPoint.totalDepth > 0 ? (
                        <>
                          {/* Central hole line */}
                          <div 
                            className="absolute bg-gray-400" 
                            style={{ 
                              left: profileWidth / 2, 
                              top: 0, 
                              width: 4, 
                              height: (selectedPoint.totalDepth / 30) * profileHeight
                            }}
                          ></div>
                          
                          {/* Grout bulbs */}
                          {(selectedPoint.stages || []).map((stage, index) => {
                            // Calculate bulb size based on grout amount
                            const groutVolumeCuFt = stage.groutAmount * 0.134;
                            const bulbVolumeCuFt = groutVolumeCuFt / (VOID_PERCENTAGE / 100);
                            const radiusFeet = Math.cbrt((3 * bulbVolumeCuFt) / (4 * Math.PI));
                            const scaleFactor = 1.5 / Math.cbrt((3 * (40 * 0.134 / (VOID_PERCENTAGE / 100))) / (4 * Math.PI));
                            const bulbRadius = radiusFeet * scaleFactor * 20;
                            
                            const depth = (stage.depth / 30) * profileHeight;
                            
                            return (
                              <div 
                                key={`bulb-${index}`}
                                className="absolute rounded-full shadow-lg"
                                style={{ 
                                  left: (profileWidth / 2) - bulbRadius,
                                  top: depth - bulbRadius,
                                  width: bulbRadius * 2, 
                                  height: bulbRadius * 2,
                                  backgroundColor: getCategoryColor(selectedPoint.category)
                                }}
                              ></div>
                            );
                          })}
                          
                          {/* Bulb labels */}
                          {(selectedPoint.stages || []).map((stage, index) => {
                            const depth = (stage.depth / 30) * profileHeight;
                            
                            return (
                              <div 
                                key={`label-${index}`}
                                className="absolute text-xs"
                                style={{ 
                                  left: (profileWidth / 2) + 40,
                                  top: depth - 10,
                                }}
                              >
                                <div>Depth: {stage.depth}ft</div>
                                <div>Grout: {stage.groutAmount}gal</div>
                              </div>
                            );
                          })}
                          
                          {/* Bottom elevation marker */}
                          <div 
                            className="absolute flex items-center"
                            style={{ 
                              left: 10, 
                              top: (selectedPoint.totalDepth / 30) * profileHeight - 10,
                              width: profileWidth - 20
                            }}
                          >
                            <div className="text-xs font-bold py-1 px-2 bg-gray-100 border border-gray-300 rounded">
                              Bottom Elevation: {selectedPoint.elevationAtBottom}ft
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute top-1/3 left-0 right-0 text-center">
                          <div className="font-medium text-gray-500">
                            {selectedPoint.category === "Planned (Not Yet Installed)" 
                              ? "Planned Point - Not Yet Installed"
                              : `${selectedPoint.category} - No Grout Data`
                            }
                          </div>
                        </div>
                      )}
                      
                      {/* Point details */}
                      <div className="absolute top-2 left-12 bg-white bg-opacity-90 p-2 text-xs border rounded">
                        <div className="font-bold">Hole Details</div>
                        <div>ID: {selectedPoint.id}</div>
                        <div>Type: {getHoleType(selectedPoint.id)}</div>
                        <div>Status: {selectedPoint.category}</div>
                        <div>Total Depth: {selectedPoint.totalDepth} ft</div>
                        <div>Bottom Elevation: {selectedPoint.elevationAtBottom} ft</div>
                        <div>Total Grout: {selectedPoint.totalGrout} gallons</div>
                        {selectedPoint.date && <div>Date: {selectedPoint.date}</div>}
                        <div>Stages: {selectedPoint.stages?.length || 0}</div>
                        <button 
                          className="mt-2 bg-gray-200 px-1 py-0.5 rounded text-xs"
                          onClick={() => setSelectedPoint(null)}
                        >
                          Close
                        </button>
                      </div>
                      
                      {/* Legend */}
                      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-2 text-xs border rounded">
                        <div className="font-bold mb-1">Bulb Information</div>
                        <div>Void Ratio: {VOID_PERCENTAGE}%</div>
                        <div>40 gallons ≈ 3ft diameter</div>
                        <div className="mt-1">Bulb size based on grout volume</div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <div className="text-2xl mb-3">👆</div>
                        <div>Click on a point to view profile</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedGroutingApp;

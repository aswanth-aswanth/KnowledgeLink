export const handleCopySVG = (svgRef: React.RefObject<SVGSVGElement>) => {
    if (svgRef.current) {
      const svgContent = svgRef.current.outerHTML;
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };
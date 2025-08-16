import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import tinycolor from 'tinycolor2';
import CustomDateRangeDropdown from "./CustomDateRangeDropdown";
import { CustomCursorInside } from './CustomCursor';
// import { CustomCursorInside } from './CustomCursor';


const getDateArray = (start: Date, end: Date) => {
  const arr = [];
  let dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

type ChartDatum = {
  category: string;
  country: string;
  color: string;
  date: Date;
  value: number;
};


const parseRange = (range: string) => {
  const [start, end] = range.split("-");
  const parse = (s: string) => {
    if (s === "today") return new Date();
    const [mm, dd, yy] = s.split("/");
    return new Date(`20${yy}-${mm}-${dd}`);
  };
  return [parse(start), parse(end)];
};

const Linechartcomponent: React.FC<{ coloredData: any, selectedColor: string }> = ({ coloredData, selectedColor }) => {
  const ref = useRef<HTMLDivElement>(null);
  const selectedColorUpdate = useRef(false);
  const toolTipRef = useRef(null)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  

  
  const [dateRange, setDateRange] = useState("05/01/25-today");
  const [pendingDateRange, setPendingDateRange] = useState(dateRange);
  const [checkedColors, setCheckedColors] = useState<string[]>([selectedColor]);

  const [start, end] = parseRange(dateRange);
  const dates = getDateArray(start, end);
  const margin = { top: 10, right: 20, bottom: 40, left: 25 };
  const width = 400 - margin.left - margin.right;
  const height = 220 - margin.top - margin.bottom;

  const minBarWidth = 16;
  const dynamicWidth = dates.length > 25 ? dates.length * minBarWidth : width;

  const activeCountries = coloredData.filter((d: any) => checkedColors.includes(d.color));

  const chartData = activeCountries.flatMap((country: any) =>
    country.categories.flatMap((cat: any) =>
      dates.map(date => ({
        category: cat.category,
        country: country.Country,
        color: country.color,
        date,
        value: cat.value + Math.round(Math.random() * 10 - 5), //adding random value so it line shouldn't be straight
      }))
    )
  );

  const grouped = useMemo(()=> (d3.group(chartData, (d: any) => `${d.country}-${d.category}`)),[chartData])

  useEffect(() => {
    if (!ref.current) return;

    d3.select(ref.current).selectAll("*").remove();
    d3.select("#x-axis-container").selectAll("*").remove();

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3
    .scaleLinear()
      .domain([
        d3.min(chartData, (d: any) => d.value as number)! - 5,
        d3.max(chartData, (d: any) => d.value as number)! + 5
      ]) //range for y axis
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "6px");

      //svg.selectAll(".domain").attr("stroke", "none"); // Hide axis line
   // svg.selectAll(".tick line").attr("stroke", "none"); // Hide tick marks



    const x = d3.scaleTime()
      .domain([start, end])
      .range([0, dynamicWidth]);

    //const grouped = d3.group(chartData, (d: any) => `${d.country}-${d.category}`);

    const tooltip = d3.select("#tooltip");

    grouped.forEach((values, key) => {
      const [country, category] = key.split("-");
      const colorObj = activeCountries.find((c: any) => c.Country === country);
      let color = colorObj?.color || selectedColor;

      if (!selectedColorUpdate.current && checkedColors.length > 1) {
        color = colorObj?.color || selectedColor;
      }

      const categoryIndex = activeCountries
        .flatMap((c: any) => c.categories.map((cat: any) => cat.category))
        .indexOf(category);

      const categoryColor = tinycolor(color).lighten(categoryIndex * 10).toHexString();

      const line = d3.line<any>()
        .x(d => x(d.date))
        .y(d => y(d.value));


     

      svg.append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", categoryColor)
        .attr("stroke-width", 2)
        .attr("d", line as any)
        .on("mouseover", function (event, d) {
          const point: any = d[d.length - 1];
          const [mouseX] = d3.pointer(event, svg.node());
          const xDate = x.invert(mouseX);

          const bisect = d3.bisector((d: any) => d.date).left;
          const idx = bisect(d, xDate);
          const dataPoint: any = d[idx] || point;

          tooltip
            .style("display", "block")
            .html(`
              <table style="width: 100px; font-size: 10px;">
                <tr>
                  <td><strong>${country}</strong></td>
                  <td>${d3.timeFormat("%m/%d/%y")(dataPoint.date)}</td>
                </tr>
                ${
                  coloredData
                    .filter((a: any) => a.Country == country)
                    .map((d: any) =>
                      d.categories
                        .map((cat: any, catIdx: number) => {
                          const catColor = tinycolor(d.color).lighten(catIdx * 10).toHexString();
                          return `
                            <tr>
                              <td>
                                <div style="display:inline-block;width:10px;height:10px;background:${catColor};margin-right:4px;"></div>
                                ${cat.category}:
                              </td>
                              <td style="text-align: right">${cat.value}</td>
                            </tr>
                          `;
                        }).join("")
                    ).join("")
                }
              </table>
            `);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        });

        const flatLine = d3.line<any>()
            .x(d => x(d.date))
            .y((d) => y(d.value)); // y fixed to first value

svg.append("path")
  .datum(values)
  .attr("fill", "none")
  .attr("stroke", categoryColor) // lighter or different color
  .attr("stroke-width", 2)
  //.attr("stroke-dasharray", "4 2") // optional dashed line for difference
  .attr("d", flatLine);
    });

    selectedColorUpdate.current = false;

    // Render x-axis labels in separate container
    const xAxisSvg = d3.select("#x-axis-container")
      .append("svg")
      .attr("width", dynamicWidth)
      .attr("height", 40)
      .append("g")
      .attr("transform", "translate(0,20)")
      .call(
        d3.axisBottom(x)
          .tickValues(dates)
          .tickFormat((d: Date | d3.NumberValue) =>
            d3.timeFormat("%-d")(d instanceof Date ? d : new Date(Number(d)))
          )
      );

    xAxisSvg.selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "5px");

  }, [checkedColors, dateRange]);

  useEffect(() => {
    
    selectedColorUpdate.current = true;
    setCheckedColors([selectedColor]);
  }, [selectedColor]);
//   useEffect(() => {
//   if (!cursorPos || !ref.current) return;

//   const svg = d3.select(ref.current).select("svg g");
//   const tooltip = d3.select(toolTipRef.current);
//   const containerRect = ref.current.getBoundingClientRect();

//   const relativeX = cursorPos.x - containerRect.left - margin.left;
//   const relativeY = cursorPos.y - containerRect.top - margin.top;

//   // Use x.invert to get the date from X coordinate
//   const dateAtCursor = d3.scaleTime().domain([start, end]).range([0, dynamicWidth]).invert(relativeX);

//   let closestPoint: any = null;
//   let minDistance = Infinity;
//   let tooltipHTML = "";

//   grouped.forEach((dataPoints, key) => {
//     const bisect = d3.bisector((d: any) => d.date).left;
//     const idx = bisect(dataPoints, dateAtCursor);
//     const point = dataPoints[idx] as ChartDatum;


//     if (!point) return;

//     const xPos = d3.scaleTime().domain([start, end]).range([0, dynamicWidth])(point.date);
//     const yScale = d3.scaleLinear()
//       .domain([
//         d3.min(chartData, (d: any) => d.value as number)! - 5,
//         d3.max(chartData, (d: any) => d.value as number)! + 5,
//       ])
//       .range([height, 0]);
//     const yPos = yScale(point.value);

//     const dist = Math.hypot(xPos - relativeX, yPos - relativeY);

//     if (dist < 10 && dist < minDistance) {
//       minDistance = dist;
//       closestPoint = point;
//     }
//   });

//   if (closestPoint) {
//     tooltip
//       .style("display", "block")
//       .style("left", `${cursorPos.x + 10}px`)
//       .style("top", `${cursorPos.y - 30}px`)
//       .html(`
//               <table style="width: 100px; font-size: 10px;">
//                 <tr>
//                   <td><strong>${closestPoint.country}</strong></td>
//                   <td>${d3.timeFormat("%m/%d/%y")(closestPoint.date)}</td>
//                 </tr>
//                 ${
//                   coloredData
//                     .filter((a: any) => a.Country == closestPoint.country)
//                     .map((d: any) =>
//                       d.categories
//                         .map((cat: any, catIdx: number) => {
//                           const catColor = tinycolor(d.color).lighten(catIdx * 10).toHexString();
//                           return `
//                             <tr>
//                               <td>
//                                 <div style="display:inline-block;width:10px;height:10px;background:${catColor};margin-right:4px;"></div>
//                                 ${cat.category}:
//                               </td>
//                               <td style="text-align: right">${cat.value}</td>
//                             </tr>
//                           `;
//                         }).join("")
//                     ).join("")
//                 }
//               </table>
//             `);
//       // .html(`
//       //   <div style="font-size: 10px;">
//       //     <strong>${closestPoint.country}</strong><br/>
//       //     ${d3.timeFormat("%m/%d/%y")(closestPoint.date)}<br/>
//       //     ${closestPoint.category}: ${closestPoint.value}
//       //   </div>
//       // `)
//   } else {
//     tooltip.style("display", "none");
//   }
// }, [cursorPos, chartData, grouped, start, end, dynamicWidth]);


  const handleCheckboxChange = (color: string, checked: boolean) => {
    setCheckedColors(prev =>
      checked ? [...prev, color] : prev.filter(c => c !== color)
    );
  };

  const handleSelectAll = () => {
    setCheckedColors(coloredData.map((d: any) => d.color));
  };

  const handleDeselectAll = () => {
    setCheckedColors([selectedColor]);
  };

  useEffect(() => {
    setPendingDateRange(dateRange);
  }, [dateRange]);

  return (
    <>
      {/* <label htmlFor="daterangedropdown" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '11px', textAlign: 'left', margin: '1%' }}>
        Date range:
      </label>
      <select value={pendingDateRange} onChange={e => setPendingDateRange(e.target.value)}>
        <option value="05/01/25-today">From May 1, 2025 to Today</option>
        <option value="04/01/25-04/30/25">April 2025</option>
        <option value="03/01/25-03/31/25">March 2025</option>
      </select>
      <button
        className="outlined-button"
        onClick={() => {
          if (pendingDateRange !== dateRange) setDateRange(pendingDateRange);
        }}
      >
        Generate
      </button> */}
    <CustomDateRangeDropdown setDateRange={setDateRange} />


      <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '0px' }}>
        <div style={{ marginRight: '20px', marginTop: '-32px' }}>
          <div style={{ fontSize: '8px', marginBottom: '14px' }}>
            <label>
              <input
                type="checkbox"
                onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                checked={checkedColors.length === coloredData.length}
                style={{ marginRight: '4px' }}
              />
              <span>Select All</span>
            </label>

            <label style={{ marginLeft: '16px' }}>
              <input type="checkbox" onChange={() => handleDeselectAll()} />
              <span>Deselect All</span>
            </label>
          </div>

          {coloredData.map((d: any) => (
            <div key={d.color} style={{ display: 'flex', fontSize: '8px', marginBottom: '1px' }}>
              <input
                type="checkbox"
                checked={checkedColors.includes(d.color)}
                onChange={(e) => handleCheckboxChange(d.color, e.target.checked)}
                style={{ width: '10px', height: '10px', marginRight: '6px', marginTop: '0px' }}
              />
              <div style={{
                width: '10px',
                height: '10px',
                backgroundColor: d.color,
                marginRight: '6px'
              }} />
              <span>{d.Country}</span>
            </div>
          ))}
        </div>

        {/* Main chart + x-axis labels (scrollable) */}
        <div style={{ display: 'flex', flexDirection: 'column' , marginRight: '22%', marginTop: '-3%'}}>
          
          <div ref={ref} />
      

         <div
  id="x-axis-scroll-container" // change internal styling
  style={{
    position: 'relative',
    height: '42px',
    marginTop: '-16%',
    marginLeft: '6%',
    
    
    width: `${width + margin.left + margin.right}px`,
    overflowX: dates.length > 25 ? 'auto' : 'hidden',
    overflowY: 'hidden',
    borderTop: '1px solid #eee'
  }}
>
  <div
    id="x-axis-container"
    style={{
      width: `${dynamicWidth}px`,
      height: '100%',
      position: 'relative'
    }}
  />
</div>

        </div>
      </div>
<div
        id="tooltip"
        ref={toolTipRef}
        style={{
          position: 'absolute',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          padding: '6px 10px',
          fontSize: '10px',
          pointerEvents: 'none',
          display: 'none',
          zIndex: 1000,
          color: '#333',
          maxWidth: '200px',
          whiteSpace: 'nowrap'
        }}
      ></div>
      {/* Custom cursor inside the chart area 
      <CustomCursorInside
        containerRef={ref}
        onMouseMove={(x, y) => setCursorPos({ x, y })}
*/}
     
        
    </>
  );
};

export default Linechartcomponent;




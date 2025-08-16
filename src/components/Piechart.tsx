import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { exportImportData as rawData } from "../components/data";
import tinycolor from 'tinycolor2';
import { VscTriangleRight } from "react-icons/vsc";
import DonutChart from './DonutChart';


const getSecondChartData = (country: any) :any =>
{
  const countryData = rawData.find((item: any) => item.Country === country);
  return countryData?.categories || [];
}
const Piechart: React.FC<{coloredData: any, selectedColor: string, setSelectedColor: (color: string) => void}> = ({ coloredData, selectedColor, setSelectedColor }) => {
  const [selectedCountry, setSelectedCountry] = useState('Service Area Enquiry');
  const [secondChartData, setSecondChartData] = useState(getSecondChartData(selectedCountry));

  // update second chart data when country changes
  useEffect(() => {
    setSecondChartData(getSecondChartData(selectedCountry));
  }, [selectedCountry]);

  // handle main chart slice click
  const handleMainChartClick = (d: any) => {
    setSelectedColor(d.color);
    setSelectedCountry(d.Country);
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 600, height: 420, display: 'flex', flexDirection: 'row-reverse', gap: 10, justifyContent: 'center' }}>
        <DonutChart
          marginleft={'-80%'}
          data={coloredData}
          valueKey="Export"
          categoryKey="Country"
          width={180}
          height={180}
          title="Total Interaction Today"
          onClick={handleMainChartClick}
          totalValue={d3.sum(coloredData, (d: any) => d.Export)}
          customColorFn={(d) => d.color}
          centerLabel={`Total Interactions Today *^ ${d3.sum(coloredData, (d: any) => d.Export)}`}
          showLegend={true}
        />
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 220, backgroundColor: '#ccc', marginTop: '-28%' }}>
        <div style={{ width: 1, height: 40, background: '#ccc', marginBottom: 8 }} />
 {VscTriangleRight({ size: 24, style: { marginLeft: '-5px', marginTop: '60px' } })}        <div style={{ width: 1, height: 40, background: '#ccc', marginTop: 8 }} />
      </div>

      {/* Second Donut Chart */}
      <div style={{ width: 247, height: 200, marginBottom: '28%', marginLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <DonutChart
         marginleft={'10px'}
          data={secondChartData}
          valueKey="value"
          categoryKey="category"
          width={120}
          height={120}
          title={selectedCountry}
          onClick={undefined}
          totalValue={d3.sum(secondChartData, (d:any) => d.value)}
          customColorFn={(d, i) =>
            tinycolor(selectedColor || '#888888').lighten(i * 10).toHexString()
          }
          centerLabel={`total interactions *^ ${d3.sum(secondChartData, (d: any) => d.value)}`}
          showLegend={true}
        />
      </div>
    </div>
  );
};
export default Piechart



// const getSecondChartData = (country: any) :any =>
// {
//   const countryData = rawData.find((item: any) => item.Country === country);
//   return countryData?.categories || [];
// }


// type colorFn = (data: any, index: number) => string;

// const customColorFn: colorFn | undefined = (data, index) =>
// {
//   return data.color
// }





// const Piechart: React.FunctionComponent<{coloredData: any, selectedColor: any, setSelectedColor: any}> = ({coloredData, selectedColor, setSelectedColor}) =>
// {
//   const mainChartRef = useRef(null);
//   const secondChartRef = useRef(null)

//   interface ExportImportDatum{
//     Country: String,
//     Export: number,
//     Import: number,
//     color: string
//   }

//   const [selectedCountry, setSelectedCountry] = useState('Product Availability');
//   // const [selectedColor, setSelectedColor] = useState('#80b1d3')
//   const [secondChartData, setSecondChartData] = useState(getSecondChartData('Product Availability'));

// //const width =120, height=120, radius = Math.min(width, height)/2;

// //color Assignment to generate 20+ colors
// const colorPalette =[...d3.schemeSet3, ...d3.schemePaired, ...d3.schemeDark2]

// const colors = d3.scaleOrdinal(colorPalette)

// //add generated color to each category
// //const coloredData = rawData.map((d, i:any) =>{ return { ...d, color: colors(i)}  })

// //function to clear donut
// const renderDonut = (
//   flag: boolean,
//   options: {
//     marginValue: string;
//     widthValue: number;
//     heightValue: number;
//     marginTopValue: string;
//   },
//   container: HTMLElement | null,
//   data: any[],
//   valueKey: string,
//   categoryKey: string,
//   title: string,
//   onClick: ((d: any) => void) | null,
//   totalvalue: number | string,
//   customColorFn: colorFn | null,
//   centerLabel: string,
// ) => {
//   d3.select(container).selectAll('*').remove();
// const radius = Math.min(options.widthValue, options.heightValue)/2;
//   // Legend container (just after the chart SVG)
// let legendContainer: d3.Selection<HTMLDivElement, unknown, null, undefined>;
//   let svgContainer: d3.Selection<SVGSVGElement, unknown, null, undefined>;

//   // if (flag) {
//   //   // Append legend first, then pie chart
//   //   legendContainer = d3.select(container)
//   //     .append('div')
//   //      .style('margin-top',  '1%');
      
//   //   svgContainer = d3.select(container)
//   //     .append('svg')
//   //     .attr('width', options.widthValue)
//   //   .attr('height', options.heightValue)
    
//   // } else {
//   //   // Append pie chart first, then legend
//   //   svgContainer = d3.select(container)
//   //     .append('svg')
//   //     .attr('width', options.widthValue)
//   //     .attr('height', options.heightValue);
//   //   legendContainer = d3.select(container)
//   //     .append('div')
//   //      .style('margin-top',  '1%');

//   // }
//   // const legendContainer = d3.select(container)
//   //   .append('div')
//    // .style('margin-top',  '1%');
   
//     legendContainer = d3.select(container)
//       .append('div')
//        .style('margin-top',  '1%');
//     if(flag){ legendContainer.append('div')
//     .style('text-align', 'left')
//     .style('margin-top', '-5px')
//     .style('margin-bottom', '5px')
//     .style('font-weight', 'bold')
//     .style('font-size',  '11px')
//     .text(title)}
    

//   // const legendItems = legendContainer.selectAll('div')
//   //   .data(data)
//   //   .enter()
//   //   .append('div')
//   //   .style('display', 'flex')
//   //   .style('align-items', 'center')
//   //   .style('margin-bottom', '4px')
//   //   .attr('class', 'legend-item')
// //   .style('font-size',  '9px'); 

//   const legendItems = legendContainer.selectAll('.legend-item')
//   .data(data)
//   .enter()
//   .append('div')
//   .attr('class', 'legend-item')
//   .style('display', 'flex')
//   .style('align-items', 'center')
//   .style('margin-bottom', '4px')
//   .style('font-size',  '7px');

//   legendItems.append('div')
//     .style('width', '12px')
//     .style('height', '12px')
//     .style('margin-right', '6px')
//     .style('background-color', (d, i) =>
//       customColorFn ? customColorFn(d, i) : d.color
    
//     );

//   legendItems.append('span')
//     .text(d => d[categoryKey]);

//   const svg = d3.select(container).append('svg')
//     .attr('width', options.widthValue)
//     .attr('height', options.heightValue)
//     .style('margin-top', options.marginTopValue)
//     .append('g')
//     .attr('transform', `translate(${options.widthValue / 2}, ${options.heightValue / 2})`);

//   const pie = d3.pie<any>().value((d: any) => d[valueKey]).sort(null);

//   const arc = d3.arc<d3.PieArcDatum<ExportImportDatum>>()
//     .innerRadius(radius * 0.7)
//     .outerRadius(radius);

//   const arcs = svg.selectAll('arc').data(pie(data)).enter().append('g');

//   arcs.append('path').attr('d', arc);
//   arcs.append('path').attr('d', arc).attr('fill', (d, i) => 
//     customColorFn ? customColorFn(d.data, i) : d.data.color)
//   //d.data.color)
//     .on('click', (event: any, d: { data: any; }) => onClick?.(d.data));

//   // arcs.append('text').attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
//   //   .attr('text-anchor', 'middle')
//   //   .attr('font-size', '5px')
//   //   .attr('fill', '#000')
//   //   .text((d: { data: { [x: string]: any; }; }) => d.data[valueKey]);
//   // Suppose totalvalue = 1995

//     const centerLabelValue = centerLabel.split("*^")[1];
// arcs.append('text')
//   .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
//   .attr('text-anchor', 'middle')
//   .attr('font-size', '6px')
//   .attr('fill', '#000')
//   .text((d: any) => {
//     const percent = ((d.data[valueKey] / Number(centerLabelValue) * 100).toFixed(1));
//     return `${percent}%`;
//   });

//   // Title
//   const centerLabelText = centerLabel.split("*^")[0];


//   const textElement = svg.append('text')
//     .attr('text-anchor', 'middle')
//     .attr('font-size', '6px')
//     .attr('dy', '.35rem')
//     .attr('pointer-events', 'none');

//       textElement.append('tspan')
//     .text(centerLabelValue)
//     .style('font-weight', 'bold')
//     .style('font-size', 'large');

//   textElement.append('tspan')
//     .text(centerLabelText)
//      .attr('x', 0) // Keep centered
//     .attr('dy', '1em') // Shift down by one line

//     if(!flag){d3.select(container)
//         .append('div')
//         .style('text-align', 'left')
//         .style('margin-top', '-5px')
//         .style('margin-bottom', '5px')
//         .style('font-weight', 'bold')
//         .style('font-size',  '11px')
//         .text(title)}


// }

// // const getTotalExport = () =>
// // {
// //   return coloredData.reduce((acc, item ) => acc+ item.Export, 0)
// // }


// useEffect(()=>
// {
//   renderDonut(
//     true,
//     { marginValue: '2%', widthValue: 180, heightValue: 180, marginTopValue: '8%' },
//     mainChartRef.current,
//     coloredData,
//     'Export',
//     'Country',
//     'Total Interaction Today',
//     (clickedData) =>{ setSelectedColor(clickedData.color);
//       setSelectedCountry(clickedData.Country)
//       setSecondChartData(getSecondChartData(clickedData.Country))
//     },
//     d3.sum(coloredData, (d: any) => d.Export),
//     customColorFn,
//      `Total Interactions Today *^ ${d3.sum(coloredData, (d: any) => d.Export)}`
//   )
// },[])


// //try replacing this with useLayout
// useEffect(()=>
// {
//   if(!selectedCountry) return

//   setTimeout(()=>
//   {
//     renderDonut(
//       false,
//           { marginValue: '2%', widthValue: 120, heightValue: 120, marginTopValue: '3%' },

//       secondChartRef.current,
//       secondChartData,
//       'value',
//       'category',
//       selectedCountry,
//       null,
//       d3.sum(secondChartData, (d: {value: any})=>d.value),
//       (__d: any, i: number) =>
      
//         tinycolor(selectedColor || '#888888')
//         .lighten(i*10)
//         .toHexString(),
//         `total interactions *^  ${d3.sum(secondChartData, (d: any) => d.value)}`
//     )


//     //rendering line chart
    


//   },0) //wait for the DOM to update

// },[selectedCountry, selectedColor, secondChartData])



// return(
// <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
//   {/*Main Donut chart */}
//   <div ref={mainChartRef} style={{width: '600px', height: '420px', display: 'flex', gap: '20px', justifyContent: 'center' }}></div>

//   {/*Divider */}
//   <div style={{width: '1px', height:'300px', backgroundColor: '#ccc', marginTop: '-18%'}}>
// <div style={{ width: "1px", height: "40px", background: "#ccc", marginBottom: "8px" }} />
//     {VscTriangleRight({ size: 24, style: { marginLeft: '-5px', marginTop: '60px' } })}
//     <div style={{ width: "1px", height: "40px", background: "#ccc", marginTop: "8px" }} />
//  </div>
//   {/** Second Donut chart */}
//   {<div ref={secondChartRef} key={selectedCountry} style={{width: '247px', height: '200px', marginBottom: '28%', marginLeft: '20px', display: 'flex', flexDirection: 'column-reverse', gap: '4px'}} ></div>}
  
// </div>
// )




// }




// export default Piechart;














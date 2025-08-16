import React from 'react';
import * as d3 from 'd3';

type DonutChartProps = {
    marginleft: any;
    data: any[];
  valueKey: string;
  categoryKey: string;
  width: number;
  height: number;
  title?: string;
  onClick?: (d: any) => void;
  totalValue: number | string;
  customColorFn?: (data: any, index: number) => string;
  centerLabel: string;
  showLegend?: boolean;
};

const DonutChart: React.FC<DonutChartProps> = ({
  marginleft,
  data,
  valueKey,
  categoryKey,
  width,
  height,
  title,
  onClick,
  totalValue,
  customColorFn,
  centerLabel,
  showLegend = true,
}) => {
  const radius = Math.min(width, height) / 2;
  const pieGenerator = d3.pie<any>().value((d) => d[valueKey]).sort(null);
  const arcGenerator = d3.arc<d3.PieArcDatum<any>>()
    .innerRadius(radius * 0.7)
    .outerRadius(radius);

  const arcs = pieGenerator(data);

  // Split centerLabel into label and number, expecting format "Label *^ Number"
  const [centerLabelText, centerLabelValueRaw] = centerLabel.split('*^').map(s => s.trim());
  const centerLabelValue = centerLabelValueRaw || totalValue;

  return (
    // <div style={{ textAlign: 'center'  }}>
    <>
      
      <div>
                 {title && <div style={{ fontWeight: 'bolder', marginBottom: '10px', fontSize: '11px', textAlign: 'left', marginLeft: marginleft }}>{title}</div>}


      <svg width={width} height={height}>
       
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arc, i) => {
            const path = arcGenerator(arc) || '';
            const fill = customColorFn ? customColorFn(arc.data, i) : arc.data.color;
            const percent = ((arc.data[valueKey] / Number(centerLabelValue)) * 100).toFixed(1);
            const [centroidX, centroidY] = arcGenerator.centroid(arc);

            return (
              <g key={i} onClick={() => onClick && onClick(arc.data)} style={{ cursor: onClick ? 'pointer' : 'default' }}>
                <path d={path} fill={fill} />
                <text
                  x={centroidX}
                  y={centroidY}
                  textAnchor="middle"
                  fontSize={6}
                  fill="#000"
                  pointerEvents="none"
                >
                  {percent}%
                </text>
              </g>
            );
          })}

          <text textAnchor="middle" fontSize={12} dy=".35em" pointerEvents="none">
            <tspan x="0" dy="0" fontWeight="bold" fontSize="large">{centerLabelValue}</tspan>
            <tspan x="0" dy="1.2em" fontSize={10}>{centerLabelText}</tspan>
          </text>
        </g>
      </svg>
      </div>

      {showLegend && (
        <div style={{ margin: '5%', textAlign: 'left', fontSize: '9px' }}>
          {data.map((d, i) => {
            const color = customColorFn ? customColorFn(d, i) : d.color;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '4px',
                  cursor: onClick ? 'pointer' : 'default',
                  
                }}
                onClick={() => onClick && onClick(d)}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    marginRight: 6,
                    backgroundColor: color,
                  }}
                />
                <span>{d[categoryKey]}</span>
              </div>
            );
          })}
        </div>
      )}
       {/* </div> */}
       </>
     
   
  );
};

export default DonutChart;

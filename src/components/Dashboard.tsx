import React, { useState } from 'react'
import "../components/Dashboard.css";
import Piechart from './Piechart';
import Linechartcomponent from './Linechartcomponent';
import * as d3 from 'd3';
import { exportImportData as rawData } from "../components/data";
import tinycolor from 'tinycolor2';
import TicketView  from './TicketView';
import { BiFilterAlt } from 'react-icons/bi';
import { displayPartsToString } from 'typescript';

//color Assignment to generate 20+ colors
const colorPalette =[...d3.schemeSet3, ...d3.schemePaired, ...d3.schemeDark2]

const colors = d3.scaleOrdinal(colorPalette)

//add generated color to each category
// const coloredData = rawData.map((d, i:any) =>{ return { ...d, color: colors(i)}  })
const coloredData = rawData.map((d, i) => ({
  ...d,
  color: tinycolor(colorPalette[i % colorPalette.length]).darken(15).toHexString()
}));

export const Dashboard = () => {
  const [selectedColor, setSelectedColor] = useState('#fc9016')


  return (
    <>
      <div>
        <header className='logo'>
          <img src="/images/logo.png" alt="logo img" />
          <p> Data Analyst : TG</p>
        </header>
        <header className='chart-filters'>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {BiFilterAlt({ size: 18 })}
          
          <p style={{display: 'inline', fontWeight: 'bold'}}>Filters</p>
          </span>
          <div className='filters'>
            {Array.from({ length: 6 }).map((_, index) => (
              <>

                <label htmlFor="dropdown" className="filterlabel">Geography:</label>
                <select key={index} >
                  <option value="option1">Copper</option>
                  <option value="option2">Voice</option>
                  <option value="option3">Cell</option>
                </select>
              </>
            ))}

          </div>
          <button className='outlined-button'> Apply filters</button>

        </header>
        <div className='dashboard'>
          <div className='pieChart graph'>
            <Piechart coloredData={coloredData} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
          </div>
          <div className='lineChart graph'>
 <Linechartcomponent coloredData={coloredData} selectedColor={selectedColor} />
          </div>
          </div>
          <div className='dataTable table'>
                  <TicketView/>
        </div>
      </div>
    </>


  )
}

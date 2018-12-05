import React from 'react'

import './Grid.css'

const Grid = () => {
  return (
    <main className='Grid__container'>
      {
        Array(9).fill(0).map((_, idx) => (
          <section className='Grid__region' key={idx}>
            {
              Array(9).fill(0).map((_, idx) => (
                <input type='text' className='Grid__cell' key={idx} />
              ))
            }
          </section>
        ))
      }
    </main>
  )
}

export default Grid

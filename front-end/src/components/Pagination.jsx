import React from 'react'
import { Link } from 'react-router-dom'

const Pagination = ({pages, page, url, identify}) => {
  
  return (
    <div className={`d-flex gap-3 justify-content-center pagination ${identify}`}>
      <Link className={`${[...Array(pages).keys()][0] + 1 === Number(page) || pages === 0 ? "disabled" : "" }`} to={`${url}?page=${[...Array(pages).keys()][0] + 1}`}>{`<< First`}</Link>
      <Link className={`${[...Array(pages).keys()][0] + 1 === Number(page) || pages === 0 ? "disabled" : "" }`} to={`${url}?page=${Number(page) - 1}`}>{`< Prev`}</Link>
      
      {pages !== 0 ?[...Array(pages).keys()].map(x => (
        <Link key={x + 1} className={`item ${x + 1 === Number(page) ? "active" : ""}`} to={`${url}?page=${x + 1}`}>{x + 1}</Link>
      )) : <Link className={`item active`}>1</Link>} 
      <Link className={`${[...Array(pages).keys()].pop() + 1 === Number(page) || pages === 0 ? "disabled" : "" }`} to={`${url}?page=${Number(page) + 1}`}>{`Next >`}</Link>
      <Link className={`${[...Array(pages).keys()].pop() + 1 === Number(page) || pages === 0 ? "disabled" : "" }`} to={`${url}?page=${[...Array(pages).keys()].pop() + 1}`}>{`Last >>`}</Link>
    </div>
  )
}

export default Pagination
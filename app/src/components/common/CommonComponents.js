import './CommonComponents.css'
import React from 'react';

function card(title, body = null, size = "") {
  let className = ["col", size].join(" ");
  if (Array.isArray(body)) {
    body = body.map((item) => {
      return (
        <div className="row mt-3">
          <div className="col">
            {item}
          </div>
        </div>
      )
    });
  }

  return (
    <div className={className}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          {body}
        </div>
      </div>
    </div>
  )
}

function list(items) {
  return (
    <ul className="list-group">
      {items.map((item, index) => (
        <li className="list-group-item d-flex justify-content-between align-items-center">
          {item[0]}
          <span className="badge">{item[1]}</span>
        </li>
      ))}
    </ul>
  )
}

function headerList(items) {
  const columns = []
  
  for(let i=0; i<items.length; i++){
    if(i !== 0){
      columns.push(<div className="v-divider"></div>)
    }
    columns.push((
      <div className="col mt-3">
        <h5>{items[i][0]}</h5>
        {items[i][1]}
      </div>
    ))
  }
  return (
    <div className="container headerList">
      <div className="row">
        {columns}
      </div>
    </div>
  )
}

const CommonComponents = {
  card,
  list,
  headerList
}
export default CommonComponents
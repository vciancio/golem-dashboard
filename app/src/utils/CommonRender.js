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

const CommonRender = {
  card,
  list
}
export default CommonRender
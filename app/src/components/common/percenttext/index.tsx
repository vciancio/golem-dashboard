import React from 'react'
import './PercentText.css'

type Props = {
  value: number
}

class PercentText extends React.Component {

  _value: number|null = null

  constructor(props: Props) {
    super(props)
    this._value = props.value
  }

  render() {
    const value = this._value
    if (!value) {
      return null
    }

    const percent = Math.round(value)
    const percentRend = percent.toString() + "%"

    let c;
    if (percent >= 80) {
      c = "percent-high"
    } else if (percent >= 50) {
      c = "percent-mid"
    } else {
      c = ""
    }

    return (<span className={c}>{percentRend}</span>)
  }
}

export default PercentText
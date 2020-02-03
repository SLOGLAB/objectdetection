// import React from "react"
// import ReactDOM from "react-dom"
// import App from "./Components/App"

// ReactDOM.render(<App />, document.getElementById("root"))

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()

import React, { useState } from "react"
import { Line } from "react-lineto"

import * as cocoSsd from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs"
import "./styles.css"

export class ObjectDetection extends React.Component {
  videoRef = React.createRef()
  canvasRef = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      thereis1: 0,
      thereis2: 0,
      thereis3: 0
    }
  }

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user"
          }
        })
        .then(stream => {
          window.stream = stream
          this.videoRef.current.srcObject = stream
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve()
            }
          })
        })
      const modelPromise = cocoSsd.load()
      Promise.all([modelPromise, webCamPromise])
        .then(values => {
          this.detectFrame(this.videoRef.current, values[0])
        })
        .catch(error => {
          console.error(error)
        })
    }
  }

  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions)
      requestAnimationFrame(() => {
        this.detectFrame(video, model)
      })
    })
  }

  renderPredictions = predictions => {
    const ctx = this.canvasRef.current.getContext("2d")
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // Font options.
    const font = "16px sans-serif"
    ctx.font = font
    ctx.textBaseline = "top"
    predictions.forEach(prediction => {
      if (prediction.class === "person") {
        const x = prediction.bbox[0]
        const y = prediction.bbox[1]
        const width = prediction.bbox[2]
        const height = prediction.bbox[3]
        const center_x = x + width / 2
        const center_y = y + height / 2
        // Draw the bounding box.
        ctx.strokeStyle = "#00FFFF"
        ctx.lineWidth = 4
        ctx.strokeRect(x, y, width, height)
        // Draw the label background.
        ctx.fillStyle = "#00FFFF"
        const textWidth = ctx.measureText(prediction.class).width
        const textHeight = parseInt(font, 10) // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4)
        // console.log(prediction)
        // if (prediction.class === "person") {
        //   console.log(prediction)
        // }
        // if (prediction.class === "person") {
        if (center_x < 600 / 3) {
          this.setState({ thereis1: this.state.thereis1 + 1 / 20 })
        }
        if (600 / 3 < center_x && center_x < (600 / 3) * 2) {
          this.setState({ thereis2: this.state.thereis2 + 1 / 20 })
        }
        if ((600 / 3) * 2 < center_x && center_x < 600) {
          this.setState({ thereis3: this.state.thereis3 + 1 / 20 })
        }
      }
      // }
    })

    predictions.forEach(prediction => {
      if (prediction.class === "person") {
        const x = prediction.bbox[0]
        const y = prediction.bbox[1]
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000"
        ctx.fillText(prediction.class, x, y)
      }
    })
  }

  render() {
    return (
      <div>
        <video
          className="size"
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          width="600"
          height="500"
        />
        <Line x0={600 / 3} y0={0} x1={600 / 3} y1={500} />
        <Line x0={(600 / 3) * 2} y0={0} x1={(600 / 3) * 2} y1={500} />
        <div>
          time1:{Math.floor(this.state.thereis1)} time2:{Math.floor(this.state.thereis2)} time3:
          {Math.floor(this.state.thereis3)}
        </div>
        <canvas className="size" ref={this.canvasRef} width="600" height="500" />
      </div>
    )
  }
}

export default ObjectDetection

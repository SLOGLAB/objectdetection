import React, { Component, useState } from "react"
import { ObjectDetection } from "../Components/objectDetection/ObjectDetection"

export default () => {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <ObjectDetection />
    </div>
  )
}

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <ObjectDetection />
//       </div>
//     )
//   }
// }

// export default App

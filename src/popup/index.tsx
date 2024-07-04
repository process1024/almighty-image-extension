import React from "react"

import { sendCurrentTabMessage } from "~services/message"

function Popup() {
  function showSelectCapture() {
    sendCurrentTabMessage({ type: "showSelectCapture" })
  }

  function captureCurrent() {
    sendCurrentTabMessage({ type: "captureCurrent" })
    window.close()
  }

  function captureFullPage() {
    sendCurrentTabMessage({ type: "captureFullPage" })
    window.close()
  }

  return (
    <div className="btn-wrap">
      <button className="btn" onClick={showSelectCapture}>
        <p>选定区域截图</p>
      </button>
      <button className="btn" onClick={captureCurrent}>
        <p>可视区域截图</p>
      </button>
      <button className="btn" onClick={captureFullPage}>
        <p>整张截图</p>
      </button>
    </div>
  )
}

export default Popup

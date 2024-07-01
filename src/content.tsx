import { useEffect, useState } from "react";
import Capture from "~components/Capture";
import { When } from "react-if";
import capture from "~services/capture";
import styleText from "data-text:./styles/content/index.less"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

function IndexContent() {
    const [contentUiType, setContentUiType] = useState("");
    console.log('IndexContent');

    useEffect(() => {
      console.log('useEffect');
      const listenerEventMap = {
        showSelectCapture: function () {
          setContentUiType("capture");
        },
        captureCurrent: function () {
          // 添加setTimeout 是因为等待一下message的关闭，避免截图到message
          setTimeout(() => {
            capture.captureCurrent();
          }, 300);
        },
        captureFullPage: function () {
          capture.captureFullPage();
        }
      };
    
      const messageListener = (request) => {
        console.log(request);
        listenerEventMap[request.type] && listenerEventMap[request.type](request);
      };
    
      chrome.runtime.onMessage.addListener(messageListener);
    }, [])

    // return <button>Custom button</button>
    return (
        <div>
          <When condition={contentUiType === "capture"}>
            <Capture onCancel={() => setContentUiType("default")} />
          </When>
        </div>
    )
}

export default IndexContent;

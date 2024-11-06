import React, {  useEffect, useState,  useRef} from 'react';
import { fabric } from 'fabric';
import { getBase64ImageDimensions } from '~utils/image';

const Canvas = () => {
    const canvasRef = useRef(null);
    const [size, setSize] = useState({width: 0, height: 0});

    useEffect(() => {

        const canvas = new fabric.Canvas(canvasRef.current);

        // canvas.on('mouse:down', options => {
        // console.log(`x轴坐标: ${options.e.clientX};    y轴坐标: ${options.e.clientY}`)
        // })
        
        chrome.storage.local.get(['imageData']).then(async res => {
            const { imageData } = res;
            const { width, height }  = await getBase64ImageDimensions(imageData);
            console.log(width, height);

            setSize({width, height});
            canvas.setWidth(width);
            canvas.setHeight(height);

            canvas.setBackgroundImage(
                imageData,
                canvas.renderAll.bind(canvas)
            )
        });

        return () => {
            canvas.dispose();
        }
    },[])

    return <canvas id="kkkk" ref={canvasRef} height={size.height} width={size.width}/>

}

export default Canvas;
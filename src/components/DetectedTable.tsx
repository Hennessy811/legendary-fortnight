import React, { useEffect, useRef, useState } from "react"

import { Image, Layer, Rect, Stage, Text } from "react-konva"
import useImage from "use-image"

import { getPredictions } from "../pages/index"

const classes = [
  "active player",
  "bet",
  "button",
  "card",
  "dealer",
  "empty seat",
  "inactive player",
  "pot",
  "round pot",
]

const usePredictions = (img) => {
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    if (img) getPredictions(img).then(setPredictions)
  }, [img])

  return {
    boxes: predictions[0] as number[][] | undefined,
    probabilities: predictions[1] as number[] | undefined,
    labels: predictions[2] as number[] | undefined,
  }
}

const DetectedTable = ({ file }) => {
  const [predictions, setPredictions] = useState()
  const [image] = useImage(file)
  const img = useRef()
  const { boxes, labels, probabilities } = usePredictions(img.current)

  console.log({ boxes })

  return (
    <div>
      <h1>Detected Table</h1>
      <img className="hidden" ref={img} src={file} key={file} alt={file} />

      <div className="mt-12">
        <Stage width={600} height={434}>
          <Layer>
            <Image image={image} />

            {boxes?.map((box, i) => {
              const bbx = box[0] * image.width
              const bby = box[1] * image.height
              const bbw = (box[2] - box[0]) * image.width
              const bbh = (box[3] - box[1]) * image.height

              return (
                <>
                  <Text
                    x={bbx}
                    y={bby}
                    text={`${classes[labels[i]]} | ${(
                      probabilities[i] * 100
                    ).toFixed(2)}%`}
                    fill="white"
                    fontSize={14}
                  />
                  <Rect
                    x={bbx}
                    y={bby}
                    width={bbw}
                    height={bbh}
                    fill="red"
                    opacity={0.3}
                  />
                </>
              )
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
export default DetectedTable

import React, { useEffect, useState } from "react"

import dynamic from "next/dynamic"

import { ObjectDetectionModel } from "@utils/tfjs"

const DetectedTable = dynamic(() => import("../components/DetectedTable"), {
  ssr: false,
})

const fetchFiles = async () => {
  const response = await fetch("/api/tables")
  const files = await response.json()
  return files.tables
}

const model = new ObjectDetectionModel()

const loadModel = async () => {
  console.log("Loading model...")
  await model.loadModelAsync("/models/objects/model.json")
  console.log("Model loaded!")
}

export const getPredictions = async (image) => {
  const predictions = await model.executeAsync(image)
  return predictions
}

function Home() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    loadModel()
    const i = setInterval(() => {
      fetchFiles().then(setFiles)
    }, 5000)
    return () => clearInterval(i)
  }, [])

  return (
    <div>
      <h1>Home</h1>

      {files.map((file) => (
        <DetectedTable file={file} key={file} />
      ))}
    </div>
  )
}

export default Home

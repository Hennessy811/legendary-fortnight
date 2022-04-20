import { format } from "date-fns"
import fs from "fs-jetpack"
import Jimp from "jimp"
import { NextApiRequest, NextApiResponse } from "next"

const IMG_PATH = "./tmp/tables/"
const IMG_PATH_SAVE = "./tmp/dataset/"

const imgSizes = {
  width: 600,
  height: 434,
}

const areas = {
  tableCards: {
    x: 0.33,
    y: 0.31,
    w: 0.34,
    h: 0.2,
  },
  pocketCards: {
    x: 0.43,
    y: 0.6,
    w: 0.13,
    h: 0.1,
  },
  buttons: {
    x: 0.5,
    y: 0.92,
    w: 0.5,
    h: 0.1,
  },
}

const scaleX = (x: number) => x * imgSizes.width
const scaleY = (y: number) => y * imgSizes.height

const saveTableCards = (data) => {
  const { x, y, w, h } = areas.tableCards
  const fileName = `table-cards/${format(new Date(), "dd-HH:mm:ss")}.png`

  data
    .crop(scaleX(x), scaleY(y), scaleX(w), scaleY(h))
    .write(`${IMG_PATH_SAVE}/${fileName}`)
}

const savePocketCards = (data) => {
  const { x, y, w, h } = areas.pocketCards
  const fileName = `pocket-cards/${format(new Date(), "dd-HH:mm:ss")}.png`

  data
    .crop(scaleX(x), scaleY(y), scaleX(w), scaleY(h))
    .write(`${IMG_PATH_SAVE}/${fileName}`)
}

const saveButtons = (data) => {
  const { x, y, w, h } = areas.buttons
  const fileName = `buttons/${format(new Date(), "dd-HH:mm:ss")}.png`

  data
    .crop(scaleX(x), scaleY(y), scaleX(w), scaleY(h))
    .write(`${IMG_PATH_SAVE}/${fileName}`)
}

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const files = req.body.tables.map((t) => t.thumbnailUrl)
  console.log(req.body.tables.map((t) => t.name))

  files.forEach((file, i) => {
    const buffer = Buffer.from(file.split(",")[1], "base64")
    Jimp.read(buffer, (err, data) => {
      if (err) console.error(err)
      else {
        data.write(`${IMG_PATH}/table-${i}.png`)

        data.clone((err, img) => {
          if (err) console.log("error saving table cards")
          saveTableCards(img)
        })
        data.clone((err, img) => {
          if (err) console.log("error saving p cards")
          savePocketCards(img)
        })
        // data.clone((err, img) => saveButtons(img))
      }
    })
  })

  const savedFiles = await fs.listAsync(IMG_PATH)
  const extraFiles = savedFiles.length - files.length

  if (extraFiles > 0) {
    for (let i = files.length; i < savedFiles.length; i++) {
      const fileName = `${IMG_PATH}/table-${i}.png`
      fs.remove(fileName)
    }
  }

  res.json({ ok: true })
}

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const files = await fs.listAsync(IMG_PATH)

  const base64Files = files.map((file) => {
    const buffer = fs.read(`${IMG_PATH}/${file}`, "buffer")
    return `data:image/png;base64,${buffer.toString("base64")}`
  })

  res.json({ tables: base64Files })
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") post(req, res)
  else if (req.method === "GET") get(req, res)
  else res.status(404).end()
}

export default handler

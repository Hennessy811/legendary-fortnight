const fs = require("fs-jetpack")
const Jimp = require("jimp")

const cardsDir = "../tmp/templates/cards"

const getRandom = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available")
  while (n--) {
    var x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

const main = async () => {
  const files = await fs.listAsync(cardsDir)

  const y = 25
  const w = 40
  const offset = 0.5

  // // get 1000 random slices of files by 5 elements
  // const res = []
  // for (let i = 0; i < 260; i++) {
  //   const randomCards = getRandom(files, 5)
  //   res.push(randomCards)
  // }

  // get 15 pairs of each file
  // const res = []
  // for (let i = 0; i < 52; i++) {
  //   const randomCards = [...getRandom(files, 1), files[i]]
  //   res.push(randomCards)
  // }

  const res = []
  for (const file of files) {
    for (let i = 0; i < 5; i++) {
      const randomCards = [...getRandom(files, 1), file]
      res.push(randomCards)
    }
  }

  // check that every item from files is in res at least 15 times
  const resFiles = res.flat()

  const valid = files.every((file) => {
    return resFiles.filter((resFile) => resFile === file).length >= 5
  })

  if (!valid) {
    console.log("not valid")
    return
  }
  const names = res.map((r) => r.join("-"))
  const duplicates = names.filter((v, i, a) => a.indexOf(v) !== i)

  if (duplicates.length) {
    console.log("duplicates found")
    // return
  }

  for await (const group of res) {
    // const cards = []
    // // for await of cycle iterating over the files
    // for await (const file of group) {
    //   const img = await Jimp.read(`${cardsDir}/${file}`)
    //   cards.push(img)
    // }

    const cardNames = group.map((file) => file.split(".")[0])

    // const table = await Jimp.read("../tmp/templates/table.png")

    // const composed = await table.composite(cards[0], offset, y)
    // await composed.composite(cards[1], w + offset, y)
    // await composed.composite(cards[2], (w + offset) * 2, y)
    // await composed.composite(cards[3], (w + offset) * 3, y)
    // await composed.composite(cards[4], (w + offset) * 4, y)

    const fileName = cardNames.join("-")

    // !NOTE: snippet to generate hands
    const cards = []
    // for await of cycle iterating over the files
    for await (const file of group) {
      const img = await Jimp.read(`${cardsDir}/${file}`)
      const cropped = await img.crop(
        0,
        0,
        img.bitmap.width,
        img.bitmap.height / 3
      )
      cards.push(cropped)
    }

    const table = await Jimp.read("../tmp/templates/hand.png")
    const composed = await table.composite(cards[0], offset, y)
    await composed.composite(cards[1], w + offset, y)

    await composed.writeAsync(`../tmp/composed-hands/${fileName}.png`)
  }

  // const cards = []
  // // for await of cycle iterating over the files
  // for await (const file of files) {
  //   const img = await Jimp.read(`${cardsDir}/${file}`)
  //   const cropped = await img.crop(
  //     0,
  //     0,
  //     img.bitmap.width,
  //     img.bitmap.height / 3
  //   )
  //   cards.push(cropped)
  // }

  // const table = await Jimp.read("../tmp/templates/hand.png")
  // const composed = await table.composite(cards[0], offset, y)
  // await composed.composite(cards[1], w + offset, y)

  // await composed.writeAsync("../tmp/composed/composed.png")

  // we have array of items
  // we need to create new array of arrays, containing combinations of items
  // each item should appear in at least 15 different combinations
}

main()

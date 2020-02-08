export const blankCard = { index: undefined, id: undefined }
export const blankState = [blankCard, blankCard]

export const shuffle = array => {
  // clone to stop mutation
  const tmp = array.concat([])
  // durstenfeld shuffle algorithm.
  for (var i = tmp.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = tmp[i]
    tmp[i] = tmp[j]
    tmp[j] = temp
  }
  return tmp
}

export const generateCardArray = (count = 7) => {
  const cards = [...Array(count).keys()].map(item => ({
    id: `card_${item}`,
    checked: false,
    url: `https://i.picsum.photos/id/4${item}/200/300.jpg`
  }))
  const duplicateCards = [...cards, ...cards]
  const addExtraCard = [
    ...duplicateCards,
    {
      id: `card_${count + 1}`,
      checked: false,
      url: `https://i.picsum.photos/id/1${count + 1}/200/300.jpg`
    }
  ]
  return addExtraCard
}

export const generateShuffledCardArray = () => shuffle(generateCardArray())

export const getUncheckedCardsLength = arr => arr.filter(({ checked }) => !checked).length

export const updateCardList = (arr, id) =>
  arr.map(item => (item.id === id ? { ...item, checked: true } : item))

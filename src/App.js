import React, { useState, useEffect, useRef } from 'react'

import './App.css'

const blankCard = { index: undefined, id: undefined }
const blankState = [blankCard, blankCard]

const shuffle = array => {
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

const generateCardArray = (count = 7) => {
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

const generateShuffledCardArray = () => shuffle(generateCardArray())

const getUncheckedCardsLength = arr => arr.filter(({ checked }) => !checked).length

const updateCardList = (arr, id) =>
  arr.map(item => (item.id === id ? { ...item, checked: true } : item))

const App = () => {
  const [cardList, setCardList] = useState([])
  const [open, setOpen] = useState(blankState)
  const timer = useRef(null)
  const cardsLeft = getUncheckedCardsLength(cardList)

  const generateNewDeck = () => {
    setCardList(generateShuffledCardArray())
    setOpen(blankState)
  }

  const updateState = (index, id) => {
    switch (true) {
      // if two cards open, reset and open (only happens due to animation delay)
      case !!(open[0].id && open[1].id):
        clearTimeout(timer.current)
        setOpen([{ index, id }, blankCard])
        break
      // if matching pair, check cards and reset
      case open[0].id === id:
        setCardList(updateCardList(cardList, id))
        setOpen(blankState)
        break
      // if one card open, open second then reset after timeout
      case !!open[0].id:
        setOpen([open[0], { index, id }])
        timer.current = setTimeout(() => {
          timer.current = null
          setOpen(blankState)
        }, 800)
        break
      // if no cards open, open new card
      default:
        setOpen([{ index, id }, blankCard])
        break
    }
  }

  useEffect(() => {
    generateNewDeck()
  }, [])

  return (
    <div className="container">
      <div className="game__container">
        {cardList.map(({ url, checked, id }, index) => {
          return (
            <div
              key={index}
              className="card__container"
              onClick={() => (index !== open[0].index ? updateState(index, id) : {})}
            >
              <div
                className={`card__inner ${(checked ||
                  index === open[0].index ||
                  index === open[1].index) &&
                  'card__open'}`}
              >
                <div className="card__front" />
                <div className="card__back" style={{ background: `url(${url})` }} />
              </div>
            </div>
          )
        })}
      </div>
      {cardsLeft === 1 && (
        <div onClick={generateNewDeck} className="reset__link">
          Reset Game
        </div>
      )}
    </div>
  )
}

export default App

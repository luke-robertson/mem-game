import React, { useState, useEffect, useRef } from 'react'
import {
  blankCard,
  blankState,
  generateShuffledCardArray,
  getUncheckedCardsLength,
  updateCardList
} from './helpers'

import './App.css'

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
      // cant make this default case as will match cards if one of the selected maches new one
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

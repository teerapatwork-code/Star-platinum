import { useState, useEffect } from 'react'
import { accumulatedStars } from '../utils/starCalc'

const storageKey = (memberName) =>
  `campaign_star_diary_${memberName.trim().toLowerCase()}`

function loadDiary(memberName) {
  if (!memberName) return []
  try {
    const raw = localStorage.getItem(storageKey(memberName))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveDiary(memberName, diary) {
  if (!memberName) return
  try {
    localStorage.setItem(storageKey(memberName), JSON.stringify(diary))
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function useDiary(memberName) {
  const [diary, setDiary] = useState([])

  // Reload diary whenever memberName changes
  useEffect(() => {
    setDiary(loadDiary(memberName))
  }, [memberName])

  function addEntry(entryData) {
    setDiary((prev) => {
      const currentBalance = accumulatedStars(prev) + entryData.starsEarned
      const entry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...entryData,
        cumulativeBalance: currentBalance,
      }
      const next = [entry, ...prev]
      saveDiary(memberName, next)
      return next
    })
  }

  function clearDiary() {
    setDiary([])
    saveDiary(memberName, [])
  }

  return { diary, addEntry, clearDiary }
}

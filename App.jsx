import { useState, useEffect } from 'react'
import GradeList from './grade/GradeList'

function App () {
  useEffect(() => {
    console.log('App inited')
  }, [])

  return <GradeList />
}

export default App

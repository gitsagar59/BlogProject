import './App.css'
import React,{useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import { Footer, Header } from './components/index'
import {login, logout} from './store/authSlice'
import { Outlet } from 'react-router-dom';
import authService from './appwrite/auth'

function App() {
  const[loading, setLoading] = useState(true)  //loading state bnana is good when we requesting data from any network or API , it helps to render conditionally, if true show load if not dont show

  //application jasie hi mount hui us smay loading state true hyy because we gonna use useEffect and it will work when componenet render, inside useEffect loading state will be false
  
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData) { 
        dispatch(login({userData})) 
      } else { 
        dispatch(logout()) 
      }
    }).finally(() => {
      setLoading(false)
    })
  }, [])
  
  return !loading ? (
    <div className='min-h-sc flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header/>
          <main>
        TODO:  <Outlet/>
          </main>
        <Footer/>
      </div>
    </div>
  ) : null

} 

export default App

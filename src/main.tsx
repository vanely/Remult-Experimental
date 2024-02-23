import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './Auth'
import './index.css'

/**  
 * - Pay careful attention to the order of the wrappers around the app.
 * - The authentication component should wrap the app so that it acts as a barrier to the app, and first wall before the API
 * - As of now I don't see a reason why it shouldn't wrap the redux global state <Provider></Provider> as well
 *   this would allow for client state to be hidden behind authentication.
*/
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth/>
  </React.StrictMode>
)

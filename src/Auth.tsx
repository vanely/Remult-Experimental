import { FormEvent, useEffect, useState } from 'react';
import { remult } from 'remult';
import App from './App';

export default function Auth() {
  const [userName, setUserName] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    const result = await fetch('/api/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userName}),
    });

    if (result.ok) {
      remult.user = await result.json();
      setSignedIn(true);
      setUserName('');
    } else {
      console.error(['Unable to sign user in: ', await result.json()]);
    }
  }

  const signOut = async () => {
    const result = await fetch('/api/signOut', {
      method: 'POST',
    });
    remult.user = undefined;
    setSignedIn(false);
  }

  useEffect(() => {
    fetch('/api/currentUser')
    .then(async (res) => {
      remult.user = await res.json();
      if (remult.user?.id) {
        setSignedIn(true);
      }
    })
  }, []);

  if (!signedIn) {
    return (
      <>
        <h1>Tasks</h1>
        <main>
          <form onSubmit={(e) => signIn(e)}>
            <input 
              type="text" 
              onChange={(e) => setUserName(e.target.value)}
              value={userName} 
              placeholder="Username, Ylias or Leila" 
            />
            <input type="submit" value="Sign In"/>
          </form>
        </main>
      </>
    )
  }

  return (
    <>
      <header>
        Hello { remult.user!.name } <button onClick={() => signOut()}>Sign Out</button>
      </header>
      <App/>
    </>
  )
}
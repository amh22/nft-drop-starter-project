import React, { useEffect, useState } from 'react'
import './App.css'
import twitterLogo from './assets/twitter-logo.svg'
import CandyMachine from './CandyMachine'

// Constants
const TWITTER_HANDLE = 'andrewmhenry22'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  const [phantomWallet, setPhantomWallet] = useState()

  const [walletAddress, setWalletAddress] = useState(null)

  // Actions

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window

      if (solana) {
        if (solana.isPhantom) {
          // console.log('Phantom wallet found!')
          setPhantomWallet(true)

          // The solana object gives us a function that will allow us to connect directly with the user's wallet!
          // BUT first the User must of course give permission! This is done with our 'Connect Wallet' button

          const response = await solana.connect({ onlyIfTrusted: true })
          // console.log('Connected with Public Key:', response.publicKey.toString())

          // Set the user's publicKey in state
          setWalletAddress(response.publicKey.toString())
        }
      } else {
        // console.log('Phantom wallet NOT found!')
        // alert('Solana object not found! Get a Phantom Wallet 👻')
        setPhantomWallet(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Connect Wallet
  const connectWallet = async () => {
    const { solana } = window

    if (solana) {
      const response = await solana.connect()
      // console.log('Connected with Public Key:', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  }

  // Render 'Connect Wallet' button if User not connected
  const renderNotConnectedContainer = () => (
    <button
      className='cta-button connect-wallet-button'
      onClick={connectWallet}
      disabled={!phantomWallet}
      style={{
        cursor: !phantomWallet ? 'not-allowed' : 'pointer',
        marginBottom: '20px',
      }}
    >
      {!phantomWallet ? '❗ Connect to Wallet' : 'Connect to Wallet'}
    </button>
  )

  // Render 'Get a Phantom Wallet' message if no Phantom wallet found (i.e. 'solana.phantom' not found)
  const renderWalletNotFoundContainer = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '260px',
        background: '#fff',
        borderRadius: '10px',
        margin: '10px auto',
        padding: '30px 40px 16px 40px',
      }}
    >
      <p style={{ color: 'black' }}>❗ You will need a Phantom Wallet before you can connect to this app.</p>
      <p style={{ color: 'black' }}>Get your Phantom Wallet 👻 here:</p>
      <p style={{ padding: '0px 0px 10px 0px' }}>
        <a href='https://phantom.app/'>Phantom App</a>
      </p>
    </div>
  )

  // When our component first mounts, let's check to see if we have a connected Phantom Wallet

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad) // the Phantom Wallet team suggests to wait for the window to fully finish loading before checking for the solana object.
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header'>🍭 Sauce Candy</p>
          <p className='sub-text'>An NFT drop machine with fair mint</p>
          <p className='sub-text'>Season #1: Hot Ones! 🔥</p>

          {!walletAddress && renderNotConnectedContainer()}
          {!phantomWallet && renderWalletNotFoundContainer()}
        </div>
        {/* Check for walletAddress and then pass in walletAddress */}
        {walletAddress && <CandyMachine walletAddress={window.solana} />}
      </div>
      <div className='footer-container'>
        <img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
        <a
          style={{ color: '#000' }}
          className='footer-text'
          href={TWITTER_LINK}
          target='_blank'
          rel='noreferrer'
        >{`built by @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  )
}

export default App

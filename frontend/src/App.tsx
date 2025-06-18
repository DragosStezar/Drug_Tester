import Header from './components/Header'
import Prediction from './components/Prediction'
import Interactions from './components/Interactions'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Prediction />
        <Interactions />
        <Features />
      </main>
      <Footer />
    </>
  )
}

export default App

import { AuthProvider } from './contexts/authContext'
import { Button } from './components/ui/button'

function App() {

  return (
    <>
    <AuthProvider>
      <p className='text-white'>
        This is frontend made with React
        <Button>click here</Button>
      </p>
    </AuthProvider>
    </>
  )
}

export default App

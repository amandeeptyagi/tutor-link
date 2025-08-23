import { AuthProvider } from './contexts/authContext'

function App() {

  return (
    <>
    <AuthProvider>
      <p className='text-white'>
        This is frontend made with React
      </p>
    </AuthProvider>
    </>
  )
}

export default App

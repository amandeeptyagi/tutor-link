import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold">Find the best Tuition Teachers</h1>
      <p className="mt-3 text-gray-600">Search by subject, area, and ratings.</p>
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/login"><Button>Login</Button></Link>
      </div>
    </section>
  )
}

export default Home;
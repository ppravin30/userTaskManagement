import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function Home() {

  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')

  if (!userCookie) 
    if (!userCookie) {
      redirect('/create-user') // No cookie → ask to sign up
    }

    const { email } = JSON.parse(decodeURIComponent(userCookie.value))

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      redirect('/create-user') // Cookie exists but user was deleted or not found
    }
  

  
  

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to the Task Manager, {user.name}!
        </h1>
        <p className="text-gray-700">Manage your tasks efficiently with our application.</p>
      </main>
    </div>
  )
}








/*
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function Home() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')

  if (!userCookie) {
    redirect('/create-user') // 👈 Require signup first
  }

  const { email } = JSON.parse(decodeURIComponent(userCookie.value))

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    redirect('/create-user') // 👈 Redirect to signup if user not found
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to the Task Manager, {user.name}!
        </h1>
        <p className="text-gray-700">Manage your tasks efficiently with our application.</p>
      </main>
    </div>
  )
}
  */





/*
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function Home() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')

  if (!userCookie) {
    redirect('/user-login') // or '/create-user'
  }

  const { email } = JSON.parse(decodeURIComponent(userCookie.value))

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    redirect('/user-login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to the Task Manager, {user.name}!
        </h1>
        <p className="text-gray-700">Manage your tasks efficiently with our application.</p>
      </main>
    </div>
  )
}

*/






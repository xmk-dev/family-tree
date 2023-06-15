import Image from 'next/image'
import { Command } from './client'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <h1 className="text-4xl uppercase font-extrabold">Family Tree</h1>
      <Command />
    </main>
  );
}

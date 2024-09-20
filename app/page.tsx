import Link from "next/link"

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="mrr">Fake MRR Generator</Link>
      <Link href="notifs">Fake Stripe Notifs</Link>
    </div>
  )
}

export default page
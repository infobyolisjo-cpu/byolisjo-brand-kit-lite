import Link from 'next/link';

export default function Success() {
  return (
    <main>
      <div className="card">
        <h2 className="font-serif text-xl mb-2">Payment successful (Test Mode)</h2>
        <p className="opacity-80 mb-3">Click below to download your brand kit.</p>
        <Link href="/">Back to Home</Link>
      </div>
    </main>
  );
}

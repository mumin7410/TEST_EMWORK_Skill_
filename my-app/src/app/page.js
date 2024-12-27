// pages/index.js or wherever your Home component is
import Link from "next/link";  // Import Link from next/link

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <Link href="/leave">
          <button className="btn btn-primary mb-3 mx-2">Go to Leave Page</button>
        </Link>
        <Link href="/monitor">
          <button className="btn btn-secondary mb-3 mx-2">Go to Monitor Page</button>
        </Link>
      </div>
    </div>
  );
}

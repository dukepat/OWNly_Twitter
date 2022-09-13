import Link from "next/link";
import React from "react";

function A(props) {
  return (
    <div>
      a<Link href={`/screens/B`}>B</Link>
    </div>
  );
}

export default A;

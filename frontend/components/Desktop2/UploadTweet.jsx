import Link from "next/link";
import React from "react";

function UploadTweet(props) {
  return (
    <div>
      <Link href="/screens/DeployTweet" className="launch_app">
        <b>Upload Tweet</b>
      </Link>
    </div>
  );
}

export default UploadTweet;

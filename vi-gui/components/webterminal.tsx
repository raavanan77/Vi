import React from "react";

const WebsiteEmbed = () => {
  return (
    <div>
      <iframe
        src="http://0.0.0.0:7681" // Replace with the desired URL
        title="Embedded Website"
        className="min-h-[100vh] flex-1 h-full w-full rounded-xl bg-muted/50   "
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  );
};

export default WebsiteEmbed;

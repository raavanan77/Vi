import {Dashboard} from "./dashboard/page";

export default function Home() {
  return (
    <div className="flex min-h-[100] w-full p-2">
      <div className="w-full">
        <Dashboard />
      </div>
    </div>
  );
}

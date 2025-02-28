import AddDevice from "./deviceHandler";

export default async function Page({
  params,
}: {
  params: { devtype: string; device: string };
}) {
  const { devtype, device } = await params;
  if (devtype !== "client" && devtype !== "dut") {
    console.log(devtype);
    return <h1>Watcha doing blud!</h1>;
  }
  return <AddDevice devtype={devtype} device={device} />;
}

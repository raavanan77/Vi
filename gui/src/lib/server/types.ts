export type basedevices = {
    name: string;
    platform: string;
    wanip: string;
    devtype: string;
}

export type DeviceProps = {
    name: string;
    username: string;
    password: string;
    wanip: string;
    sshport: number;
    rpcport: number;
    platform: string;
    laniface: string;
    waniface: string;
    wlaniface: string;
    extaprops: JSON;
}

export type DUTProps = {
    name: string;
    username: string;
    password: string;
    serial: string;
    baudrate: number;
    wanip: string;
    waniface: string;
    sshport: number;
    platform: string;
    extaprops: JSON;
}
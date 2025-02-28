export interface MultipleSelectorControlledProps {
  params: any;
}

export enum TestMethod {
  ExecuteSerialCommand = "execute_serial_command",
  ExecuteSSHCommand = "execute_ssh_command",
  ExecuteClientCommand = "execute_client_cmd",
}

export interface SelectItemProps {
  value: string;
  label: string;
}

export type Testcase = {
  name: string;
  platform: string;
  area: string;
};

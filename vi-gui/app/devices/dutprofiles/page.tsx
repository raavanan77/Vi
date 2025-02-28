"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash,
  Wifi,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { deleteDUTProfile, fetchclientdev } from "@/app/api";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@radix-ui/react-popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandEmpty, CommandList } from "cmdk";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { SelectContent, SelectGroup, SelectValue } from "@radix-ui/react-select";

const DUTProfileViewer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [duts, setDuts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [clientTypes, setClientTypes] = useState([]);
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [newProfile, setNewProfile] = useState({
    profilename: "",
    dut_id: "",
    selectedDevices: [], // Array of { deviceId, clientTypeId }
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDUTs();
    fetchDevices();
    fetchClientTypes();
    fetchProfiles();
  }, []);

  const fetchDUTs = async () => {
    try {
      const response = await fetchclientdev("duts");
      const data = await response;
      setDuts(data);
      console.log("DUT", duts);
    } catch (error) {
      console.error("Error fetching DUTs:", error);
      setError("Failed to fetch DUTs");
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetchclientdev("client");
      const data = await response;
      setDevices(data);
      console.log("Clients", devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError("Failed to fetch devices");
    }
  };

  const fetchClientTypes = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/device/client/type/get/",
      );
      const data = await response.json();
      console.log("Client Types", data);
      setClientTypes(data);
    } catch (error) {
      console.error("Error fetching client types:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/dut/profile/get/",
      );
      const data = await response.json();
      console.log("Profiles", data);
      setProfiles(data.map((profile) => ({ ...profile, expanded: false })));
      console.log("PROFILE:",newProfile)
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const createProfile = async () => {
    try {
      // Transform the selected devices data for the API
      const clientslist = newProfile.selectedDevices.map((d) => d.deviceId);
      const clientIdlist = newProfile.selectedDevices.map(
        (d) => d.clientTypeId,
      );

      const response = await fetch(
        "http://localhost:8000/api/dut/profile/add/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profilename: newProfile.profilename,
            dut_id: newProfile.dut_id,
            clientslist: clientslist,
            clientIdlist: clientIdlist,
          }),
        },
      );

      if (response.ok) {
        setShowNewProfileModal(false);
        fetchProfiles();
        setNewProfile({
          profilename: "",
          dut_id: "",
          selectedDevices: [],
        });
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };
  const NewProfileModal = () => (
    <Card className="p-6 rounded-lg w-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Create New Profile</h3>
      </div>
  
      <div className="space-y-4">
        <div>
          <Label>Profile Name</Label>
          <Input
            type="text"
            className="p-2 border rounded w-full"
            value={newProfile.profilename}
            onChange={(e) =>
              setNewProfile({ ...newProfile, profilename: e.target.value })
            }
          />
        </div>
  
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full p-2 justify-between"
                onChange={(e) => {setNewProfile({ ...newProfile, dut_id: e.target.key })
              console.log("DUT changed?:",newProfile.dut_id)}}
              >
                {value
                  ? duts.find((dut) => dut.name === value)?.name
                  : "Select DUT..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <Command>
                <CommandList>
                  <CommandEmpty>No DUT found</CommandEmpty>
                  {duts.map((DUT) => (
                    <CommandItem
                      key={DUT.id}
                      value={DUT.name}
                      onSelect={(currentValue) => {
                        console.log("Selected dut:",newProfile)
                        setValue(currentValue);
                        setNewProfile({
                          ...newProfile,
                          dut_id: DUT.id, // Set the DUT id here
                        });
                        setOpen(false);
                      }}
                    >
                      <span>{DUT.name} - {DUT.platform} - {DUT.wanip}</span>
                      <Check
                        className={cn(
                          "ml-auto",
                          value === DUT.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
  
        <div className="w-full">
          <Command>
            <CommandInput placeholder="Search Client" />
            <CommandList>
              <CommandGroup>
                {devices.map((device) => {
                  const selectedDevice = newProfile.selectedDevices.find(
                    (d) => d.deviceId === device.id
                  );
                  return (
                    <div key={device.id} className="p-2 hover:bg-gray-100">
                      <div className="flex items-center space-x-4 w-full">
                        <Checkbox
                          id={`device-${device.id}`}
                          checked={selectedDevice !== undefined}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [
                                  ...newProfile.selectedDevices,
                                  { deviceId: device.id, clientTypeId: "" },
                                ]
                              : newProfile.selectedDevices.filter(
                                  (d) => d.deviceId !== device.id
                                );
                            setNewProfile({
                              ...newProfile,
                              selectedDevices: updated,
                            });
                          }}
                        />
                        <div className="flex-1 space-y-1">
                          <Label htmlFor={`device-${device.id}`} className="cursor-pointer">
                            {device.name}
                            <span className="block text-sm text-gray-500">{device.deviceplatform}</span>
                          </Label>
                        </div>
                        {selectedDevice && (
                          <div className="min-w-[200px]">
                            <Select
                              value={selectedDevice.clientTypeId}
                              onValueChange={(value) => {
                                const updatedDevices = newProfile.selectedDevices.map((d) =>
                                  d.deviceId === device.id
                                    ? { ...d, clientTypeId: value }
                                    : d
                                );
                                setNewProfile({
                                  ...newProfile,
                                  selectedDevices: updatedDevices,
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Client type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {clientTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
  
      <div className="mt-6 flex justify-end gap-2">
        <Button
          className="px-4 py-2 rounded"
          onClick={() => setShowNewProfileModal(false)}
        >
          Cancel
        </Button>
        <Button
          className="px-4 py-2"
          onClick={createProfile}
          disabled={
            !newProfile.profilename ||
            !newProfile.dut_id ||
            newProfile.selectedDevices.length === 0 ||
            newProfile.selectedDevices.some((d) => !d.clientTypeId)
          }
        >
          Create
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>DUT Profiles</CardTitle>
          <Button
            onClick={() => setShowNewProfileModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-purple-600"
          >
            <Plus size={16} />
            New Profile
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="border rounded-lg">
                <div
                  className="flex items-center p-4 bg-gray-50 rounded-t-lg cursor-pointer"
                  onClick={() => {
                    setProfiles(
                      profiles.map((p) =>
                        p.id === profile.id
                          ? { ...p, expanded: !p.expanded }
                          : p,
                      ),
                    );
                  }}
                >
                  {profile.expanded ? (
                    <ChevronDown size={20} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-500" />
                  )}
                  <div className="flex-1 ml-2">
                    <h3 className="font-medium">{profile.profilename}</h3>
                    <p className="text-sm text-gray-500">
                      {profile.dut_id.platform}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const response = deleteDUTProfile(profile.profilename);
                      if (response) {
                        fetchProfiles();
                      }
                    }}
                  >
                    Delete Profile
                  </button>
                </div>

                {profile.expanded && (
                  <div className="p-4 border-t">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">DUT Details</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-sm">
                            Name: {profile.dut_id.name}
                          </p>
                          <p className="text-sm">IP: {profile.dut_id.wanip}</p>
                          <p className="text-sm">
                            Platform: {profile.dut_id.platform}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Client Devices</h4>
                      <div className="space-y-2">
                        {profile.clientslist.map((client, index) => (
                          <div
                            key={client.id}
                            className="flex items-center p-3 bg-gray-50 rounded"
                          >
                            <Wifi size={16} className="text-gray-500" />
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium">
                                {client.name}
                                <span className="ml-2 text-blue-500">
                                  (
                                  {profile.clientIdlist[index]?.name ||
                                    "No type"}
                                  )
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.wanip} - {client.deviceplatform}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {showNewProfileModal && <NewProfileModal />}
    </div>
  );
};

export default DUTProfileViewer;

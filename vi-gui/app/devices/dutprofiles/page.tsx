"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash, Wifi } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchclientdev } from '@/app/api';

const DUTProfileViewer = () => {
  const [profiles, setProfiles] = useState([]);
  const [duts, setDuts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [newProfile, setNewProfile] = useState({
    profilename: '',
    dut_id: '',
    clientslist: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDUTs();
    fetchDevices();
    fetchProfiles();
  }, []);

  const fetchDUTs = async () => {
    try {
      const response = await fetchclientdev('duts');
      const data = await response;
      setDuts(data);
      console.log("DUT",duts)
    } catch (error) {
      console.error('Error fetching DUTs:', error);
      setError('Failed to fetch DUTs');
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetchclientdev("client");
      const data = await response;
      setDevices(data);
      console.log("Clients",devices)
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to fetch devices');
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles/');
      const data = await response.json();
      setProfiles(data.map(profile => ({ ...profile, expanded: false })));
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to fetch profiles');
    }
  };

  const createProfile = async () => {
    try {
      const response = await fetch('/api/profiles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value, // For Django CSRF protection
        },
        body: JSON.stringify({
          profilename: newProfile.profilename,
          dut_id: newProfile.dut_id,
          clientslist: newProfile.clientslist
        })
      });

      if (response.ok) {
        setShowNewProfileModal(false);
        fetchProfiles();
        setNewProfile({
          profilename: '',
          dut_id: '',
          clientslist: []
        });
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile');
    }
  };

  const NewProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-medium mb-4">Create New Profile</h3>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Profile Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newProfile.profilename}
              onChange={(e) => setNewProfile({...newProfile, profilename: e.target.value})}
              placeholder="Enter profile name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select DUT</label>
            <select
              className="w-full p-2 border rounded"
              value={newProfile.dut_id}
              onChange={(e) => setNewProfile({...newProfile, dut_id: e.target.value})}
            >
              <option value="">Select DUT</option>
              {duts.map(dut => (
                <option key={dut.id} value={dut.id}>
                  {dut.dutname} - {dut.dutplatform} ({dut.wanip})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Client Devices</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
              {devices.map(device => (
                <div key={device.id} className="flex items-center p-1 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={newProfile.clientslist.includes(device.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...newProfile.clientslist, device.id]
                        : newProfile.clientslist.filter(id => id !== device.id);
                      setNewProfile({...newProfile, clientslist: updated});
                    }}
                    className="mr-2"
                  />
                  <label className="flex-1 text-sm">
                    {device.devicename} - {device.deviceplatform} ({device.wanip})
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            onClick={() => {
              setShowNewProfileModal(false);
              setError('');
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={createProfile}
            disabled={!newProfile.profilename || !newProfile.dut_id || newProfile.clientslist.length === 0}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>DUT Profiles</CardTitle>
          <button 
            onClick={() => setShowNewProfileModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={16} />
            New Profile
          </button>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No profiles created yet. Click "New Profile" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {profiles.map(profile => (
                <div key={profile.id} className="border rounded-lg">
                  <div 
                    className="flex items-center p-4 bg-gray-50 rounded-t-lg cursor-pointer"
                    onClick={() => {setProfiles(profiles.map(p => p.id === profile.id ? { ...p, expanded: !p.expanded } : p));}}
                  >
                    {profile.expanded ? (
                      <ChevronDown size={20} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-500" />
                    )}
                    <div className="flex-1 ml-2">
                      <h3 className="font-medium">{profile.profilename}</h3>
                      <p className="text-sm text-gray-500">
                        DUT: {profile.dut_id.dutname} ({profile.dut_id.dutplatform})
                      </p>
                    </div>
                  </div>

                  {profile.expanded && (
                    <div className="p-4 border-t">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">DUT Details</h4>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm">Name: {profile.dut_id.dutname}</p>
                            <p className="text-sm">IP: {profile.dut_id.wanip}</p>
                            <p className="text-sm">Platform: {profile.dut_id.dutplatform}</p>
                            <p className="text-sm">Interface: {profile.dut_id.waniface}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Client Devices</h4>
                        <div className="space-y-2">
                          {profile.clientslist.map(client => (
                            <div key={client.id} className="flex items-center p-3 bg-gray-50 rounded">
                              <Wifi size={16} className="text-gray-500" />
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium">{client.devicename}</p>
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
          )}
        </CardContent>
      </Card>
      {showNewProfileModal && <NewProfileModal />}
    </div>
  );
};

export default DUTProfileViewer;
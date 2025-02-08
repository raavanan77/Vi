"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash, Wifi } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
const AddDUTProfile = () => {
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'Router Profile A',
      dutDevice: {
        id: 1,
        name: 'Cisco Router X',
        ip: '192.168.1.1',
        type: 'Router'
      },
      clients: [
        { id: 1, name: 'Client 1', ip: '192.168.1.100', type: 'Workstation' },
        { id: 2, name: 'Client 2', ip: '192.168.1.101', type: 'Mobile' }
      ],
      expanded: false
    },
    {
      id: 2,
      name: 'Switch Profile B',
      dutDevice: {
        id: 2,
        name: 'HP Switch Y',
        ip: '192.168.1.2',
        type: 'Switch'
      },
      clients: [
        { id: 3, name: 'Client 3', ip: '192.168.1.102', type: 'Server' }
      ],
      expanded: false
    }
  ]);
  const route = useRouter();
  const addNewProfile = () => {
    const newProfile = {
      id: profiles.length + 1,
      name: `New Profile ${profiles.length + 1}`,
      dutDevice: {
        id: profiles.length + 1,
        name: 'New Device',
        ip: '192.168.1.1',
        type: 'Router'
      },
      clients: [],
      expanded: true
    };
    setProfiles([...profiles, newProfile]);
  };

  return (
    <div >
      <Card className="w-full p-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add DUT Profiles</CardTitle>
        </CardHeader>
        <CardContent>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Select DUT <ChevronDown/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            Cisco
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDUTProfile;